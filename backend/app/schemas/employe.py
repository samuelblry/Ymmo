from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EmployeCreate(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    telephone: str | None = None
    id_role: int
    id_agence: int | None = None


class EmployeUpdate(BaseModel):
    nom: str | None = None
    prenom: str | None = None
    telephone: str | None = None
    id_role: int | None = None
    id_agence: int | None = None
    actif: bool | None = None


class EmployeRead(BaseModel):
    id_employe: int
    nom: str
    prenom: str
    email: EmailStr
    telephone: str | None
    id_role: int
    id_agence: int | None
    actif: bool
    mfa_enabled: bool

    model_config = ConfigDict(from_attributes=True)


class RoleRead(BaseModel):
    id_role: int
    nom_role: str

    model_config = ConfigDict(from_attributes=True)
