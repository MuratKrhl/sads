"""
backend/app/core/security.py
────────────────────────────
JWT access + refresh token yönetimi.
HttpOnly cookie tabanlı auth desteği.

• Access token  : kısa ömürlü (varsayılan 8 saat)
• Refresh token : uzun ömürlü (varsayılan 7 gün)
• Payload       : sub, full_name, email, role, token_version, type, exp
"""

from datetime import datetime, timedelta, timezone

from fastapi import Response, Cookie
from jose import JWTError, jwt

from app.core.config import settings

_ACCESS_EXPIRE  = timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
_REFRESH_EXPIRE = timedelta(days=settings.JWT_REFRESH_EXPIRE_DAYS)

ACCESS_COOKIE  = "access_token"
REFRESH_COOKIE = "refresh_token"


# ──────────────────────────────────────────────────────────────────
# Token üretimi
# ──────────────────────────────────────────────────────────────────

def _build_payload(user: dict, token_type: str, expire: timedelta) -> dict:
    return {
        "sub":           user["username"],
        "full_name":     user.get("full_name"),
        "email":         user.get("email"),
        "role":          user.get("role", "user"),
        "token_version": user.get("token_version", 0),
        "type":          token_type,
        "exp":           datetime.now(timezone.utc) + expire,
    }


def create_access_token(user: dict) -> str:
    payload = _build_payload(user, "access", _ACCESS_EXPIRE)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user: dict) -> str:
    payload = _build_payload(user, "refresh", _REFRESH_EXPIRE)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


# ──────────────────────────────────────────────────────────────────
# Token doğrulama
# ──────────────────────────────────────────────────────────────────

def verify_token(token: str, expected_type: str = "access") -> dict:
    """
    Token'ı doğrular ve payload dict döner.
    Geçersiz veya süresi dolmuşsa ValueError fırlatır.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise ValueError(f"Geçersiz token: {exc}") from exc

    if payload.get("type") != expected_type:
        raise ValueError(f"Yanlış token tipi (beklenen: {expected_type})")

    return payload


# ──────────────────────────────────────────────────────────────────
# Cookie yönetimi
# ──────────────────────────────────────────────────────────────────

def _cookie_kwargs() -> dict:
    """Tüm cookie'ler için ortak güvenlik ayarları."""
    kwargs = {
        "httponly": True,
        "secure":   settings.COOKIE_SECURE,
        "samesite": settings.COOKIE_SAMESITE,
    }
    if settings.COOKIE_DOMAIN:
        kwargs["domain"] = settings.COOKIE_DOMAIN
    return kwargs


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    """Access ve refresh token'ları HttpOnly cookie'ye yazar."""
    ck = _cookie_kwargs()
    response.set_cookie(
        ACCESS_COOKIE, access_token,
        max_age=settings.JWT_EXPIRE_MINUTES * 60,
        **ck,
    )
    response.set_cookie(
        REFRESH_COOKIE, refresh_token,
        max_age=settings.JWT_REFRESH_EXPIRE_DAYS * 86400,
        **ck,
    )


def clear_auth_cookies(response: Response) -> None:
    """Logout'ta cookie'leri temizler."""
    response.delete_cookie(ACCESS_COOKIE)
    response.delete_cookie(REFRESH_COOKIE)
