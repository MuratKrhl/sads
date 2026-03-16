"""
backend/app/main.py
────────────────────
FastAPI uygulama giriş noktası.

• CORS: React dev/prod server'larına izin verir
• Logging: uvicorn access log ile uyumlu
• Global exception handler: beklenmeyen hataları 500 ile sarar
• Routes: /auth/* → AD/LDAP kimlik doğrulama
"""

import collections
import collections.abc

# Python 3.10+ ldap3 compatibility patch
if not hasattr(collections, "MutableMapping"):
    collections.MutableMapping = collections.abc.MutableMapping

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.routes.auth import router as auth_router

# ── Logging ────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Lifespan ───────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("BMW Portal API başlatıldı — LDAP: %s", settings.LDAP_SERVER)
    yield
    logger.info("BMW Portal API kapatılıyor...")


# ── App ────────────────────────────────────────────────────────────
app = FastAPI(
    title="BMW Portal API",
    description="Active Directory / LDAP kimlik doğrulama ve monitoring verileri için REST API.",
    version="2.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)


# ── CORS ───────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,            # Cookie için şart
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# ── Global exception handler ───────────────────────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Beklenmeyen hata: %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"detail": "Sunucu hatası. Lütfen tekrar deneyin."},
    )


# ── Routers ────────────────────────────────────────────────────────
app.include_router(auth_router)


# ── Health check ───────────────────────────────────────────────────
@app.get("/health", tags=["System"], summary="Servis sağlık kontrolü")
async def health():
    return {"status": "ok", "service": "BMW Portal API", "version": "2.0.0"}
