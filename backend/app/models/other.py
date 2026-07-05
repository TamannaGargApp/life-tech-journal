from datetime import datetime
from typing import Optional, List
from enum import Enum
from beanie import Document, Indexed
from pydantic import EmailStr, Field


class Category(Document):
    name:          str
    slug:          Indexed(str, unique=True)
    description:   Optional[str] = None
    icon:          Optional[str] = None
    group:         str = "life"
    article_count: int = 0

    class Settings:
        name = "categories"


class Tag(Document):
    name:  str
    slug:  Indexed(str, unique=True)
    article_count: int = 0

    class Settings:
        name = "tags"


class Comment(Document):
    article_id: str
    author_id:  str
    parent_id:  Optional[str] = None
    content:    str = Field(..., max_length=2000)
    likes:      int = 0
    status:     str = "approved"
    is_edited:  bool = False
    edited_at:  Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "comments"
        indexes = ["article_id", "author_id", "parent_id", "status"]


class Bookmark(Document):
    user_id:    str
    article_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "bookmarks"
        indexes = [[("user_id", 1), ("article_id", 1)]]


class Follower(Document):
    follower_id:  str
    following_id: str
    created_at:   datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "followers"
        indexes = [[("follower_id", 1), ("following_id", 1)]]


class ReadingHistory(Document):
    user_id:    str
    article_id: str
    progress:   int = 0
    completed:  bool = False
    read_at:    datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reading_history"
        indexes = [[("user_id", 1), ("article_id", 1)], [("user_id", 1), ("read_at", -1)]]


class NewsletterSubscriber(Document):
    email:          Indexed(EmailStr, unique=True)
    name:           Optional[str] = None
    is_active:      bool = True
    unsub_token:    Optional[str] = None
    subscribed_at:  datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "newsletter_subscribers"


class MediaFile(Document):
    uploaded_by: str
    filename:    str
    s3_key:      str
    public_url:  str
    mime_type:   str
    size_bytes:  int
    width:       Optional[int] = None
    height:      Optional[int] = None
    created_at:  datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "media_library"
        indexes = ["uploaded_by"]


class AnalyticsEvent(Document):
    event:      str
    article_id: Optional[str] = None
    user_id:    Optional[str] = None
    ip:         Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "analytics"
        indexes = ["event", "article_id", [("created_at", -1)]]


class AuditLog(Document):
    user_id:     Optional[str] = None
    action:      str
    resource:    str
    resource_id: Optional[str] = None
    ip:          Optional[str] = None
    created_at:  datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "audit_logs"
        indexes = ["user_id", "action", [("created_at", -1)]]
