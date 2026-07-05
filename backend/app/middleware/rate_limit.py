import time
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

RULES = [
    ("/api/v1/auth/login",    5,  60),
    ("/api/v1/auth/register", 5,  60),
    ("/api/v1/media/presign", 10, 60),
    ("/api/v1/",              60, 60),
]


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        ip = request.client.host if request.client else "unknown"
        path = request.url.path
        for prefix, limit, window in RULES:
            if path.startswith(prefix):
                try:
                    from app.core.redis import get_redis
                    redis = get_redis()
                    key   = f"rl:{ip}:{prefix}"
                    now   = int(time.time())
                    pipe  = redis.pipeline()
                    pipe.zremrangebyscore(key, 0, now - window)
                    pipe.zadd(key, {f"{now}{id(request)}": now})
                    pipe.zcard(key)
                    pipe.expire(key, window)
                    results = await pipe.execute()
                    if results[2] > limit:
                        return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"}, headers={"Retry-After": str(window)})
                except Exception:
                    pass
                break
        return await call_next(request)
