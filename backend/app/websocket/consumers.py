"""
NOC WebSocket consumer.
React bağlanır → her 5s'de Dynatrace'den çekilen güncel snapshot push edilir.

ws://localhost:8000/ws/noc/
"""
import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer

from dynatrace.client import (
    get_platform_tps,
    get_error_rate,
    get_jvm_heap,
    get_db_pool_usage,
    get_pod_summary,
    get_active_problems,
    get_traffic_series,
)

PUSH_INTERVAL = 5  # saniye


class NOCConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self._running = True
        asyncio.create_task(self._push_loop())

    async def disconnect(self, code):
        self._running = False

    async def receive(self, text_data=None, bytes_data=None):
        """Client'tan mesaj beklenmez; sadece ping/pong."""
        pass

    # ── Push loop ─────────────────────────────────────────────
    async def _push_loop(self):
        while self._running:
            try:
                snapshot = await self._build_snapshot()
                await self.send(json.dumps(snapshot))
            except Exception as e:
                await self.send(json.dumps({"error": str(e)}))
            await asyncio.sleep(PUSH_INTERVAL)

    async def _build_snapshot(self) -> dict:
        tps, error, heap, pool, pods, problems, traffic = await asyncio.gather(
            get_platform_tps(),
            get_error_rate(),
            get_jvm_heap(),
            get_db_pool_usage(),
            get_pod_summary(),
            get_active_problems(),
            get_traffic_series(),
        )
        critical = [p for p in problems if p["level"] == "critical"]
        warning  = [p for p in problems if p["level"] == "warning"]

        return {
            "type":          "noc_snapshot",
            "tps":           tps,
            "errorRate":     error,
            "jvmHeap":       heap,
            "dbPool":        pool,
            "pods":          pods,
            "problems":      problems,
            "criticalCount": len(critical),
            "warningCount":  len(warning),
            "trafficSeries": traffic,
        }
