"""
backend/app/core/config.py
──────────────────────────
Pydantic-settings ile .env auto-load.
Tüm ayarlar buradan okunur; asla doğrudan os.environ kullanma.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── LDAP / Active Directory ───────────────────────────────────
    LDAP_SERVER: str = "adds.fw.g.com.tr"
    LDAP_PORT: int = 389
    LDAP_USE_SSL: bool = False
    LDAP_DOMAIN: str = "FW"
    LDAP_BIND_DN: str = "CN=srv_wdusr,OU=Service Users,OU=System Users,OU=All Users,DC=fw,DC=g,DC=com,DC=tr"
    LDAP_BIND_PASSWORD: str = "change-me"
    LDAP_USER_SEARCH_BASE: str = "OU=All Users,DC=fw,DC=g,DC=com,DC=tr"
    LDAP_REQUIRE_GROUP: str = ""        # Boşsa grup kontrolü yapılmaz
    LDAP_CONNECT_TIMEOUT: int = 10      # saniye
    LDAP_GROUP_CACHE_TTL: int = 300     # 5 dakika

    # ── JWT ──────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "change-me-with-a-strong-secret-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 480       # 8 saat
    JWT_REFRESH_EXPIRE_DAYS: int = 7

    # ── Cookie ───────────────────────────────────────────────────
    COOKIE_SECURE: bool = False         # Production'da True olmalı
    COOKIE_SAMESITE: str = "lax"        # "strict" | "lax" | "none"
    COOKIE_DOMAIN: str = ""             # Boşsa set edilmez

    # ── Brute-force koruması ─────────────────────────────────────
    MAX_FAILED_LOGINS: int = 5          # Bu sayıyı geçince hesap kilitlenir
    FAILED_LOGIN_TTL: int = 900         # 15 dakika

    # ── App ──────────────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    DEBUG: bool = False

    class Config:
        import os
        from pathlib import Path
        env_file = str(Path(__file__).resolve().parent.parent.parent / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
