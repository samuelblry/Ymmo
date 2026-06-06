from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import settings
from app.models.logs import Log


def login_blocked(db: Session, ip_adresse: str | None) -> bool:
    if not ip_adresse:
        return False
    since = datetime.utcnow() - timedelta(minutes=settings.login_rate_window_minutes)
    stmt = select(func.count(Log.id_log)).where(
        Log.action == "tentative_echec",
        Log.succes.is_(False),
        Log.ip_adresse == ip_adresse,
        Log.date_heure >= since,
    )
    return db.scalar(stmt) >= settings.login_rate_limit
