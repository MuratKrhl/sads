"""
Cache yardımcıları.
Her endpoint kendi TTL'ini belirler:
  - Envanter (host sayısı, uygulama listesi): 300s
  - NOC live metrics (TPS, heap, pool):        5s
  - Problem listesi:                           10s
"""
import json
import asyncio
import functools
from django.core.cache import cache


def cached(key: str, ttl: int):
    """
    Async view/fonksiyon için cache decorator.

    Kullanım:
        @cached("inventory:hosts", ttl=300)
        async def get_host_summary(): ...
    """
    def decorator(fn):
        @functools.wraps(fn)
        async def wrapper(*args, **kwargs):
            hit = cache.get(key)
            if hit is not None:
                return json.loads(hit)

            result = await fn(*args, **kwargs)
            cache.set(key, json.dumps(result), timeout=ttl)
            return result
        return wrapper
    return decorator


def invalidate(key: str):
    """Belirli bir cache key'ini temizler."""
    cache.delete(key)


def invalidate_pattern(prefix: str):
    """
    Prefix ile başlayan tüm key'leri temizler.
    Not: Django Redis backend'de keys() desteği gerekir.
    """
    from django.core.cache import caches
    redis_cache = caches["default"]
    client = redis_cache._cache.get_client()
    for key in client.keys(f"*{prefix}*"):
        client.delete(key)
