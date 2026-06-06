from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Article(Base):
    __tablename__ = "articles"

    id_article: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_auteur: Mapped[int | None] = mapped_column(ForeignKey("employes.id_employe"), nullable=True)
    titre: Mapped[str] = mapped_column(String(300))
    contenu: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    statut: Mapped[str] = mapped_column(String(20), default="brouillon", index=True)
    date_envoi: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    auteur = relationship("Employe", back_populates="articles")
    stats = relationship("StatsArticle", back_populates="article", uselist=False, cascade="all, delete-orphan")
    favoris = relationship("FavoriArticle", back_populates="article", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="article", cascade="all, delete-orphan")
