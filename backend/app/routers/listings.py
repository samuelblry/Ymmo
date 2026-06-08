from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.models.listing import Bien, Image
from app.models.stats import StatsBien
from app.schemas.bien import BienCreate, BienPublic, BienStaff, BienUpdate, ImageRead
from app.schemas.user import CurrentUser

router = APIRouter(prefix="/api/biens", tags=["Biens"])

ALLOWED_IMAGE_TYPES = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}
MAX_UPLOAD_SIZE = 5 * 1024 * 1024


def _query_with_images():
    return select(Bien).options(selectinload(Bien.images))


@router.get("", response_model=list[BienPublic])
def list_biens(
    ville: str | None = None,
    type: str | None = None,
    prix_min: float | None = None,
    prix_max: float | None = None,
    surface_min: int | None = None,
    surface_max: int | None = None,
    nb_pieces: int | None = None,
    agence_id: int | None = None,
    db: Session = Depends(get_db),
) -> list[Bien]:
    stmt = _query_with_images().where(Bien.statut != "vendu")
    if ville:
        stmt = stmt.where(Bien.ville.ilike(f"%{ville}%"))
    if type:
        stmt = stmt.where(Bien.type_bien == type)
    if prix_min is not None:
        stmt = stmt.where(Bien.prix >= prix_min)
    if prix_max is not None:
        stmt = stmt.where(Bien.prix <= prix_max)
    if surface_min is not None:
        stmt = stmt.where(Bien.surface >= surface_min)
    if surface_max is not None:
        stmt = stmt.where(Bien.surface <= surface_max)
    if nb_pieces is not None:
        stmt = stmt.where(Bien.nb_pieces >= nb_pieces)
    if agence_id is not None:
        stmt = stmt.where(Bien.id_agence == agence_id)
    return list(db.scalars(stmt.order_by(Bien.date_ajout.desc())))


@router.get("/{id_bien}", response_model=BienPublic)
def get_bien(id_bien: int, db: Session = Depends(get_db)) -> Bien:
    bien = db.scalar(_query_with_images().where(Bien.id_bien == id_bien))
    if not bien:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bien introuvable")
    if not bien.stats:
        bien.stats = StatsBien(nb_vues=0, nb_clicks=0, nb_likes=0, score_popularite=0)
    bien.stats.nb_vues += 1
    bien.stats.last_update = datetime.utcnow()
    db.commit()
    db.refresh(bien)
    return bien


@router.get("/{id_bien}/staff", response_model=BienStaff)
def get_bien_staff(
    id_bien: int,
    current: CurrentUser = Depends(require_roles("Commercial", "Direction", "IT_Support")),
    db: Session = Depends(get_db),
) -> Bien:
    bien = db.scalar(_query_with_images().where(Bien.id_bien == id_bien))
    if not bien:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bien introuvable")
    if current.role == "Commercial" and bien.id_agence != current.agence_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agence interdite")
    return bien


@router.post("", response_model=BienStaff, status_code=status.HTTP_201_CREATED)
def create_bien(
    payload: BienCreate,
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
) -> Bien:
    if payload.id_agence != current.agence_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Commercial limite a son agence")
    bien = Bien(**payload.model_dump(), id_commercial=current.id)
    bien.stats = StatsBien(nb_vues=0, nb_clicks=0, nb_likes=0, score_popularite=0)
    db.add(bien)
    db.commit()
    db.refresh(bien)
    return bien


@router.put("/{id_bien}", response_model=BienStaff)
def update_bien(
    id_bien: int,
    payload: BienUpdate,
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
) -> Bien:
    bien = db.get(Bien, id_bien)
    if not bien:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bien introuvable")
    if bien.id_agence != current.agence_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agence interdite")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(bien, field, value)
    bien.date_modification = datetime.utcnow()
    db.commit()
    db.refresh(bien)
    return bien


@router.delete("/{id_bien}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bien(
    id_bien: int,
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
) -> None:
    bien = db.get(Bien, id_bien)
    if not bien:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bien introuvable")
    if bien.id_agence != current.agence_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agence interdite")
    db.delete(bien)
    db.commit()


@router.post("/{id_bien}/images", response_model=ImageRead, status_code=status.HTTP_201_CREATED)
async def upload_image(
    id_bien: int,
    file: UploadFile = File(...),
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
) -> Image:
    bien = db.get(Bien, id_bien)
    if not bien:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bien introuvable")
    if bien.id_agence != current.agence_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agence interdite")
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Type image refuse")
    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image trop lourde")
    upload_dir = Path("uploads/biens")
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{id_bien}-{int(datetime.utcnow().timestamp())}{ALLOWED_IMAGE_TYPES[file.content_type]}"
    path = upload_dir / filename
    path.write_bytes(content)
    image = Image(id_bien=id_bien, url=f"/uploads/biens/{filename}", is_main=not bien.images)
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.delete("/{id_bien}/images/{img_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
    id_bien: int,
    img_id: int,
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
) -> None:
    bien = db.get(Bien, id_bien)
    image = db.get(Image, img_id)
    if not bien or not image or image.id_bien != id_bien:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image introuvable")
    if bien.id_agence != current.agence_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agence interdite")
    db.delete(image)
    db.commit()
