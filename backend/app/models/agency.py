from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Agence(Base):
    __tablename__ = "agences"

    id_agence: Mapped[int] = mapped_column(primary_key=True, index=True)
    nom_agence: Mapped[str] = mapped_column(String(100))
    ville: Mapped[str] = mapped_column(String(100), index=True)
    code_postal: Mapped[str] = mapped_column(String(10))
    adresse: Mapped[str] = mapped_column(Text)
    telephone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    biens = relationship("Bien", back_populates="agence")
    employes = relationship("Employe", back_populates="agence")
    messages = relationship("Message", back_populates="agence_dest")
