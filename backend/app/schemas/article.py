from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ArticleCreate(BaseModel):
    titre: str
    contenu: str
    image_url: str | None = None
    statut: str = "brouillon"


class ArticleUpdate(BaseModel):
    titre: str | None = None
    contenu: str | None = None
    image_url: str | None = None
    statut: str | None = None


class ArticleRead(BaseModel):
    id_article: int
    id_auteur: int | None
    titre: str
    contenu: str
    image_url: str | None
    statut: str
    date_envoi: datetime

    model_config = ConfigDict(from_attributes=True)
