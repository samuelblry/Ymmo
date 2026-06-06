# Backend Ymmo

API FastAPI pour le projet Ymmo : authentification JWT, refresh token en cookie httpOnly, MFA TOTP staff, RBAC, logs de securite, rate limiting login, CRUD principal et analytics.

## Lancement local

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Par defaut, sans `.env`, l'API utilise `sqlite:///./ymmo_dev.db` pour faciliter la demo. En production, renseigner `DATABASE_URL` avec PostgreSQL.

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
