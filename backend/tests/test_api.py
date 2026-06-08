import os

os.environ["DATABASE_URL"] = "sqlite:///./test_ymmo.db"
os.environ["SECRET_KEY"] = "test-secret-key-for-ymmo-api-tests"

from fastapi.testclient import TestClient

from app.main import app


def test_health_and_public_biens():
    with TestClient(app) as client:
        health = client.get("/api/health")
        assert health.status_code == 200

        biens = client.get("/api/biens")
        assert biens.status_code == 200
        assert biens.json()
        assert "adresse" not in biens.json()[0]


def test_client_login_and_contact_message():
    with TestClient(app) as client:
        login = client.post("/api/auth/login", json={"email": "client@ymmo.fr", "password": "Password123!"})
        assert login.status_code == 200
        assert login.json()["user_type"] == "user"

        message = client.post(
            "/api/messages",
            json={
                "id_agence_dest": 1,
                "nom": "Dupont",
                "prenom": "Jean",
                "email": "jean.dupont@example.com",
                "telephone": "0600000000",
                "sujet": "Estimation gratuite",
                "contenu": "Bonjour, je souhaite une estimation.",
            },
        )
        assert message.status_code == 201
        assert message.json()["lu"] is False


def test_staff_role_access_control():
    with TestClient(app) as client:
        login = client.post("/api/auth/login", json={"email": "commercial@ymmo.fr", "password": "Password123!"})
        assert login.status_code == 200
        token = login.json()["access_token"]

        headers = {"Authorization": f"Bearer {token}"}
        allowed = client.get("/api/stats/biens", headers=headers)
        blocked = client.get("/api/logs", headers=headers)

        assert allowed.status_code == 200
        assert blocked.status_code == 403


def test_user_favorites_roundtrip():
    with TestClient(app) as client:
        login = client.post("/api/auth/login", json={"email": "client@ymmo.fr", "password": "Password123!"})
        assert login.status_code == 200
        headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

        add = client.post("/api/favoris/biens/1", headers=headers)
        favorites = client.get("/api/favoris/biens", headers=headers)
        remove = client.delete("/api/favoris/biens/1", headers=headers)
        favorites_after = client.get("/api/favoris/biens", headers=headers)

        assert add.status_code == 201
        assert favorites.status_code == 200
        assert any(item["id_bien"] == 1 for item in favorites.json())
        assert remove.status_code == 204
        assert all(item["id_bien"] != 1 for item in favorites_after.json())


def test_user_can_update_profile():
    with TestClient(app) as client:
        login = client.post("/api/auth/login", json={"email": "client@ymmo.fr", "password": "Password123!"})
        assert login.status_code == 200
        headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

        updated = client.put(
            "/api/users/me",
            json={
                "prenom": "Client",
                "nom": "Ymmo",
                "email": "client@ymmo.fr",
                "telephone": "0601020304",
            },
            headers=headers,
        )

        assert updated.status_code == 200
        assert updated.json()["telephone"] == "0601020304"


def test_commercial_can_create_then_open_listing_detail():
    with TestClient(app) as client:
        login = client.post("/api/auth/login", json={"email": "commercial@ymmo.fr", "password": "Password123!"})
        assert login.status_code == 200
        headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

        payload = {
            "id_agence": 1,
            "titre": "Maison test ouvrable",
            "description": "Annonce creee par test et ouvrable en detail public.",
            "adresse": "1 Rue du Test, Aix-en-Provence",
            "prix": 410000,
            "surface": 120,
            "type_bien": "Maison",
            "ville": "Aix-en-Provence",
            "code_postal": "13100",
            "statut": "disponible",
            "nb_pieces": 4,
            "nb_chambres": 3,
            "nb_sdb": 1,
            "caracteristiques": "DPE B",
        }
        created = client.post("/api/biens", json=payload, headers=headers)
        assert created.status_code == 201

        detail = client.get(f"/api/biens/{created.json()['id_bien']}")
        assert detail.status_code == 200
        assert detail.json()["titre"] == payload["titre"]
