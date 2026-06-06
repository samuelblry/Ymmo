from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Log(Base):
    __tablename__ = "logs"

    id_log: Mapped[int] = mapped_column(primary_key=True)
    id_employe: Mapped[int | None] = mapped_column(ForeignKey("employes.id_employe"), nullable=True)
    action: Mapped[str] = mapped_column(String(30), index=True)
    ip_adresse: Mapped[str | None] = mapped_column(String(45), nullable=True, index=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    succes: Mapped[bool] = mapped_column(Boolean)
    date_heure: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    employe = relationship("Employe", back_populates="logs")
