from pydantic import BaseModel, ConfigDict, EmailStr


class AgenceRead(BaseModel):
    id_agence: int
    nom_agence: str
    ville: str
    code_postal: str
    adresse: str
    telephone: str
    email: EmailStr
    description: str | None
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)


class AgenceCreate(BaseModel):
    nom_agence: str
    ville: str
    code_postal: str
    adresse: str
    telephone: str
    email: EmailStr
    description: str | None = None
    image_url: str | None = None
