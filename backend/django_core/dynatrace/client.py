"""
Dynatrace API v2 async client.
Tüm HTTP işlemi buradan geçer — views hiç httpx görmez.
"""
import httpx
from django.conf import settings

_DT = settings.DYNATRACE


def _headers() -> dict:
    return {
        "Authorization": f"Api-Token {_DT['API_TOKEN']}",
        "Content-Type":  "application/json",
    }


def _url(path: str) -> str:
    return f"{_DT['BASE_URL']}{path}"


# ── Yardımcı ──────────────────────────────────────────────────
async def _get(path: str, params: dict = None) -> dict:
    async with httpx.AsyncClient(timeout=_DT["TIMEOUT"]) as client:
        r = await client.get(_url(path), headers=_headers(), params=params or {})
        r.raise_for_status()
        return r.json()


# ══════════════════════════════════════════════════════════════
#  ENVANTERİ  —  statik / saatlik cache
# ══════════════════════════════════════════════════════════════

async def get_host_summary() -> dict:
    """
    Tüm HOST entity'lerini çeker ve OS'a göre gruplar.
    Dönen format:  { total, linux, aix, windows, other }
    """
    data = await _get("/api/v2/entities", {
        "entitySelector": "type(HOST)",
        "fields":         "+properties.osType",
        "pageSize":       1000,
    })
    hosts = data.get("entities", [])
    counts = {"total": len(hosts), "linux": 0, "aix": 0, "windows": 0, "other": 0}
    for h in hosts:
        os_type = (h.get("properties", {}).get("osType") or "").lower()
        if   "linux"   in os_type: counts["linux"]   += 1
        elif "aix"     in os_type: counts["aix"]     += 1
        elif "windows" in os_type: counts["windows"] += 1
        else:                       counts["other"]   += 1
    return counts


async def get_application_summary() -> list:
    """
    Process Group entity'leri → uygulama başına sayı.
    Dönen format: [ {name, value, technology}, ... ]
    """
    data = await _get("/api/v2/entities", {
        "entitySelector": "type(PROCESS_GROUP)",
        "fields":         "+properties.softwareTechnologies",
        "pageSize":       1000,
    })
    tech_map: dict[str, int] = {}
    for pg in data.get("entities", []):
        techs = pg.get("properties", {}).get("softwareTechnologies", [])
        key = techs[0].get("type", "Unknown") if techs else "Unknown"
        tech_map[key] = tech_map.get(key, 0) + 1

    return [{"name": k, "value": v} for k, v in sorted(tech_map.items(), key=lambda x: -x[1])]


async def get_kdb_certificates() -> list:
    """
    Tag'i 'kdb' olan process group'ları çeker.
    Gerçek sertifika verisi harici bir kaynaktan geliyorsa
    bu fonksiyon override edilebilir.
    """
    data = await _get("/api/v2/entities", {
        "entitySelector": 'type(PROCESS_GROUP),tag("kdb")',
        "fields":         "+tags",
        "pageSize":       500,
    })
    return data.get("entities", [])


async def get_java_certificates() -> list:
    """Java teknolojisi kullanan process group'ları döner."""
    data = await _get("/api/v2/entities", {
        "entitySelector": "type(PROCESS_GROUP),softwareTechnologies(JAVA)",
        "fields":         "+properties.softwareTechnologies,+tags",
        "pageSize":       500,
    })
    return data.get("entities", [])


# ══════════════════════════════════════════════════════════════
#  PLATFORM HEALTH  —  NOC live (5s cache)
# ══════════════════════════════════════════════════════════════

async def get_platform_tps() -> float:
    """Tüm servislerin toplam request/sec değeri."""
    data = await _get("/api/v2/metrics/query", {
        "metricSelector": "builtin:service.requestCount.total:avg:auto:fold",
        "resolution":     "1m",
        "from":           "now-5m",
    })
    return _extract_latest(data)


async def get_error_rate() -> float:
    """Platform geneli hata oranı (%)."""
    data = await _get("/api/v2/metrics/query", {
        "metricSelector": "builtin:service.errors.total.rate:avg:auto:fold",
        "resolution":     "1m",
        "from":           "now-5m",
    })
    return _extract_latest(data)


async def get_jvm_heap() -> float:
    """JBoss process group'larının ortalama heap kullanımı (%)."""
    data = await _get("/api/v2/metrics/query", {
        "metricSelector": (
            "builtin:tech.jvm.memory.pool.usedAfterGc"
            ":avg:auto:fold"
        ),
        "resolution":    "1m",
        "from":          "now-5m",
        "entitySelector": 'type(PROCESS_GROUP_INSTANCE),softwareTechnologies(JBOSS)',
    })
    return _extract_latest(data)


async def get_db_pool_usage() -> dict:
    """DB connection pool kullanım oranı ve aktif bağlantı sayısı."""
    usage = await _get("/api/v2/metrics/query", {
        "metricSelector": "builtin:tech.jdbc.connectionPool.usage:avg:auto:fold",
        "resolution":     "1m",
        "from":           "now-5m",
    })
    active = await _get("/api/v2/metrics/query", {
        "metricSelector": "builtin:tech.jdbc.connectionPool.usedConnections:sum:auto:fold",
        "resolution":     "1m",
        "from":           "now-5m",
    })
    return {
        "poolUsage":        _extract_latest(usage),
        "activeConnections": int(_extract_latest(active)),
    }


async def get_pod_summary() -> dict:
    """OpenShift/Kubernetes pod durumları."""
    data = await _get("/api/v2/entities", {
        "entitySelector": "type(CLOUD_APPLICATION_INSTANCE)",
        "fields":         "+properties.podPhase",
        "pageSize":       2000,
    })
    pods    = data.get("entities", [])
    summary = {"running": 0, "pending": 0, "crashLoop": 0, "total": len(pods)}
    for p in pods:
        phase = (p.get("properties", {}).get("podPhase") or "").lower()
        if   "running"   in phase: summary["running"]    += 1
        elif "pending"   in phase: summary["pending"]    += 1
        elif "crashloop" in phase: summary["crashLoop"]  += 1
    return summary


async def get_active_problems() -> list:
    """Açık alarm listesi — top issues paneli için."""
    data = await _get("/api/v2/problems", {
        "problemSelector": "status(OPEN)",
        "fields":          "+impactedEntities,+severityLevel",
        "pageSize":        50,
    })
    problems = []
    for p in data.get("problems", []):
        severity = p.get("severityLevel", "AVAILABILITY").upper()
        level    = "critical" if severity in ("AVAILABILITY", "ERROR") else "warning"
        entity   = (p.get("impactedEntities") or [{}])[0]
        problems.append({
            "service": entity.get("name", "Unknown"),
            "problem": p.get("title", ""),
            "level":   level,
            "id":      p.get("problemId"),
        })
    return problems


async def get_traffic_series() -> list:
    """Son 20 dakikanın TPS serisini döner (sparkline için)."""
    data = await _get("/api/v2/metrics/query", {
        "metricSelector": "builtin:service.requestCount.total:avg",
        "resolution":     "1m",
        "from":           "now-20m",
    })
    series = []
    try:
        values = data["resolution"]["results"][0]["data"][0]["values"]
        for i, v in enumerate(values):
            series.append({"t": f"{i}m", "v": round(v or 0, 2)})
    except (KeyError, IndexError):
        pass
    return series


# ══════════════════════════════════════════════════════════════
#  YARDIMCI
# ══════════════════════════════════════════════════════════════

def _extract_latest(metric_response: dict) -> float:
    """Metric query response'undan son değeri alır."""
    try:
        values = (
            metric_response["resolution"]["results"][0]["data"][0]["values"]
        )
        # None olmayan son değeri bul
        for v in reversed(values):
            if v is not None:
                return round(v, 2)
    except (KeyError, IndexError, TypeError):
        pass
    return 0.0
