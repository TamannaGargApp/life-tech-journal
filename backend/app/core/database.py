from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from beanie import init_beanie
from app.core.config import settings

_client = None
_db = None


async def connect_db() -> None:
    global _client, _db
    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    _db = _client[settings.MONGODB_DB]
    from app.models.user import User
    from app.models.article import Article
    from app.models.other import Category, Tag, Comment, Bookmark, Follower, ReadingHistory, NewsletterSubscriber, MediaFile, AnalyticsEvent, AuditLog
    await init_beanie(database=_db, document_models=[User, Article, Category, Tag, Comment, Bookmark, Follower, ReadingHistory, NewsletterSubscriber, MediaFile, AnalyticsEvent, AuditLog])
    print(f"MongoDB connected: {settings.MONGODB_DB}")


async def disconnect_db() -> None:
    if _client:
        _client.close()


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not initialised")
    return _db
