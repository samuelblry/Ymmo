from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Role(Base):
    __tablename__ = "roles"

    id_role: Mapped[int] = mapped_column(primary_key=True)
    nom_role: Mapped[str] = mapped_column(String(50), unique=True, index=True)

    employes = relationship("Employe", back_populates="role")


class Employe(Base):
    __tablename__ = "employes"

    id_employe: Mapped[int] = mapped_column(primary_key=True, index=True)
    nom: Mapped[str] = mapped_column(String(100))
    prenom: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    telephone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    id_role: Mapped[int] = mapped_column(ForeignKey("roles.id_role"), index=True)
    id_agence: Mapped[int | None] = mapped_column(ForeignKey("agences.id_agence"), nullable=True)
    actif: Mapped[bool] = mapped_column(Boolean, default=True)
    mfa_secret: Mapped[str | None] = mapped_column(String(32), nullable=True)
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    reset_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reset_token_expiry: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    role = relationship("Role", back_populates="employes")
    agence = relationship("Agence", back_populates="employes")
    biens = relationship("Bien", back_populates="commercial")
    articles = relationship("Article", back_populates="auteur")
    logs = relationship("Log", back_populates="employe")
