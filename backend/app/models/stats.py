from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class StatsBien(Base):
    __tablename__ = "stats_biens"

    id_stat: Mapped[int] = mapped_column(primary_key=True)
    id_bien: Mapped[int] = mapped_column(ForeignKey("biens.id_bien"), unique=True)
    nb_vues: Mapped[int] = mapped_column(default=0)
    nb_clicks: Mapped[int] = mapped_column(default=0)
    nb_likes: Mapped[int] = mapped_column(default=0)
    score_popularite: Mapped[float] = mapped_column(Float, default=0)
    last_update: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    bien = relationship("Bien", back_populates="stats")


class StatsArticle(Base):
    __tablename__ = "stats_articles"

    id_stat: Mapped[int] = mapped_column(primary_key=True)
    id_article: Mapped[int] = mapped_column(ForeignKey("articles.id_article"), unique=True)
    nb_vues: Mapped[int] = mapped_column(default=0)
    nb_likes: Mapped[int] = mapped_column(default=0)
    score_popularite: Mapped[float] = mapped_column(Float, default=0)
    last_update: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    article = relationship("Article", back_populates="stats")
