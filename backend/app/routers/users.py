from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.models.employe import Employe, Role
from app.models.user import User
from app.schemas.employe import EmployeCreate, EmployeRead, EmployeUpdate, RoleRead
from app.schemas.user import CurrentUser, UserRead, UserUpdate
from app.services.auth_service import hash_password

router = APIRouter(tags=["Comptes"])


@router.get("/api/users/me", response_model=UserRead)
def me(current: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)) -> User:
    if current.type != "user":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Compte client requis")
    user = db.get(User, current.id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compte introuvable")
    return user


@router.put("/api/users/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    current: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    if current.type != "user":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Compte client requis")
    user = db.get(User, current.id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compte introuvable")

    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"] != user.email:
        exists = db.scalar(select(User).where(User.email == data["email"], User.id_user != user.id_user))
        if exists:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email deja utilise")

    password = data.pop("password", None)
    for field, value in data.items():
        setattr(user, field, value)
    if password:
        user.password_hash = hash_password(password)

    db.commit()
    db.refresh(user)
    return user


@router.get("/api/roles", response_model=list[RoleRead])
def list_roles(
    _: CurrentUser = Depends(require_roles("RH_Juridique", "Direction", "IT_Support")),
    db: Session = Depends(get_db),
) -> list[Role]:
    return list(db.scalars(select(Role).order_by(Role.id_role)))


@router.get("/api/employes", response_model=list[EmployeRead])
def list_employes(
    _: CurrentUser = Depends(require_roles("RH_Juridique", "Direction", "IT_Support")),
    db: Session = Depends(get_db),
) -> list[Employe]:
    return list(db.scalars(select(Employe).order_by(Employe.id_employe)))


@router.get("/api/employes/{id_employe}", response_model=EmployeRead)
def get_employe(
    id_employe: int,
    _: CurrentUser = Depends(require_roles("RH_Juridique", "Direction", "IT_Support")),
    db: Session = Depends(get_db),
) -> Employe:
    employe = db.get(Employe, id_employe)
    if not employe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employe introuvable")
    return employe


@router.post("/api/employes", response_model=EmployeRead, status_code=status.HTTP_201_CREATED)
def create_employe(
    payload: EmployeCreate,
    _: CurrentUser = Depends(require_roles("RH_Juridique")),
    db: Session = Depends(get_db),
) -> Employe:
    exists = db.scalar(select(Employe).where(Employe.email == payload.email))
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email deja utilise")
    data = payload.model_dump(exclude={"password"})
    employe = Employe(**data, password_hash=hash_password(payload.password))
    db.add(employe)
    db.commit()
    db.refresh(employe)
    return employe


@router.put("/api/employes/{id_employe}", response_model=EmployeRead)
def update_employe(
    id_employe: int,
    payload: EmployeUpdate,
    _: CurrentUser = Depends(require_roles("RH_Juridique")),
    db: Session = Depends(get_db),
) -> Employe:
    employe = db.get(Employe, id_employe)
    if not employe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employe introuvable")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(employe, field, value)
    db.commit()
    db.refresh(employe)
    return employe
