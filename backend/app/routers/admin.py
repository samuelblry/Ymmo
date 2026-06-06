from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_roles
from app.models.employe import Employe
from app.schemas.admin import MfaSetupResponse, ResetPasswordRequest
from app.schemas.employe import EmployeRead
from app.schemas.user import CurrentUser
from app.services.auth_service import hash_password
from app.services.log_service import write_log
from app.services.mfa_service import generate_secret, provisioning_uri

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.put("/employes/{id_employe}/disable", response_model=EmployeRead)
def disable_employe(
    id_employe: int,
    request: Request,
    current: CurrentUser = Depends(require_roles("IT_Support", "RH_Juridique")),
    db: Session = Depends(get_db),
) -> Employe:
    employe = db.get(Employe, id_employe)
    if not employe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employe introuvable")
    employe.actif = False
    db.commit()
    db.refresh(employe)
    write_log(db, request, "disable_account", True, current.id)
    return employe


@router.put("/employes/{id_employe}/activate", response_model=EmployeRead)
def activate_employe(
    id_employe: int,
    request: Request,
    current: CurrentUser = Depends(require_roles("IT_Support")),
    db: Session = Depends(get_db),
) -> Employe:
    employe = db.get(Employe, id_employe)
    if not employe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employe introuvable")
    employe.actif = True
    db.commit()
    db.refresh(employe)
    write_log(db, request, "activate_account", True, current.id)
    return employe


@router.post("/employes/{id_employe}/mfa-reset")
def reset_mfa(
    id_employe: int,
    request: Request,
    current: CurrentUser = Depends(require_roles("IT_Support")),
    db: Session = Depends(get_db),
):
    employe = db.get(Employe, id_employe)
    if not employe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employe introuvable")
    employe.mfa_secret = None
    employe.mfa_enabled = False
    db.commit()
    write_log(db, request, "mfa_reset", True, current.id)
    return {"message": "MFA reinitialisee"}


@router.post("/employes/{id_employe}/mfa-setup", response_model=MfaSetupResponse)
def setup_mfa(
    id_employe: int,
    _: CurrentUser = Depends(require_roles("IT_Support")),
    db: Session = Depends(get_db),
) -> MfaSetupResponse:
    employe = db.get(Employe, id_employe)
    if not employe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employe introuvable")
    secret = generate_secret()
    employe.mfa_secret = secret
    employe.mfa_enabled = True
    db.commit()
    return MfaSetupResponse(secret=secret, provisioning_uri=provisioning_uri(employe.email, secret))


@router.post("/reset-mdp")
def reset_password(
    payload: ResetPasswordRequest,
    request: Request,
    current: CurrentUser = Depends(require_roles("IT_Support")),
    db: Session = Depends(get_db),
):
    employe = db.get(Employe, payload.employe_id)
    if not employe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employe introuvable")
    employe.password_hash = hash_password(payload.temporary_password)
    employe.reset_token = None
    employe.reset_token_expiry = None
    db.commit()
    write_log(db, request, "reset_mdp", True, current.id)
    return {"message": "Mot de passe reinitialise"}
