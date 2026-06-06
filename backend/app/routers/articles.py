from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_roles
from app.models.article import Article
from app.models.stats import StatsArticle
from app.schemas.article import ArticleCreate, ArticleRead, ArticleUpdate
from app.schemas.user import CurrentUser

router = APIRouter(prefix="/api/articles", tags=["Articles"])


@router.get("", response_model=list[ArticleRead])
def list_articles(db: Session = Depends(get_db)) -> list[Article]:
    return list(db.scalars(select(Article).where(Article.statut == "publie").order_by(Article.date_envoi.desc())))


@router.get("/all", response_model=list[ArticleRead])
def list_all_articles(
    _: CurrentUser = Depends(require_roles("Marketing", "Direction")),
    db: Session = Depends(get_db),
) -> list[Article]:
    return list(db.scalars(select(Article).order_by(Article.date_envoi.desc())))


@router.get("/{id_article}", response_model=ArticleRead)
def get_article(id_article: int, db: Session = Depends(get_db)) -> Article:
    article = db.get(Article, id_article)
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")
    if not article.stats:
        article.stats = StatsArticle()
    article.stats.nb_vues += 1
    db.commit()
    db.refresh(article)
    return article


@router.post("", response_model=ArticleRead, status_code=status.HTTP_201_CREATED)
def create_article(
    payload: ArticleCreate,
    current: CurrentUser = Depends(require_roles("Marketing")),
    db: Session = Depends(get_db),
) -> Article:
    article = Article(**payload.model_dump(), id_auteur=current.id)
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.put("/{id_article}", response_model=ArticleRead)
def update_article(
    id_article: int,
    payload: ArticleUpdate,
    _: CurrentUser = Depends(require_roles("Marketing")),
    db: Session = Depends(get_db),
) -> Article:
    article = db.get(Article, id_article)
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(article, field, value)
    db.commit()
    db.refresh(article)
    return article


@router.delete("/{id_article}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(
    id_article: int,
    _: CurrentUser = Depends(require_roles("Marketing")),
    db: Session = Depends(get_db),
) -> None:
    article = db.get(Article, id_article)
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")
    db.delete(article)
    db.commit()
