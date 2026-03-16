"""
auth/tests.py
─────────────
LDAP + JWT auth modülü için birim testleri.
LDAP sunucusu mock'lanır — gerçek AD bağlantısı gerekmez.

Çalıştır:
    cd dashboard_backend
    pip install pytest pytest-asyncio
    pytest auth/tests.py -v
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from main import app
from auth.jwt_handler import create_access_token, create_refresh_token, verify_token

client = TestClient(app)


# ──────────────────────────────────────────────────────────────────
# JWT handler testleri
# ──────────────────────────────────────────────────────────────────

MOCK_USER = {
    "username": "testuser",
    "full_name": "Test Kullanıcı",
    "email": "test@company.local",
    "is_admin": False,
}


def test_create_and_verify_access_token():
    token = create_access_token(MOCK_USER)
    payload = verify_token(token, expected_type="access")
    assert payload["sub"] == "testuser"
    assert payload["is_admin"] is False


def test_create_and_verify_refresh_token():
    token = create_refresh_token(MOCK_USER)
    payload = verify_token(token, expected_type="refresh")
    assert payload["sub"] == "testuser"


def test_verify_wrong_token_type_raises():
    token = create_access_token(MOCK_USER)   # access token
    with pytest.raises(ValueError, match="Yanlış token tipi"):
        verify_token(token, expected_type="refresh")   # refresh bekleniyor → hata


def test_verify_invalid_token_raises():
    with pytest.raises(ValueError):
        verify_token("bu-gecersiz-bir-token", expected_type="access")


# ──────────────────────────────────────────────────────────────────
# Login endpoint testleri
# ──────────────────────────────────────────────────────────────────

@patch("routers.auth.authenticate_user", new_callable=AsyncMock)
def test_login_success(mock_auth):
    mock_auth.return_value = MOCK_USER
    resp = client.post("/auth/login", json={"username": "testuser", "password": "parola"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@patch("routers.auth.authenticate_user", new_callable=AsyncMock)
def test_login_wrong_password(mock_auth):
    mock_auth.return_value = None    # LDAP None döner → 401
    resp = client.post("/auth/login", json={"username": "testuser", "password": "yanlis"})
    assert resp.status_code == 401


@patch("routers.auth.authenticate_user", new_callable=AsyncMock)
def test_login_ldap_unavailable(mock_auth):
    mock_auth.side_effect = ConnectionError("AD sunucusuna ulaşılamıyor")
    resp = client.post("/auth/login", json={"username": "testuser", "password": "parola"})
    assert resp.status_code == 503


# ──────────────────────────────────────────────────────────────────
# /me endpoint testleri
# ──────────────────────────────────────────────────────────────────

def test_me_with_valid_token():
    token = create_access_token(MOCK_USER)
    resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@company.local"


def test_me_with_invalid_token():
    resp = client.get("/auth/me", headers={"Authorization": "Bearer gecersiz-token"})
    assert resp.status_code == 401


def test_me_without_token():
    resp = client.get("/auth/me")
    assert resp.status_code == 403   # HTTPBearer → 403 Not authenticated


# ──────────────────────────────────────────────────────────────────
# /refresh endpoint testleri
# ──────────────────────────────────────────────────────────────────

def test_refresh_with_valid_refresh_token():
    token = create_refresh_token(MOCK_USER)
    resp = client.post("/auth/refresh", json={"refresh_token": token})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_refresh_with_access_token_fails():
    token = create_access_token(MOCK_USER)   # yanlış tip
    resp = client.post("/auth/refresh", json={"refresh_token": token})
    assert resp.status_code == 401


# ──────────────────────────────────────────────────────────────────
# /health endpoint
# ──────────────────────────────────────────────────────────────────

def test_health_check():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
