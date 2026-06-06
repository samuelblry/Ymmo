from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ImageRead(BaseModel):
    id_image: int
    url: str
    is_main: bool

    model_config = ConfigDict(from_attributes=True)


class BienBase(BaseModel):
    id_agence: int
    titre: str = Field(max_length=200)
    description: str
    prix: Decimal
    surface: int
    type_bien: str
    ville: str
    code_postal: str
    statut: str = "disponible"
    nb_pieces: int = 0
    nb_chambres: int = 0
    nb_sdb: int = 0
    caracteristiques: str | None = None
    terrain: bool = False
    surface_terrain: int | None = None
    mots_cles: str | None = None


class BienCreate(BienBase):
    adresse: str


class BienUpdate(BaseModel):
    titre: str | None = None
    description: str | None = None
    adresse: str | None = None
    prix: Decimal | None = None
    surface: int | None = None
    type_bien: str | None = None
    ville: str | None = None
    code_postal: str | None = None
    statut: str | None = None
    nb_pieces: int | None = None
    nb_chambres: int | None = None
    nb_sdb: int | None = None
    caracteristiques: str | None = None
    terrain: bool | None = None
    surface_terrain: int | None = None
    mots_cles: str | None = None


class BienPublic(BienBase):
    id_bien: int
    images: list[ImageRead] = Field(default_factory=list)
    date_ajout: datetime

    model_config = ConfigDict(from_attributes=True)


class BienStaff(BienPublic):
    adresse: str
    id_commercial: int | None
