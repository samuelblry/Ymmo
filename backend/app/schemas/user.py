from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRead(BaseModel):
    id_user: int
    nom: str
    prenom: str
    email: EmailStr
    telephone: str | None
    date_inscription: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    nom: str | None = Field(default=None, min_length=1, max_length=100)
    prenom: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    telephone: str | None = Field(default=None, max_length=20)
    password: str | None = Field(default=None, min_length=8, max_length=128)


class CurrentUser(BaseModel):
    id: int
    type: str
    role: str | None = None
    agence_id: int | None = None
