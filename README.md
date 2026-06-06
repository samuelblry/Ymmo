# Ymmo — Plateforme Immobilière

Projet scolaire Ynov B2 — UF INFRA & DEV.

Ymmo est une plateforme web centralisée pour un groupe immobilier fictif basé à Aix-en-Provence, avec 12 agences réparties en France. Elle permet aux clients de rechercher des biens, aux agences de gérer leurs annonces, et à la direction d'analyser les performances du réseau.

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Python + FastAPI + SQLAlchemy + PostgreSQL |
| Analyse | pandas + scikit-learn |
| Déploiement | Nginx + uvicorn (DMZ) |

---

## Lancer le projet

### Frontend

```bash
npm install
npm run dev
```

Accessible sur `http://localhost:5173`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # remplir les variables
alembic upgrade head
uvicorn app.main:app --reload
```

API sur `http://localhost:8000` — documentation Swagger sur `/docs`

---

## Fonctionnalités

**Côté client**
- Recherche et filtrage de biens immobiliers
- Consultation des agences et de leurs portefeuilles
- Blog immobilier avec articles
- Formulaire de contact
- Compte personnel avec favoris

**Côté staff**
- Dashboard Commercial — gestion des annonces et messages clients
- Dashboard Marketing — gestion des articles de blog
- Dashboard RH — gestion des employés
- Dashboard Direction — statistiques globales et analyse prédictive
- Dashboard IT — administration des comptes et logs de sécurité

---

## Équipe

- **Matias Bouchenoire** — Frontend + UX/UI
- **Samuel Bouhnik-Loury** — Backend + UX/UI + Cyber
- **William Pons** — Backend + Infra/Cyber
