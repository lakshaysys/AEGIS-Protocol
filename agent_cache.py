# agent_cache.py
import asyncio
import time
import logging
from collections import OrderedDict
from typing import Any, Optional

logging.basicConfig(level=logging.INFO)

class AegisCacheManager:
    """
    An asynchronous, memory-safe LRU cache with TTL for A.E.G.I.S. execution logging.
    Prevents memory leaks in long-running autonomous agent nodes.
    """
    def __init__(self, max_size: int = 1000, default_ttl: int = 3600):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: OrderedDict[str, dict] = OrderedDict()
        self._lock = asyncio.Lock()
        logging.info(f"A.E.G.I.S. Cache Manager initialized (Max Size: {max_size}, TTL: {default_ttl}s)")

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        async with self._lock:
            expire_at = time.time() + (ttl if ttl is not None else self.default_ttl)
            
            if key in self._cache:
                self._cache.move_to_end(key)
            
            self._cache[key] = {"value": value, "expire_at": expire_at}
            
            # Evict oldest items if max size is exceeded
            while len(self._cache) > self.max_size:
                self._cache.popitem(last=False)

    async def get(self, key: str) -> Optional[Any]:
        async with self._lock:
            if key not in self._cache:
                return None
            
            item = self._cache[key]
            
            # Check for expiration
            if time.time() > item["expire_at"]:
                del self._cache[key]
                return None
            
            # Mark as recently used
            self._cache.move_to_end(key)
            return item["value"]

    async def clear_expired(self) -> int:
        """Background task to purge expired entries."""
        async with self._lock:
            current_time = time.time()
            expired_keys = [k for k, v in self._cache.items() if current_time > v["expire_at"]]
            for k in expired_keys:
                del self._cache[k]
            return len(expired_keys)

# Example usage within the orchestrator:
# cache = AegisCacheManager(max_size=500, default_ttl=1800)
# await cache.set("task_123_proof", proof_hash, ttl=600)
