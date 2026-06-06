from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employe import Employe
from app.models.user import User
from app.schemas.user import CurrentUser
from app.services.auth_service import decode_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    try:
        payload = decode_token(token, expected_scope="access")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    return CurrentUser(
        id=int(payload["sub"]),
        type=payload["type"],
        role=payload.get("role"),
        agence_id=payload.get("agence_id"),
    )


def require_roles(*roles: str):
    def dependency(current: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Role insuffisant")
        return current

    return dependency


def require_authenticated_user(current: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if current.type != "user":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Compte client requis")
    return current


def ensure_current_account_exists(
    current: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CurrentUser:
    if current.type == "user":
        exists = db.get(User, current.id)
    else:
        exists = db.get(Employe, current.id)
    if not exists:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Compte introuvable")
    return current


def request_ip(request: Request) -> str | None:
    return request.client.host if request.client else None
