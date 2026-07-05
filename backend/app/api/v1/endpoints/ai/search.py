"""
backend/app/api/v1/endpoints/ai/search.py
POST /api/v1/ai/search
Semantic vector search over published articles.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ollama import embed
from app.services.vector_store import search_similar
from app.core.database import get_db

router = APIRouter()


class SearchRequest(BaseModel):
    query:   str
    top_k:   int = 5


@router.post("/search")
async def semantic_search(body: SearchRequest):
    if not body.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        query_vec = await embed(body.query)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Embedding failed: {str(e)}")

    similar = await search_similar(query_vec, top_k=body.top_k)
    if not similar:
        return {"results": [], "query": body.query}

    # Fetch article details
    db  = get_db()
    col = db["articles"]
    from bson import ObjectId

    results = []
    for item in similar:
        try:
            doc = await col.find_one(
                {"_id": ObjectId(item["article_id"]), "status": "published"},
                {"title":1,"slug":1,"excerpt":1,"category_id":1,"featured_image":1,"read_time":1,"views":1}
            )
            if doc:
                doc["id"]    = str(doc.pop("_id"))
                doc["score"] = round(item["score"], 3)
                results.append(doc)
        except Exception:
            continue

    return {"results": results, "query": body.query}


@router.post("/embed-article")
async def embed_article(article_id: str):
    """Embed a single article and store its vector. Called on publish."""
    from app.services.vector_store import store_embedding
    from bson import ObjectId

    db  = get_db()
    col = db["articles"]

    try:
        doc = await col.find_one({"_id": ObjectId(article_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Article not found")

        import re
        content = re.sub(r"<[^>]+>", " ", doc.get("content", ""))
        text    = f"{doc.get('title','')} {doc.get('excerpt','')} {content}"
        text    = re.sub(r"\s+", " ", text).strip()[:6000]

        vec = await embed(text)
        await store_embedding(article_id, vec)
        return {"status": "embedded", "article_id": article_id}

    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/embed-all")
async def embed_all_articles():
    """Batch embed all published articles that don't have embeddings yet."""
    from app.services.vector_store import store_embedding, get_all_article_ids_without_embeddings
    from bson import ObjectId
    import re

    db  = get_db()
    col = db["articles"]

    ids     = await get_all_article_ids_without_embeddings()
    success = 0
    failed  = 0

    for article_id in ids:
        try:
            doc = await col.find_one({"_id": ObjectId(article_id)})
            if not doc:
                continue
            content = re.sub(r"<[^>]+>", " ", doc.get("content", ""))
            text    = f"{doc.get('title','')} {doc.get('excerpt','')} {content}"
            text    = re.sub(r"\s+", " ", text).strip()[:6000]
            vec     = await embed(text)
            await store_embedding(article_id, vec)
            success += 1
        except Exception:
            failed += 1

    return {"embedded": success, "failed": failed, "total": len(ids)}