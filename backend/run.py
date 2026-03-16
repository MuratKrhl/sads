"""
backend/run.py
───────────────
Tek giriş noktası — hem FastAPI hem Django Channels başlatır.

Kullanım:
    cd backend
    python run.py
"""

import os
import sys
import collections
import collections.abc

# Python 3.10+ ldap3 compatibility patch
if not hasattr(collections, "MutableMapping"):
    collections.MutableMapping = collections.abc.MutableMapping

# Django settings yükle (cache + WebSocket için)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_core.config.settings")

import django
django.setup()

import uvicorn

if __name__ == "__main__":
    from app.core.config import settings
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info",
    )
