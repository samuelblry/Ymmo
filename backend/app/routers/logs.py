from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_roles
from app.models.logs import Log
from app.schemas.user import CurrentUser

router = APIRouter(prefix="/api/logs", tags=["Logs"])


@router.get("")
def list_logs(
    employe_id: int | None = None,
    action: str | None = None,
    date_debut: datetime | None = None,
    date_fin: datetime | None = None,
    ip: str | None = None,
    _: CurrentUser = Depends(require_roles("IT_Support")),
    db: Session = Depends(get_db),
):
    stmt = select(Log).order_by(Log.date_heure.desc())
    if employe_id is not None:
        stmt = stmt.where(Log.id_employe == employe_id)
    if action:
        stmt = stmt.where(Log.action == action)
    if date_debut:
        stmt = stmt.where(Log.date_heure >= date_debut)
    if date_fin:
        stmt = stmt.where(Log.date_heure <= date_fin)
    if ip:
        stmt = stmt.where(Log.ip_adresse == ip)
    logs = db.scalars(stmt.limit(500)).all()
    return [
        {
            "id_log": log.id_log,
            "id_employe": log.id_employe,
            "action": log.action,
            "ip_adresse": log.ip_adresse,
            "succes": log.succes,
            "date_heure": log.date_heure,
        }
        for log in logs
    ]
