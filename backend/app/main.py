from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine
from app.routers import admin, agences, analytics, articles, auth, favoris, likes, listings, logs, messages, users

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


@app.on_event("startup")
def on_startup() -> None:
    if settings.database_url.startswith("sqlite"):
        from app.database import SessionLocal
        from app.seed import seed_database

        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            seed_database(db)


@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "ok"}
