from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

AUDITED_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
SKIP_PATHS = {"/health", "/api/v1/auth/refresh"}


class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if request.method in AUDITED_METHODS and request.url.path not in SKIP_PATHS:
            try:
                from app.models.other import AuditLog
                user_id = None
                auth = request.headers.get("Authorization", "")
                if auth.startswith("Bearer "):
                    from app.core.security import decode_token
                    try:
                        user_id = decode_token(auth[7:]).get("sub")
                    except Exception:
                        pass
                await AuditLog(user_id=user_id, action=request.method, resource=request.url.path, ip=request.client.host if request.client else None).insert()
            except Exception:
                pass
        return response
