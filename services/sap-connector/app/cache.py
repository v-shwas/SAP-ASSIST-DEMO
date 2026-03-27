"""Redis cache decorator for SAP API responses."""
import json
import functools
import hashlib
from typing import Any, Callable
import redis.asyncio as aioredis
from app.config import settings

_redis: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis


def cache(ttl_seconds: int = 300, prefix: str = "sap"):
    """Decorator that caches async function results in Redis.

    Cache key = prefix:tenant_id:function_name:sha256(args+kwargs).
    The decorated function's first argument must be `tenant_id: str`.
    """
    def decorator(fn: Callable) -> Callable:
        @functools.wraps(fn)
        async def wrapper(tenant_id: str, *args: Any, **kwargs: Any) -> Any:
            r = await get_redis()
            payload = json.dumps({"args": list(args), "kwargs": kwargs}, sort_keys=True)
            key = f"{prefix}:{tenant_id}:{fn.__name__}:{hashlib.sha256(payload.encode()).hexdigest()[:16]}"

            cached = await r.get(key)
            if cached is not None:
                return json.loads(cached)

            result = await fn(tenant_id, *args, **kwargs)
            await r.setex(key, ttl_seconds, json.dumps(result))
            return result

        return wrapper
    return decorator
