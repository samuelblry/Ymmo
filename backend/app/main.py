from decimal import Decimal
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import Agence, Article, Bien, Employe, Image, Role, StatsArticle, StatsBien, User
from app.routers import admin, agences, analytics, articles, auth, favoris, likes, listings, logs, messages, users
from app.services.auth_service import hash_password

app = FastAPI(title="Ymmo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(agences.router)
app.include_router(articles.router)
app.include_router(messages.router)
app.include_router(users.router)
app.include_router(favoris.router)
app.include_router(likes.router)
app.include_router(admin.router)
app.include_router(logs.router)
app.include_router(analytics.router)
Path("uploads").mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


def seed_roles(db: Session) -> None:
    roles = ["Commercial", "Marketing", "RH_Juridique", "Direction", "IT_Support"]
    for index, role_name in enumerate(roles, start=1):
        role = db.get(Role, index)
        if not role:
            db.add(Role(id_role=index, nom_role=role_name))
    db.commit()


def seed_agences(db: Session) -> None:
    if db.scalar(select(Agence)):
        return
    agences = [
        ("Ymmo Aix-en-Provence", "Aix-en-Provence", "13100", "12 Cours Mirabeau, 13100 Aix-en-Provence", "04 42 00 00 12", "aix@ymmo.fr", "/img/agences/agence_aix.png"),
        ("Ymmo Marseille", "Marseille", "13001", "5 Rue Paradis, 13001 Marseille", "04 91 00 00 05", "marseille@ymmo.fr", "/img/agences/agence_marseille.png"),
        ("Ymmo Nice", "Nice", "06000", "20 Promenade des Anglais, 06000 Nice", "04 93 00 00 20", "nice@ymmo.fr", "/img/agences/agence_nice.png"),
        ("Ymmo Lyon", "Lyon", "69002", "8 Place Bellecour, 69002 Lyon", "04 72 00 00 08", "lyon@ymmo.fr", "/img/agences/agence_lyon.png"),
        ("Ymmo Paris", "Paris", "75008", "32 Avenue Montaigne, 75008 Paris", "01 40 00 00 32", "paris@ymmo.fr", "/img/agences/agence_paris.png"),
    ]
    for item in agences:
        db.add(
            Agence(
                nom_agence=item[0],
                ville=item[1],
                code_postal=item[2],
                adresse=item[3],
                telephone=item[4],
                email=item[5],
                description="Agence Ymmo locale.",
                image_url=item[6],
            )
        )
    db.commit()


def seed_accounts(db: Session) -> None:
    if not db.scalar(select(User).where(User.email == "client@ymmo.fr")):
        db.add(
            User(
                nom="Client",
                prenom="Demo",
                email="client@ymmo.fr",
                telephone="0600000000",
                password_hash=hash_password("Password123!"),
            )
        )
    employees = [
        ("Commercial", "Demo", "commercial@ymmo.fr", 1, 1),
        ("Marketing", "Demo", "marketing@ymmo.fr", 2, None),
        ("RH", "Demo", "rh@ymmo.fr", 3, None),
        ("Direction", "Demo", "direction@ymmo.fr", 4, None),
        ("IT", "Demo", "it@ymmo.fr", 5, None),
    ]
    for nom, prenom, email, role_id, agence_id in employees:
        if not db.scalar(select(Employe).where(Employe.email == email)):
            db.add(
                Employe(
                    nom=nom,
                    prenom=prenom,
                    email=email,
                    telephone="0400000000",
                    id_role=role_id,
                    id_agence=agence_id,
                    password_hash=hash_password("Password123!"),
                )
            )
    db.commit()


def seed_content(db: Session) -> None:
    if not db.scalar(select(Bien)):
        biens = [
            (1, "Bastide provencale avec piscine", "Maison", 780000, "14 Chemin des Pins, Aix-en-Provence", "Aix-en-Provence", "13100", 210, 6, 5, 3),
            (1, "Appartement T3 centre historique", "Appartement", 320000, "8 Rue des Cardeurs, Aix-en-Provence", "Aix-en-Provence", "13100", 72, 3, 2, 1),
            (2, "Appartement T4 vue mer Prado", "Appartement", 450000, "18 Bd Michelet, Marseille", "Marseille", "13008", 98, 4, 3, 2),
            (3, "Appartement vue mer Promenade", "Appartement", 680000, "42 Promenade des Anglais, Nice", "Nice", "06000", 105, 3, 2, 2),
            (4, "Appartement haussmannien Presqu'ile", "Appartement", 420000, "5 Rue de la Republique, Lyon", "Lyon", "69002", 88, 3, 2, 1),
            (5, "Appartement haussmannien 16e", "Appartement", 1250000, "12 Avenue Foch, Paris", "Paris", "75016", 120, 4, 3, 2),
        ]
        for index, item in enumerate(biens, start=1):
            bien = Bien(
                id_agence=item[0],
                id_commercial=1 if item[0] == 1 else None,
                titre=item[1],
                description="Bien selectionne par Ymmo, idealement positionne sur son marche.",
                type_bien=item[2],
                prix=Decimal(item[3]),
                adresse=item[4],
                ville=item[5],
                code_postal=item[6],
                surface=item[7],
                nb_pieces=item[8],
                nb_chambres=item[9],
                nb_sdb=item[10],
                caracteristiques="Double vitrage, DPE B",
            )
            db.add(bien)
            db.flush()
            db.add(Image(id_bien=bien.id_bien, url=f"/img/listing-{1 if index % 2 else 2}.png", is_main=True))
            db.add(StatsBien(id_bien=bien.id_bien, nb_vues=index * 12, nb_likes=index * 2))
        db.commit()
    if not db.scalar(select(Article)):
        article = Article(
            id_auteur=2,
            titre="Marche immobilier 2026 : les tendances a surveiller",
            contenu="Le marche immobilier retrouve un cycle plus sain avec une demande mieux repartie.",
            image_url="/img/blog-1.png",
            statut="publie",
        )
        db.add(article)
        db.flush()
        db.add(StatsArticle(id_article=article.id_article, nb_vues=120, nb_likes=18))
        db.commit()


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_roles(db)
        seed_agences(db)
        seed_accounts(db)
        seed_content(db)


@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "ok"}
