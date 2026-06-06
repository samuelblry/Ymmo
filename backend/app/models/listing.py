from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Bien(Base):
    __tablename__ = "biens"

    id_bien: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_agence: Mapped[int] = mapped_column(ForeignKey("agences.id_agence"), index=True)
    id_commercial: Mapped[int | None] = mapped_column(ForeignKey("employes.id_employe"), nullable=True)
    titre: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    adresse: Mapped[str] = mapped_column(String(300))
    prix: Mapped[Decimal] = mapped_column(Numeric(15, 2), index=True)
    surface: Mapped[int] = mapped_column(index=True)
    type_bien: Mapped[str] = mapped_column(String(50), index=True)
    ville: Mapped[str] = mapped_column(String(100), index=True)
    code_postal: Mapped[str] = mapped_column(String(10))
    statut: Mapped[str] = mapped_column(String(20), default="disponible", index=True)
    nb_pieces: Mapped[int] = mapped_column(default=0)
    nb_chambres: Mapped[int] = mapped_column(default=0)
    nb_sdb: Mapped[int] = mapped_column(default=0)
    caracteristiques: Mapped[str | None] = mapped_column(Text, nullable=True)
    terrain: Mapped[bool] = mapped_column(Boolean, default=False)
    surface_terrain: Mapped[int | None] = mapped_column(nullable=True)
    mots_cles: Mapped[str | None] = mapped_column(Text, nullable=True)
    date_ajout: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    date_modification: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    agence = relationship("Agence", back_populates="biens")
    commercial = relationship("Employe", back_populates="biens")
    images = relationship("Image", back_populates="bien", cascade="all, delete-orphan")
    stats = relationship("StatsBien", back_populates="bien", uselist=False, cascade="all, delete-orphan")
    favoris = relationship("FavoriBien", back_populates="bien", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="bien", cascade="all, delete-orphan")


class Image(Base):
    __tablename__ = "images"

    id_image: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(500))
    id_bien: Mapped[int] = mapped_column(ForeignKey("biens.id_bien"), index=True)
    is_main: Mapped[bool] = mapped_column(Boolean, default=False)

    bien = relationship("Bien", back_populates="images")
