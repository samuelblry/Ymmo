from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class FavoriBien(Base):
    __tablename__ = "favoris_biens"
    __table_args__ = (UniqueConstraint("id_user", "id_bien", name="uq_favori_bien_user_bien"),)

    id_favori: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    id_bien: Mapped[int] = mapped_column(ForeignKey("biens.id_bien"))
    date_ajout: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favoris_biens")
    bien = relationship("Bien", back_populates="favoris")


class FavoriArticle(Base):
    __tablename__ = "favoris_articles"
    __table_args__ = (UniqueConstraint("id_user", "id_article", name="uq_favori_article_user_article"),)

    id_favori: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    id_article: Mapped[int] = mapped_column(ForeignKey("articles.id_article"))
    date_ajout: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favoris_articles")
    article = relationship("Article", back_populates="favoris")


class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (
        UniqueConstraint("id_user", "id_bien", name="uq_like_user_bien"),
        UniqueConstraint("id_user", "id_article", name="uq_like_user_article"),
        CheckConstraint("id_bien IS NOT NULL OR id_article IS NOT NULL", name="ck_like_target"),
    )

    id_like: Mapped[int] = mapped_column(primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id_user"))
    id_bien: Mapped[int | None] = mapped_column(ForeignKey("biens.id_bien"), nullable=True)
    id_article: Mapped[int | None] = mapped_column(ForeignKey("articles.id_article"), nullable=True)
    date_ajout: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="likes")
    bien = relationship("Bien", back_populates="likes")
    article = relationship("Article", back_populates="likes")
