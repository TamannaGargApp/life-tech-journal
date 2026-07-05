"""
backend/app/services/ai_cache.py
Redis caching for AI responses — saves time and avoids re-running models.
"""
import hashlib
import json
from app.core.redis import cache_get, cache_set

AI_CACHE_TTL = 3600  # 1 hour default


def _make_key(feature: str, **kwargs) -> str:
    """Create a deterministic cache key from feature name + inputs."""
    content = json.dumps(kwargs, sort_keys=True)
    hash_   = hashlib.md5(content.encode()).hexdigest()[:12]
    return f"ai:{feature}:{hash_}"


async def get_cached(feature: str, **kwargs):
    key = _make_key(feature, **kwargs)
    return await cache_get(key)


async def set_cached(feature: str, value: any, ttl: int = AI_CACHE_TTL, **kwargs):
    key = _make_key(feature, **kwargs)
    await cache_set(key, value, ttl=ttl)