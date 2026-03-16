"""
backend/app/services/ldap_service.py
──────────────────────────────────────
Active Directory / LDAP kimlik doğrulama servisi.

Mevcut ldap_client.py'dan taşındı + genişletildi:
  • memberOf grup listesi artık döndürülür
  • Keyword-based role mapping eklendi
  • LDAP group cache eklendi (Django cache üzerinden)
  • FastAPI async loop bloklanmaz (run_in_executor)
"""

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor

from ldap3 import ALL, SUBTREE, Connection, Server
from ldap3.core.exceptions import LDAPBindError, LDAPException, LDAPSocketOpenError

from app.core.config import settings

logger = logging.getLogger(__name__)

_ldap_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="ldap")

# LDAP sunucusu bir kere oluşturulur
_server = Server(
    settings.LDAP_SERVER,
    port=settings.LDAP_PORT,
    use_ssl=settings.LDAP_USE_SSL,
    get_info=ALL,
    connect_timeout=settings.LDAP_CONNECT_TIMEOUT,
)


# ──────────────────────────────────────────────────────────────────
# Role mapping — keyword tabanlı, güvenli varsayılan
# ──────────────────────────────────────────────────────────────────

def map_groups_to_role(groups: list[str]) -> str:
    """
    LDAP grup adlarından rol çıkarır.
    Varsayılan asla admin değil — 'user'.
    """
    for g in groups:
        gl = g.lower()
        if "admin" in gl:
            return "admin"
        if any(k in gl for k in ["project", "pm", "manager"]):
            return "project_manager"
        if any(k in gl for k in ["viewer", "read", "user"]):
            return "viewer"
    return "user"


# ──────────────────────────────────────────────────────────────────
# Cache yardımcısı
# ──────────────────────────────────────────────────────────────────

def _get_cached_groups(username: str) -> list[str] | None:
    """Django cache'den grup listesini çeker."""
    try:
        from django.core.cache import cache
        return cache.get(f"ldap_groups:{username}")
    except Exception:
        return None


def _set_cached_groups(username: str, groups: list[str]) -> None:
    """Grup listesini Django cache'e yazar."""
    try:
        from django.core.cache import cache
        cache.set(f"ldap_groups:{username}", groups, timeout=settings.LDAP_GROUP_CACHE_TTL)
    except Exception:
        pass  # Cache yoksa sessizce geç


# ──────────────────────────────────────────────────────────────────
# Senkron çekirdek (thread'de çalışacak)
# ──────────────────────────────────────────────────────────────────

def _authenticate_sync(username: str, password: str) -> dict | None:
    """
    Blocking LDAP authenticate.
    Döner : user dict  → başarı
    Döner : None       → hatalı kimlik bilgisi
    Fırlatır: ConnectionError, LDAPException
    """
    # [DEV ONLY] LDAP olmadan test edebilmek için geçici admin hesabı bypass'ı
    logger.debug("LDAP Auth attempt: username=%s (DEBUG mode: %s)", username, settings.DEBUG)
    
    if settings.DEBUG:
        uname_lower = username.lower()
        if uname_lower == "admin" and password == "admin":
            logger.info("LOGIN SUCCESS: MOCK admin user (Bypass LDAP)")
            return {
                "username":  "admin",
                "full_name": "Admin",
                "email":     "admin@bmw.local",
                "role":      "admin",
                "groups":    ["Domain Admins"],
            }
        elif uname_lower == "test" and password == "test":
            logger.info("LOGIN SUCCESS: MOCK test user (Bypass LDAP)")
            return {
                "username":  "test",
                "full_name": "Test User",
                "email":     "test@bmw.local",
                "role":      "user",
                "groups":    ["Domain Users"],
            }
        else:
            logger.debug("Debug bypass not triggered for: %s (password provided)", username)

    # 1. Servis hesabıyla bind → kullanıcıyı bul
    try:
        svc_conn = Connection(
            _server,
            user=settings.LDAP_BIND_DN,
            password=settings.LDAP_BIND_PASSWORD,
            auto_bind=True,
            raise_exceptions=True,
        )
    except LDAPSocketOpenError:
        logger.error("LDAP sunucusuna ulaşılamıyor: %s", settings.LDAP_SERVER)
        raise ConnectionError("AD sunucusuna ulaşılamıyor")
    except LDAPBindError:
        logger.critical("Servis hesabı bind başarısız — LDAP_BIND_DN kontrol edin.")
        raise LDAPException("Servis hesabı bind başarısız")

    svc_conn.search(
        search_base=settings.LDAP_USER_SEARCH_BASE,
        search_filter=(
            f"(&(objectClass=user)(objectCategory=person)"
            f"(sAMAccountName={username}))"
        ),
        search_scope=SUBTREE,
        attributes=[
            "sAMAccountName",
            "displayName",
            "mail",
            "distinguishedName",
            "userAccountControl",
            "memberOf",
        ],
    )

    if not svc_conn.entries:
        logger.warning("LOGIN FAILED — kullanıcı bulunamadı: %s", username)
        return None

    entry = svc_conn.entries[0]
    user_dn: str = entry.distinguishedName.value

    # 2. Hesap aktif mi? (ACCOUNTDISABLE = 0x0002)
    uac = int(getattr(entry.userAccountControl, "value", 0) or 0)
    if uac & 0x0002:
        logger.warning("LOGIN FAILED — hesap devre dışı: %s", username)
        return None

    # 3. Zorunlu grup üyeliği kontrolü
    if settings.LDAP_REQUIRE_GROUP:
        member_of_raw: list[str] = list(entry.memberOf) if entry.memberOf else []
        if not any(settings.LDAP_REQUIRE_GROUP.lower() in g.lower() for g in member_of_raw):
            logger.warning("LOGIN FAILED — zorunlu grupta değil: %s", username)
            return None

    # 4. Kullanıcının şifresiyle bind → şifreyi doğrula
    try:
        user_conn = Connection(
            _server,
            user=f"{settings.LDAP_DOMAIN}\\{username}",
            password=password,
            raise_exceptions=True,
        )
        if not user_conn.bind():
            logger.warning("LOGIN FAILED — hatalı şifre: %s", username)
            return None
    except LDAPBindError:
        logger.warning("LOGIN FAILED — hatalı şifre: %s", username)
        return None

    # 5. Grup listesini al ve cache'e yaz
    cached = _get_cached_groups(username)
    if cached is not None:
        groups = cached
    else:
        groups = [str(g) for g in entry.memberOf] if entry.memberOf else []
        _set_cached_groups(username, groups)

    # 6. Role mapping
    role = map_groups_to_role(groups)

    logger.info("LOGIN SUCCESS: %s (role=%s)", username, role)
    return {
        "username":  str(entry.sAMAccountName),
        "full_name": str(entry.displayName) if entry.displayName else username,
        "email":     str(entry.mail) if entry.mail else None,
        "role":      role,
        "groups":    groups,
    }


# ──────────────────────────────────────────────────────────────────
# Async public API
# ──────────────────────────────────────────────────────────────────

async def authenticate_user(username: str, password: str) -> dict | None:
    """Non-blocking LDAP authenticate — FastAPI handler'lardan çağrılır."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        _ldap_executor, _authenticate_sync, username, password
    )
