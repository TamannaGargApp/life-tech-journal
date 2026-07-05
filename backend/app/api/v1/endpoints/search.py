from fastapi import APIRouter, Query
from app.models.article import ArticleStatus
from app.core.redis import cache_get, cache_set, cache_incr

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")
async def search(
    q:    str = Query(..., min_length=1, max_length=200),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
):
    cache_key = f"search:{q}:{page}:{size}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    await cache_incr(f"trending_search:{q.lower()}")
    from app.core.database import get_db
    db    = get_db()
    col   = db["articles"]
    query = {"$text": {"$search": q}, "status": ArticleStatus.published.value}
    total = await col.count_documents(query)
    docs  = await col.find(query, {"score": {"$meta": "textScore"}}).sort([("score", {"$meta": "textScore"})]).skip((page - 1) * size).limit(size).to_list(size)
    for d in docs:
        d["id"] = str(d.pop("_id"))
        d.pop("score", None)
    result = {"articles": docs, "total": total, "query": q, "page": page}
    await cache_set(cache_key, result, ttl=60)
    return result


@router.get("/suggestions")
async def suggestions(q: str = Query(..., min_length=1)):
    from app.core.database import get_db
    db   = get_db()
    col  = db["articles"]
    docs = await col.find({"title": {"$regex": q, "$options": "i"}, "status": ArticleStatus.published.value}, {"title": 1}).limit(6).to_list(6)
    return {"suggestions": [d["title"] for d in docs]}


@router.get("/trending")
async def trending_searches():
    from app.core.redis import get_redis
    redis = get_redis()
    keys  = await redis.keys("trending_search:*")
    if not keys:
        return {"trending": []}
    counts = await redis.mget(*keys)
    pairs  = sorted([(k.split(":", 1)[1], int(v or 0)) for k, v in zip(keys, counts)], key=lambda x: x[1], reverse=True)
    return {"trending": [p[0] for p in pairs[:10]]}
