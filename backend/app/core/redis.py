import json
from typing import Any, Optional
import redis.asyncio as aioredis
from app.core.config import settings

_redis = None


async def connect_redis() -> None:
    global _redis
    try:
        password = (settings.REDIS_PASSWORD or "").strip() or None
        _redis = await aioredis.from_url(
            settings.REDIS_URL,
            password=password,
            encoding="utf-8",
            decode_responses=True,
            protocol=2,
        )
        await _redis.ping()
        print("Redis connected")
    except Exception as e:
        print(f"Redis unavailable (caching disabled): {e}")
        _redis = None


async def disconnect_redis() -> None:
    global _redis
    if _redis:
        try:
            await _redis.aclose()
        except Exception:
            pass
        _redis = None


def get_redis():
    return _redis


async def cache_get(key: str) -> Optional[Any]:
    try:
        if not _redis:
            return None
        raw = await _redis.get(key)
        return json.loads(raw) if raw else None
    except Exception:
        return None


async def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    try:
        if not _redis:
            return
        await _redis.setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        pass


async def cache_delete(key: str) -> None:
    try:
        if not _redis:
            return
        await _redis.delete(key)
    except Exception:
        pass


async def cache_delete_pattern(pattern: str) -> None:
    try:
        if not _redis:
            return
        keys = await _redis.keys(pattern)
        if keys:
            await _redis.delete(*keys)
    except Exception:
        pass


async def cache_incr(key: str, amount: int = 1) -> int:
    try:
        if not _redis:
            return 0
        return await _redis.incrby(key, amount)
    except Exception:
        return 0