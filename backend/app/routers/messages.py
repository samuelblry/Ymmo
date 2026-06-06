from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_roles
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageRead
from app.schemas.user import CurrentUser

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.post("", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
def create_message(payload: MessageCreate, db: Session = Depends(get_db)) -> Message:
    message = Message(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("", response_model=list[MessageRead])
def list_messages(
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
) -> list[Message]:
    stmt = select(Message).where(Message.id_agence_dest == current.agence_id).order_by(Message.date_envoi.desc())
    return list(db.scalars(stmt))


@router.put("/{id_message}/lu", response_model=MessageRead)
def mark_read(
    id_message: int,
    current: CurrentUser = Depends(require_roles("Commercial")),
    db: Session = Depends(get_db),
) -> Message:
    message = db.get(Message, id_message)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message introuvable")
    if message.id_agence_dest != current.agence_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agence interdite")
    message.lu = True
    db.commit()
    db.refresh(message)
    return message
