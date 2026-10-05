from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.core.redis import connect_redis, disconnect_redis
from app.api.v1.router import api_router
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.audit import AuditMiddleware
from app.seed import seed_articles


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    try:
        await seed_articles()
    except Exception as e:
        print(f"⚠️  Article seeding skipped: {e}")
    try:
        await connect_redis()
    except Exception as e:
        print(f"⚠️  Redis unavailable: {e}")
    yield
    await disconnect_db()
    await disconnect_redis()


# Always enable docs in development — disable only in production explicitly
app = FastAPI(
    title="Life & Tech Journal API",
    version="1.0.0",
    docs_url="/api/docs",    # always available
    redoc_url="/api/redoc",  # always available
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuditMiddleware)
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "version": "1.0.0"}