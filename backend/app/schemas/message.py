from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class MessageCreate(BaseModel):
    id_agence_dest: int
    nom: str
    prenom: str
    email: EmailStr
    telephone: str | None = None
    sujet: str
    contenu: str


class MessageRead(MessageCreate):
    id_message: int
    lu: bool
    date_envoi: datetime

    model_config = ConfigDict(from_attributes=True)
