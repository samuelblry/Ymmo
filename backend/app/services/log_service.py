from fastapi import Request
from sqlalchemy.orm import Session

from app.models.logs import Log


def write_log(
    db: Session,
    request: Request | None,
    action: str,
    succes: bool,
    employe_id: int | None = None,
) -> None:
    ip = request.client.host if request and request.client else None
    user_agent = request.headers.get("user-agent") if request else None
    db.add(Log(id_employe=employe_id, action=action, ip_adresse=ip, user_agent=user_agent, succes=succes))
    db.commit()
