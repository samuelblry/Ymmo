from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_authenticated_user
from app.models.article import Article
from app.models.listing import Bien
from app.models.social import Like
from app.models.stats import StatsArticle, StatsBien
from app.schemas.user import CurrentUser

router = APIRouter(prefix="/api/likes", tags=["Likes"])


@router.post("/biens/{id_bien}", status_code=status.HTTP_201_CREATED)
def like_bien(
    id_bien: int,
    current: CurrentUser = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    bien = db.get(Bien, id_bien)
    if not bien:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bien introuvable")
    exists = db.scalar(select(Like).where(Like.id_user == current.id, Like.id_bien == id_bien))
    if not exists:
        db.add(Like(id_user=current.id, id_bien=id_bien))
        stats = bien.stats or StatsBien(id_bien=id_bien)
        stats.nb_likes += 1
        bien.stats = stats
        db.commit()
    return {"message": "Like enregistre"}


@router.post("/articles/{id_article}", status_code=status.HTTP_201_CREATED)
def like_article(
    id_article: int,
    current: CurrentUser = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    article = db.get(Article, id_article)
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")
    exists = db.scalar(select(Like).where(Like.id_user == current.id, Like.id_article == id_article))
    if not exists:
        db.add(Like(id_user=current.id, id_article=id_article))
        stats = article.stats or StatsArticle(id_article=id_article)
        stats.nb_likes += 1
        article.stats = stats
        db.commit()
    return {"message": "Like enregistre"}
