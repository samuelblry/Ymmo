from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserRead(BaseModel):
    id_user: int
    nom: str
    prenom: str
    email: EmailStr
    telephone: str | None
    date_inscription: datetime

    model_config = ConfigDict(from_attributes=True)


class CurrentUser(BaseModel):
    id: int
    type: str
    role: str | None = None
    agence_id: int | None = None
