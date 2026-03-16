"""
NOC Platform Health endpoint'leri.
WebSocket push için de aynı fonksiyonlar kullanılır.

GET /api/noc/snapshot/    → Tüm canlı metrikler tek seferde
GET /api/noc/problems/    → Açık alarmlar
GET /api/noc/traffic/     → TPS serisi (sparkline)
"""
import asyncio
from rest_framework.decorators import api_view
from rest_framework.response    import Response
from rest_framework             import status

from .client import (
    get_platform_tps,
    get_error_rate,
    get_jvm_heap,
    get_db_pool_usage,
    get_pod_summary,
    get_active_problems,
    get_traffic_series,
)
from .cache import cached


# ── Cached client fonksiyonları ───────────────────────────────
@cached("noc:tps",      ttl=5)
async def _tps():        return await get_platform_tps()

@cached("noc:error",    ttl=5)
async def _error():      return await get_error_rate()

@cached("noc:heap",     ttl=5)
async def _heap():       return await get_jvm_heap()

@cached("noc:pool",     ttl=5)
async def _pool():       return await get_db_pool_usage()

@cached("noc:pods",     ttl=10)
async def _pods():       return await get_pod_summary()

@cached("noc:problems", ttl=10)
async def _problems():   return await get_active_problems()

@cached("noc:traffic",  ttl=5)
async def _traffic():    return await get_traffic_series()


# ── Views ─────────────────────────────────────────────────────

@api_view(["GET"])
def noc_snapshot(request):
    """
    NOC dashboard için tüm canlı metrikleri tek seferde döner.
    React useNOCMetrics hook → polling interval: 5s

    Response:
    {
      tps: 4217,
      errorRate: 0.82,
      jvmHeap: 71,
      dbPool: { poolUsage: 68, activeConnections: 341 },
      pods: { running: 247, pending: 3, crashLoop: 2, total: 252 },
      nginx: { tps: 2100, activeCon: 341, rate5xx: 0.4 }
    }
    """
    try:
        tps, error, heap, pool, pods = asyncio.run(asyncio.gather(
            _tps(), _error(), _heap(), _pool(), _pods(),
        ))
        return Response({
            "tps":       tps,
            "errorRate": error,
            "jvmHeap":   heap,
            "dbPool":    pool,
            "pods":      pods,
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(["GET"])
def active_problems(request):
    """
    Açık Dynatrace problem'leri → Top Issues paneli.
    Response:
      [ {service, problem, level, id}, ... ]
    """
    try:
        data = asyncio.run(_problems())
        critical = [p for p in data if p["level"] == "critical"]
        warning  = [p for p in data if p["level"] == "warning"]
        return Response({
            "problems":     data,
            "criticalCount": len(critical),
            "warningCount":  len(warning),
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(["GET"])
def traffic_series(request):
    """
    Son 20 dakikanın TPS serisi.
    Response:
      [ {t: "0m", v: 4100}, {t: "1m", v: 4350}, ... ]
    """
    try:
        data = asyncio.run(_traffic())
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
