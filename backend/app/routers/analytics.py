import pandas as pd
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_roles
from app.models.agency import Agence
from app.models.article import Article
from app.models.listing import Bien
from app.models.message import Message
from app.models.stats import StatsArticle, StatsBien
from app.schemas.analytics import PredictionResponse
from app.schemas.user import CurrentUser

router = APIRouter(prefix="/api", tags=["Stats & Analytics"])


@router.get("/stats/agences")
def stats_agences(
    _: CurrentUser = Depends(require_roles("Direction")),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Agence.nom_agence, func.count(Bien.id_bien), func.coalesce(func.sum(Bien.prix), 0))
        .join(Bien, Bien.id_agence == Agence.id_agence, isouter=True)
        .group_by(Agence.id_agence)
        .order_by(Agence.id_agence)
    )
    return [{"agence": name, "nb_biens": nb, "valeur_portefeuille": float(total)} for name, nb, total in db.execute(stmt)]


@router.get("/stats/biens")
def stats_biens(
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
):
    stmt = select(Bien.statut, func.count(Bien.id_bien)).where(Bien.id_agence == current.agence_id).group_by(Bien.statut)
    return [{"statut": statut, "total": total} for statut, total in db.execute(stmt)]


@router.get("/stats/articles")
def stats_articles(
    _: CurrentUser = Depends(require_roles("Marketing", "Direction")),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Article.id_article, Article.titre, StatsArticle.nb_vues, StatsArticle.nb_likes)
        .join(StatsArticle, StatsArticle.id_article == Article.id_article, isouter=True)
        .order_by(func.coalesce(StatsArticle.nb_vues, 0).desc())
    )
    return [{"id_article": row[0], "titre": row[1], "vues": row[2] or 0, "likes": row[3] or 0} for row in db.execute(stmt)]


@router.get("/analytics/popular")
def popular(
    _: CurrentUser = Depends(require_roles("Direction", "Commercial")),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Bien.id_bien, Bien.titre, StatsBien.nb_vues, StatsBien.nb_likes)
        .join(StatsBien, StatsBien.id_bien == Bien.id_bien, isouter=True)
        .order_by((func.coalesce(StatsBien.nb_vues, 0) + func.coalesce(StatsBien.nb_likes, 0) * 3).desc())
        .limit(10)
    )
    return [{"id_bien": row[0], "titre": row[1], "vues": row[2] or 0, "likes": row[3] or 0} for row in db.execute(stmt)]


@router.get("/analytics/report")
def report(
    _: CurrentUser = Depends(require_roles("Direction")),
    db: Session = Depends(get_db),
):
    return {
        "biens": db.scalar(select(func.count(Bien.id_bien))) or 0,
        "articles": db.scalar(select(func.count(Article.id_article))) or 0,
        "messages": db.scalar(select(func.count(Message.id_message))) or 0,
        "valeur_portefeuille": float(db.scalar(select(func.coalesce(func.sum(Bien.prix), 0))) or 0),
    }


@router.get("/analytics/predictions", response_model=list[PredictionResponse])
def predictions(
    _: CurrentUser = Depends(require_roles("Direction")),
    db: Session = Depends(get_db),
) -> list[PredictionResponse]:
    rows = db.execute(select(Bien.ville, Bien.prix, Bien.surface)).all()
    if not rows:
        return []
    df = pd.DataFrame(rows, columns=["ville", "prix", "surface"])
    df["prix_m2"] = df["prix"].astype(float) / df["surface"].clip(lower=1)
    grouped = df.groupby("ville", as_index=False).agg(prix_m2_moyen=("prix_m2", "mean"), volume=("ville", "count"))
    max_volume = max(float(grouped["volume"].max()), 1.0)
    grouped["score_attractivite"] = (grouped["volume"] / max_volume * 70) + 30
    grouped["estimation_90m2"] = grouped["prix_m2_moyen"] * 90
    return [
        PredictionResponse(
            ville=row.ville,
            prix_m2_moyen=round(float(row.prix_m2_moyen), 2),
            score_attractivite=round(float(row.score_attractivite), 2),
            estimation_90m2=round(float(row.estimation_90m2), 2),
        )
        for row in grouped.itertuples()
    ]
