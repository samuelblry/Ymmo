from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.agency import Agence
from app.models.listing import Bien
from app.schemas.agence import AgenceRead
from app.schemas.bien import BienPublic

router = APIRouter(prefix="/api/agences", tags=["Agences"])


@router.get("", response_model=list[AgenceRead])
def list_agences(db: Session = Depends(get_db)) -> list[Agence]:
    return list(db.scalars(select(Agence).order_by(Agence.id_agence)))


@router.get("/{id_agence}", response_model=AgenceRead)
def get_agence(id_agence: int, db: Session = Depends(get_db)) -> Agence:
    agence = db.get(Agence, id_agence)
    if not agence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agence introuvable")
    return agence


@router.get("/{id_agence}/biens", response_model=list[BienPublic])
def get_agence_biens(id_agence: int, db: Session = Depends(get_db)) -> list[Bien]:
    stmt = (
        select(Bien)
        .options(selectinload(Bien.images))
        .where(Bien.id_agence == id_agence, Bien.statut != "vendu")
        .order_by(Bien.date_ajout.desc())
    )
    return list(db.scalars(stmt))
