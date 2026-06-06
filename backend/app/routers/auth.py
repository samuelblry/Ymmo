from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.employe import Employe
from app.models.user import User
from app.schemas.auth import LoginRequest, MfaLoginRequest, RegisterRequest, TokenResponse
from app.dependencies import get_current_user
from app.schemas.user import CurrentUser, UserRead
from app.services.auth_service import (
    create_access_token,
    create_refresh_token,
    create_temp_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.services.log_service import write_log
from app.services.mfa_service import verify_totp
from app.services.rate_limit import login_blocked

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def _token_payload_for_user(user: User) -> dict:
    return {"sub": str(user.id_user), "type": "user", "role": None, "agence_id": None}


def _token_payload_for_employe(employe: Employe) -> dict:
    role = employe.role.nom_role if employe.role else None
    return {"sub": str(employe.id_employe), "type": "employe", "role": role, "agence_id": employe.id_agence}


def _send_tokens(response: Response, payload: dict) -> TokenResponse:
    refresh = create_refresh_token(payload)
    response.set_cookie(
        "refresh_token",
        refresh,
        httponly=True,
        secure=settings.secure_cookies,
        samesite="strict",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
    )
    return TokenResponse(
        access_token=create_access_token(payload),
        user_type=payload["type"],
        role=payload.get("role"),
        agence_id=payload.get("agence_id"),
    )


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> User:
    exists = db.scalar(select(User).where(User.email == payload.email))
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email deja utilise")
    user = User(
        nom=payload.nom,
        prenom=payload.prenom,
        email=payload.email,
        telephone=payload.telephone,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login")
def login(payload: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    ip_adresse = request.client.host if request.client else None
    if login_blocked(db, ip_adresse):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Trop de tentatives")

    user = db.scalar(select(User).where(User.email == payload.email))
    if user and verify_password(payload.password, user.password_hash):
        return _send_tokens(response, _token_payload_for_user(user))

    employe = db.scalar(select(Employe).where(Employe.email == payload.email))
    if employe and employe.actif and verify_password(payload.password, employe.password_hash):
        if employe.mfa_enabled:
            temp_token = create_temp_token(_token_payload_for_employe(employe))
            write_log(db, request, "login_mfa_required", True, employe.id_employe)
            return {"require_mfa": True, "temp_token": temp_token}
        write_log(db, request, "login", True, employe.id_employe)
        return _send_tokens(response, _token_payload_for_employe(employe))

    write_log(db, request, "tentative_echec", False, employe.id_employe if employe else None)
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides")


@router.post("/login/mfa", response_model=TokenResponse)
def login_mfa(payload: MfaLoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    try:
        token_payload = decode_token(payload.temp_token, expected_scope="mfa")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    employe = db.get(Employe, int(token_payload["sub"]))
    if not employe or not employe.actif or not employe.mfa_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Compte MFA invalide")
    if not verify_totp(employe.mfa_secret, payload.code):
        write_log(db, request, "tentative_echec", False, employe.id_employe)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Code MFA invalide")
    write_log(db, request, "login", True, employe.id_employe)
    return _send_tokens(response, _token_payload_for_employe(employe))


@router.post("/refresh", response_model=TokenResponse)
def refresh(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token manquant")
    try:
        payload = decode_token(refresh_token, expected_scope="refresh")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    clean_payload = {
        "sub": payload["sub"],
        "type": payload["type"],
        "role": payload.get("role"),
        "agence_id": payload.get("agence_id"),
    }
    return _send_tokens(response, clean_payload)


@router.post("/logout")
def logout(response: Response, current: CurrentUser = Depends(get_current_user)):
    response.delete_cookie("refresh_token")
    return {"message": "Deconnecte", "user_id": current.id}
