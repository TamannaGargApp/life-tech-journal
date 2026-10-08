import re, math
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.article import Article, ArticleStatus
from app.models.other import Bookmark
from app.models.user import User, UserRole
from app.schemas.schemas import CreateArticleRequest, UpdateArticleRequest
from app.api.deps import get_current_user, get_current_user_optional, require_author, require_admin
from app.core.redis import cache_get, cache_set, cache_delete, cache_delete_pattern, cache_incr

router = APIRouter(prefix="/articles", tags=["Articles"])
CACHE_PREFIX = "articles"


def _slug(title: str) -> str:
    s = title.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return s[:80].strip("-")


def _read_time(content: str) -> int:
    return max(1, math.ceil(len(re.findall(r"\w+", content)) / 200))


def _serialize(a: Article, detail: bool = False) -> dict:
    d = {
        "id": str(a.id), "title": a.title, "slug": a.slug, "excerpt": a.excerpt,
        "featured_image": a.featured_image, "category_id": a.category_id,
        "tag_ids": a.tag_ids, "author_id": a.author_id, "status": a.status.value,
        "views": a.views, "likes": a.likes, "bookmarks": a.bookmarks,
        "read_time": a.read_time, "featured": a.featured, "editors_pick": a.editors_pick,
        "published_at": a.published_at.isoformat() if a.published_at else None,
        "created_at": a.created_at.isoformat(),
    }
    if detail:
        d["content"] = a.content
        d["updated_at"] = a.updated_at.isoformat()
        d["seo"] = {"meta_title": a.meta_title, "meta_description": a.meta_description, "keywords": a.keywords, "og_image": a.og_image}
    return d


@router.get("")
async def list_articles(
    page: int = Query(1, ge=1), size: int = Query(10, ge=1, le=1000),
    category: Optional[str] = None, tag: Optional[str] = None,
    sort: str = Query("latest", pattern="^(latest|oldest|popular|trending)$"),
    search: Optional[str] = None,
    user: Optional[User] = Depends(get_current_user_optional),
):
    cache_key = f"{CACHE_PREFIX}:list:{page}:{size}:{category}:{tag}:{sort}:{search}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    query: dict = {"status": ArticleStatus.published.value}
    if category:
        # One slug, or a comma-separated list for a whole group (Life / Technology).
        cats = [c.strip() for c in category.split(",") if c.strip()]
        query["category_id"] = cats[0] if len(cats) == 1 else {"$in": cats}
    if tag:
        query["tag_ids"] = tag
    if search:
        query["$text"] = {"$search": search}

    sort_map = {"latest": [("published_at", -1)], "oldest": [("published_at", 1)], "popular": [("views", -1)], "trending": [("likes", -1)]}
    sort_field = sort_map.get(sort, [("published_at", -1)])

    from app.core.database import get_db
    db = get_db()
    col = db["articles"]
    total = await col.count_documents(query)
    docs  = await col.find(query).sort(sort_field).skip((page - 1) * size).limit(size).to_list(size)

    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        if "status" in d and hasattr(d["status"], "value"):
            d["status"] = d["status"].value
        items.append(d)

    result = {"items": items, "total": total, "page": page, "size": size, "pages": max(1, -(-total // size))}
    await cache_set(cache_key, result, ttl=120)
    return result


@router.get("/featured")
async def featured_articles():
    cached = await cache_get(f"{CACHE_PREFIX}:featured")
    if cached:
        return cached
    from app.core.database import get_db
    db  = get_db()
    col = db["articles"]
    pub = ArticleStatus.published.value
    featured   = await col.find({"featured": True, "status": pub}).limit(1).to_list(1)
    editors    = await col.find({"editors_pick": True, "status": pub}).limit(3).to_list(3)
    trending   = await col.find({"status": pub}).sort([("views", -1)]).limit(5).to_list(5)
    for lst in [featured, editors, trending]:
        for d in lst:
            d["id"] = str(d.pop("_id"))
    result = {"featured": featured, "editors_pick": editors, "trending": trending}
    await cache_set(f"{CACHE_PREFIX}:featured", result, ttl=300)
    return result


@router.get("/{slug}")
async def get_article(slug: str):
    cached = await cache_get(f"{CACHE_PREFIX}:slug:{slug}")
    if cached:
        await cache_incr(f"views:pending:{slug}")
        return cached
    article = await Article.find_one(Article.slug == slug)
    if not article or article.status != ArticleStatus.published:
        raise HTTPException(status_code=404, detail="Article not found")
    article.views += 1
    await article.save()
    result = _serialize(article, detail=True)
    await cache_set(f"{CACHE_PREFIX}:slug:{slug}", result, ttl=300)
    return result


@router.post("", status_code=201)
async def create_article(body: CreateArticleRequest, user: User = Depends(require_author)):
    slug = body.slug or _slug(body.title)
    if await Article.find_one(Article.slug == slug):
        slug = f"{slug}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    article = Article(
        title=body.title, slug=slug, excerpt=body.excerpt, content=body.content,
        featured_image=body.featured_image, category_id=body.category_id, tag_ids=body.tag_ids,
        author_id=str(user.id), status=body.status, scheduled_at=body.scheduled_at,
        featured=body.featured, editors_pick=body.editors_pick, read_time=_read_time(body.content),
        published_at=datetime.utcnow() if body.status == "published" else None,
        meta_title=body.meta_title, meta_description=body.meta_description, keywords=body.keywords,
    )
    await article.insert()
    await cache_delete_pattern(f"{CACHE_PREFIX}:list:*")
    await cache_delete(f"{CACHE_PREFIX}:featured")
    return {"id": str(article.id), "slug": article.slug}


@router.put("/{article_id}")
async def update_article(article_id: str, body: UpdateArticleRequest, user: User = Depends(require_author)):
    article = await Article.get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    if article.author_id != str(user.id) and user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not your article")
    update = body.model_dump(exclude_none=True)
    if "content" in update:
        update["read_time"] = _read_time(update["content"])
    if update.get("status") == "published" and not article.published_at:
        update["published_at"] = datetime.utcnow()
    update["updated_at"] = datetime.utcnow()
    await article.update({"$set": update})
    await cache_delete(f"{CACHE_PREFIX}:slug:{article.slug}")
    await cache_delete_pattern(f"{CACHE_PREFIX}:list:*")
    return {"message": "Updated"}


@router.delete("/{article_id}", status_code=204)
async def delete_article(article_id: str, user: User = Depends(require_admin)):
    article = await Article.get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    await article.delete()
    await cache_delete(f"{CACHE_PREFIX}:slug:{article.slug}")
    await cache_delete_pattern(f"{CACHE_PREFIX}:list:*")


@router.post("/{article_id}/like")
async def toggle_like(article_id: str, user: User = Depends(get_current_user)):
    article = await Article.get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    liked_key = f"liked:{str(user.id)}:{article_id}"
    already_liked = await cache_get(liked_key)
    if already_liked:
        article.likes = max(0, article.likes - 1)
        await cache_delete(liked_key)
        action = "unliked"
    else:
        article.likes += 1
        await cache_set(liked_key, True, ttl=86400 * 30)
        action = "liked"
    await article.save()
    await cache_delete(f"{CACHE_PREFIX}:slug:{article.slug}")
    return {"action": action, "likes": article.likes}


@router.post("/{article_id}/bookmark")
async def toggle_bookmark(article_id: str, user: User = Depends(get_current_user)):
    user_id = str(user.id)
    existing = await Bookmark.find_one(Bookmark.user_id == user_id, Bookmark.article_id == article_id)
    article  = await Article.get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    if existing:
        await existing.delete()
        article.bookmarks = max(0, article.bookmarks - 1)
        action = "removed"
    else:
        await Bookmark(user_id=user_id, article_id=article_id).insert()
        article.bookmarks += 1
        action = "saved"
    await article.save()
    return {"action": action, "bookmarks": article.bookmarks}


@router.get("/{article_id}/related")
async def related_articles(article_id: str):
    cached = await cache_get(f"{CACHE_PREFIX}:related:{article_id}")
    if cached:
        return cached
    article = await Article.get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Not found")
    from app.core.database import get_db
    db  = get_db()
    col = db["articles"]
    docs = await col.find({"tag_ids": {"$in": article.tag_ids}, "_id": {"$ne": article.id}, "status": ArticleStatus.published.value}).sort([("views", -1)]).limit(6).to_list(6)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    await cache_set(f"{CACHE_PREFIX}:related:{article_id}", docs, ttl=600)
    return docs
