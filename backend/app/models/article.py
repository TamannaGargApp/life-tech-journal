from datetime import datetime
from typing import Optional, List
from enum import Enum
from beanie import Document, Indexed
from pydantic import Field


class ArticleStatus(str, Enum):
    draft     = "draft"
    published = "published"
    scheduled = "scheduled"
    archived  = "archived"


class Article(Document):
    title:          str = Field(..., max_length=200)
    slug:           Indexed(str, unique=True)
    excerpt:        str = Field(..., max_length=400)
    content:        str
    featured_image: Optional[str] = None
    category_id:    str
    tag_ids:        List[str] = []
    author_id:      str
    status:         ArticleStatus = ArticleStatus.draft
    published_at:   Optional[datetime] = None
    scheduled_at:   Optional[datetime] = None
    views:          int = 0
    likes:          int = 0
    bookmarks:      int = 0
    read_time:      int = 0
    featured:       bool = False
    editors_pick:   bool = False
    meta_title:       Optional[str] = None
    meta_description: Optional[str] = None
    keywords:         List[str] = []
    og_image:         Optional[str] = None
    canonical_url:    Optional[str] = None
    created_at:     datetime = Field(default_factory=datetime.utcnow)
    updated_at:     datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "articles"
        indexes = [
            "slug",
            "status",
            "author_id",
            "category_id",
            [("title", "text"), ("excerpt", "text"), ("content", "text")],
            [("published_at", -1)],
            [("views", -1)],
        ]
