"""
backend/app/services/auth_service.py
──────────────────────────────────────
Oturum güvenlik servisi.

• token_version  → logout sonrası eski token'ları geçersiz kılmak için
• failed_login   → brute-force koruması
"""

import logging

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────
# Cache yardımcısı (Django cache → in-memory fallback)
# ──────────────────────────────────────────────────────────────────

_memory_store: dict = {}  # Django cache yoksa in-memory fallback


def _cache_get(key: str):
    try:
        from django.core.cache import cache
        return cache.get(key)
    except Exception:
        return _memory_store.get(key)


def _cache_set(key: str, value, timeout: int = 3600):
    try:
        from django.core.cache import cache
        cache.set(key, value, timeout=timeout)
    except Exception:
        _memory_store[key] = value


def _cache_incr(key: str, timeout: int = 900) -> int:
    try:
        from django.core.cache import cache
        try:
            return cache.incr(key)
        except ValueError:
            cache.set(key, 1, timeout=timeout)
            return 1
    except Exception:
        val = _memory_store.get(key, 0) + 1
        _memory_store[key] = val
        return val


def _cache_delete(key: str):
    try:
        from django.core.cache import cache
        cache.delete(key)
    except Exception:
        _memory_store.pop(key, None)


# ──────────────────────────────────────────────────────────────────
# token_version yönetimi
# ──────────────────────────────────────────────────────────────────

def get_token_version(username: str) -> int:
    """Kullanıcının mevcut token versiyonunu döner. Yoksa 0."""
    return _cache_get(f"token_version:{username}") or 0


def bump_token_version(username: str) -> int:
    """
    Logout veya zorla oturum kapatma durumunda çağrılır.
    Versiyon artırılır → eski tokenlar artık geçersizdir.
    """
    current = get_token_version(username)
    new_version = current + 1
    _cache_set(f"token_version:{username}", new_version, timeout=86400 * 30)
    logger.info("token_version bumped: %s → %s (user=%s)", current, new_version, username)
    return new_version


def verify_token_version(username: str, token_version: int) -> bool:
    """Token payload'ındaki versiyon ile cache'deki eşleşiyor mu?"""
    return get_token_version(username) == token_version


# ──────────────────────────────────────────────────────────────────
# Failed login counter (brute-force koruması)
# ──────────────────────────────────────────────────────────────────

from app.core.config import settings  # noqa: E402


def increment_failed_login(username: str) -> int:
    """Başarısız giriş sayacını artırır, mevcut değeri döner."""
    count = _cache_incr(f"failed_login:{username}", timeout=settings.FAILED_LOGIN_TTL)
    logger.warning("Başarısız giriş: %s (sayaç=%s)", username, count)
    return count


def is_account_locked(username: str) -> bool:
    """Hesap kilitli mi?"""
    # [DEV ONLY] DEBUG modunda bypass hesapları kilitlenmez
    if settings.DEBUG:
        uname_lower = username.lower()
        if uname_lower in ["admin", "test"]:
            return False

    count = _cache_get(f"failed_login:{username}") or 0
    return int(count) >= settings.MAX_FAILED_LOGINS


def reset_failed_login(username: str) -> None:
    """Başarılı giriş sonrası sayacı sıfırlar."""
    _cache_delete(f"failed_login:{username}")
