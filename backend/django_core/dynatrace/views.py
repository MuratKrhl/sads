"""
Envanter endpoint'leri — React'ın polling ettiği REST API'ler.

GET /api/inventory/hosts/          → Sunucu özeti
GET /api/inventory/applications/   → Uygulama dağılımı
GET /api/inventory/kdb/            → KDB sertifikaları
GET /api/inventory/java/           → Java sertifikaları
"""
import asyncio
from rest_framework.decorators import api_view
from rest_framework.response    import Response
from rest_framework             import status

from .client import (
    get_host_summary,
    get_application_summary,
    get_kdb_certificates,
    get_java_certificates,
)
from .cache import cached


# ── Cached client fonksiyonları ───────────────────────────────
@cached("inventory:hosts", ttl=300)
async def _host_summary():
    return await get_host_summary()

@cached("inventory:applications", ttl=300)
async def _app_summary():
    return await get_application_summary()

@cached("inventory:kdb", ttl=3600)
async def _kdb_certs():
    return await get_kdb_certificates()

@cached("inventory:java", ttl=3600)
async def _java_certs():
    return await get_java_certificates()


# ── Views ─────────────────────────────────────────────────────

@api_view(["GET"])
def host_summary(request):
    """
    Sunucu envanter özeti.
    Response:
      { total: 623, linux: 412, aix: 188, windows: 12, other: 11 }
    """
    try:
        data = asyncio.run(_host_summary())
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(["GET"])
def application_summary(request):
    """
    Uygulama platform dağılımı.
    Response:
      [ {name: "JBOSS", value: 47}, {name: "NGINX", value: 31}, ... ]
    """
    try:
        data = asyncio.run(_app_summary())
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(["GET"])
def kdb_certificates(request):
    """KDB sertifika entity listesi."""
    try:
        data = asyncio.run(_kdb_certs())
        return Response({"entities": data, "total": len(data)})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(["GET"])
def java_certificates(request):
    """Java teknolojisi kullanan process group'lar."""
    try:
        data = asyncio.run(_java_certs())
        return Response({"entities": data, "total": len(data)})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(["GET"])
def inventory_all(request):
    """
    Tüm envanter verisini tek seferde döner.
    React EnvanterSection → tek fetch ile tüm kartları doldurur.
    """
    try:
        hosts, apps = asyncio.run(asyncio.gather(
            _host_summary(),
            _app_summary(),
        ))
        return Response({
            "hosts":        hosts,
            "applications": apps,
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
