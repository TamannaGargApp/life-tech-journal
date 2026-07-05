"""
backend/app/services/vector_store.py
MongoDB vector search helpers for semantic search.
"""
import numpy as np
from app.core.database import get_db


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    a, b = np.array(a), np.array(b)
    norm_a, norm_b = np.linalg.norm(a), np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


async def store_embedding(article_id: str, embedding: list[float]):
    """Store or update article embedding in MongoDB."""
    db  = get_db()
    col = db["article_embeddings"]
    await col.update_one(
        {"article_id": article_id},
        {"$set": {"article_id": article_id, "embedding": embedding}},
        upsert=True,
    )


async def search_similar(query_embedding: list[float], top_k: int = 5) -> list[dict]:
    """
    Find top_k most similar articles to the query embedding.
    Uses in-memory cosine similarity (works without Atlas Vector Search).
    """
    db  = get_db()
    col = db["article_embeddings"]

    # Load all embeddings (fine for < 10k articles)
    docs = await col.find({}, {"article_id": 1, "embedding": 1}).to_list(10000)
    if not docs:
        return []

    # Score each
    scored = []
    for doc in docs:
        emb   = doc.get("embedding", [])
        if emb:
            score = cosine_similarity(query_embedding, emb)
            scored.append({"article_id": doc["article_id"], "score": score})

    # Sort and return top_k
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]


async def get_all_article_ids_without_embeddings() -> list[str]:
    """Return article IDs that don't have embeddings yet."""
    db   = get_db()
    emb_col = db["article_embeddings"]
    art_col = db["articles"]

    embedded_ids = set(
        doc["article_id"]
        for doc in await emb_col.find({}, {"article_id": 1}).to_list(10000)
    )
    all_articles = await art_col.find(
        {"status": "published"},
        {"_id": 1}
    ).to_list(10000)

    return [
        str(a["_id"]) for a in all_articles
        if str(a["_id"]) not in embedded_ids
    ]