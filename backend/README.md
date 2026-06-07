# Backend Ymmo

API FastAPI pour le projet Ymmo : PostgreSQL, migrations Alembic, authentification JWT, refresh token en cookie httpOnly, MFA TOTP staff, RBAC, logs de securite, rate limiting login, CRUD principal et analytics.

## Lancement local complet avec PostgreSQL

Prerequis : ouvrir Docker Desktop avant de lancer `docker compose`, sinon PostgreSQL ne pourra pas demarrer.

### Tout lancer avec Docker

Depuis la racine du projet :

```bash
docker compose up --build
```

Services disponibles :

| Service | URL |
|---------|-----|
| Site React | `http://localhost:5173` |
| API FastAPI | `http://localhost:8000` |
| Swagger | `http://localhost:8000/docs` |
| Adminer BDD | `http://localhost:8082` |

Connexion Adminer :

| Champ | Valeur |
|-------|--------|
| Systeme | PostgreSQL |
| Serveur | `postgres` |
| Utilisateur | `ymmo` |
| Mot de passe | `ymmo_password` |
| Base de donnees | `ymmo` |

Le conteneur API lance automatiquement `alembic upgrade head` puis `python -m scripts.seed`.

### Lancer le backend a la main

```bash
docker compose up -d postgres
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m alembic upgrade head
python -m scripts.seed
uvicorn app.main:app --reload
```

Verification PostgreSQL :

```bash
python -m scripts.check_db
```

Le fichier `.env` pointe sur PostgreSQL local : `postgresql+pg8000://ymmo:ymmo_password@localhost:55432/ymmo`.
Sans `.env`, l'API utilise encore `sqlite:///./ymmo_dev.db` pour les tests rapides.

Swagger : `http://localhost:8000/docs`

## Comptes de demo

Mot de passe commun : `Password123!`

| Type | Email |
|------|-------|
| Client | `client@ymmo.fr` |
| Commercial | `commercial@ymmo.fr` |
| Marketing | `marketing@ymmo.fr` |
| RH | `rh@ymmo.fr` |
| Direction | `direction@ymmo.fr` |
| IT | `it@ymmo.fr` |

## Cyber

- Bcrypt cost 12 via `passlib`
- Access token JWT 15 min
- Refresh token 7 jours en cookie httpOnly, SameSite Strict
- MFA TOTP staff via `pyotp`
- Rate limiting login par IP sur logs d'echec
- RBAC par role sur routes staff
- Logs d'auth et actions admin
- CORS restreint aux origines de `CORS_ORIGINS`
- Adresse des biens masquee sur `BienPublic`, visible uniquement via endpoint staff
- Upload images limite a 5 Mo et MIME type autorise
