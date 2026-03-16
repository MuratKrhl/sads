"""
backend/app/routes/auth.py
───────────────────────────
FastAPI auth router — Cookie tabanlı JWT auth.

  POST /auth/login     → LDAP doğrula, HttpOnly cookie'ye token yaz
  GET  /auth/me        → Cookie'den token oku, kullanıcı bilgisi döndür
  POST /auth/refresh   → Refresh cookie ile yeni access token
  POST /auth/logout    → Cookie'leri sil, token_version'ı artır
"""

import logging

from fastapi import APIRouter, Cookie, HTTPException, Response, status
from ldap3.core.exceptions import LDAPException

from app.core.security import (
    ACCESS_COOKIE, REFRESH_COOKIE,
    clear_auth_cookies, create_access_token,
    create_refresh_token, set_auth_cookies, verify_token,
)
from app.models.auth import LoginRequest, MessageResponse, UserInfo
from app.services.auth_service import (
    bump_token_version, get_token_version,
    increment_failed_login, is_account_locked,
    reset_failed_login, verify_token_version,
)
from app.services.ldap_service import authenticate_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


# ──────────────────────────────────────────────────────────────────
# POST /auth/login
# ──────────────────────────────────────────────────────────────────

@router.post(
    "/login",
    response_model=MessageResponse,
    summary="AD/LDAP ile giriş yap",
    responses={
        401: {"description": "Kullanıcı adı veya şifre hatalı"},
        423: {"description": "Hesap geçici olarak kilitlendi"},
        503: {"description": "AD sunucusuna ulaşılamıyor"},
    },
)
async def login(req: LoginRequest, response: Response):
    # Brute-force kontrolü
    if is_account_locked(req.username):
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Çok fazla başarısız giriş denemesi. Lütfen bekleyin.",
        )

    try:
        user = await authenticate_user(req.username, req.password)
    except ConnectionError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except LDAPException as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    if not user:
        increment_failed_login(req.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre hatalı",
        )

    # Başarılı giriş: sayacı sıfırla, token_version ekle
    reset_failed_login(req.username)
    user["token_version"] = get_token_version(req.username)

    access_token  = create_access_token(user)
    refresh_token = create_refresh_token(user)

    set_auth_cookies(response, access_token, refresh_token)
    logger.info("LOGIN SUCCESS: %s (role=%s)", user["username"], user.get("role"))
    return MessageResponse(detail="Giriş başarılı")


# ──────────────────────────────────────────────────────────────────
# GET /auth/me
# ──────────────────────────────────────────────────────────────────

@router.get(
    "/me",
    response_model=UserInfo,
    summary="Mevcut kullanıcı bilgisi",
    responses={401: {"description": "Geçersiz veya eksik token"}},
)
async def me(access_token: str | None = Cookie(None, alias=ACCESS_COOKIE)):
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token bulunamadı")

    try:
        payload = verify_token(access_token, expected_type="access")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    # token_version kontrolü
    if not verify_token_version(payload["sub"], payload.get("token_version", 0)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Oturum geçersiz kılındı")

    return UserInfo(
        username=payload["sub"],
        full_name=payload.get("full_name"),
        email=payload.get("email"),
        role=payload.get("role", "user"),
    )


# ──────────────────────────────────────────────────────────────────
# POST /auth/refresh
# ──────────────────────────────────────────────────────────────────

@router.post(
    "/refresh",
    response_model=MessageResponse,
    summary="Refresh token ile yeni access token al",
    responses={401: {"description": "Geçersiz veya süresi dolmuş refresh token"}},
)
async def refresh(
    response: Response,
    refresh_token: str | None = Cookie(None, alias=REFRESH_COOKIE),
):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token bulunamadı")

    try:
        payload = verify_token(refresh_token, expected_type="refresh")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    # token_version kontrolü
    if not verify_token_version(payload["sub"], payload.get("token_version", 0)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Oturum geçersiz kılındı")

    user = {
        "username":      payload["sub"],
        "full_name":     payload.get("full_name"),
        "email":         payload.get("email"),
        "role":          payload.get("role", "user"),
        "token_version": get_token_version(payload["sub"]),
    }

    new_access  = create_access_token(user)
    new_refresh = create_refresh_token(user)  # Refresh token rotation
    set_auth_cookies(response, new_access, new_refresh)
    return MessageResponse(detail="Token yenilendi")


# ──────────────────────────────────────────────────────────────────
# POST /auth/logout
# ──────────────────────────────────────────────────────────────────

@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Çıkış yap",
)
async def logout(
    response: Response,
    access_token: str | None = Cookie(None, alias=ACCESS_COOKIE),
):
    if access_token:
        try:
            payload = verify_token(access_token, expected_type="access")
            bump_token_version(payload["sub"])  # Tüm aktif tokenları geçersiz kıl
        except ValueError:
            pass  # Zaten geçersiz token, yine de cookie temizle

    clear_auth_cookies(response)
    return MessageResponse(detail="Başarıyla çıkış yapıldı")
