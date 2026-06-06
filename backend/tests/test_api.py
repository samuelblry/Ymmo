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
