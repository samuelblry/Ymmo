from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.dependencies import require_authenticated_user
from app.models.article import Article
from app.models.listing import Bien
from app.models.social import FavoriArticle, FavoriBien
from app.schemas.bien import BienPublic
from app.schemas.user import CurrentUser

router = APIRouter(prefix="/api/favoris", tags=["Favoris"])


@router.get("/biens", response_model=list[BienPublic])
def list_favoris_biens(
    current: CurrentUser = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
) -> list[Bien]:
    stmt = (
        select(Bien)
        .join(FavoriBien, FavoriBien.id_bien == Bien.id_bien)
        .options(selectinload(Bien.images))
        .where(FavoriBien.id_user == current.id)
        .order_by(FavoriBien.date_ajout.desc())
    )
    return list(db.scalars(stmt))


@router.post("/biens/{id_bien}", status_code=status.HTTP_201_CREATED)
def add_favori_bien(
    id_bien: int,
    current: CurrentUser = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    if not db.get(Bien, id_bien):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bien introuvable")
    exists = db.scalar(select(FavoriBien).where(FavoriBien.id_user == current.id, FavoriBien.id_bien == id_bien))
    if not exists:
        db.add(FavoriBien(id_user=current.id, id_bien=id_bien))
        db.commit()
    return {"message": "Favori ajoute"}


@router.delete("/biens/{id_bien}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favori_bien(
    id_bien: int,
    current: CurrentUser = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
) -> None:
    favori = db.scalar(select(FavoriBien).where(FavoriBien.id_user == current.id, FavoriBien.id_bien == id_bien))
    if favori:
        db.delete(favori)
        db.commit()


@router.post("/articles/{id_article}", status_code=status.HTTP_201_CREATED)
def add_favori_article(
    id_article: int,
    current: CurrentUser = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    if not db.get(Article, id_article):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")
    exists = db.scalar(
        select(FavoriArticle).where(FavoriArticle.id_user == current.id, FavoriArticle.id_article == id_article)
    )
    if not exists:
        db.add(FavoriArticle(id_user=current.id, id_article=id_article))
        db.commit()
    return {"message": "Favori ajoute"}


@router.delete("/articles/{id_article}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favori_article(
    id_article: int,
    current: CurrentUser = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
) -> None:
    favori = db.scalar(
        select(FavoriArticle).where(FavoriArticle.id_user == current.id, FavoriArticle.id_article == id_article)
    )
    if favori:
        db.delete(favori)
        db.commit()
