"""
backend/app/api/v1/endpoints/ai/chat.py
POST /api/v1/ai/chat
RAG chatbot — answers questions using published articles as context.
Streams response via SSE.
"""
import re, json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from .ollama import embed, generate_stream, MAIN_MODEL
from app.services.vector_store import search_similar
from app.core.database import get_db

router = APIRouter()


class ChatMessage(BaseModel):
    role:    str   # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message:  str
    history:  list[ChatMessage] = []


async def get_context(query: str) -> tuple[str, list[dict]]:
    """Embed query, find relevant articles, return context string + article list."""
    try:
        vec     = await embed(query)
        similar = await search_similar(vec, top_k=4)
    except Exception:
        return "", []

    if not similar:
        return "", []

    db  = get_db()
    col = db["articles"]
    from bson import ObjectId

    articles = []
    ctx_parts = []

    for item in similar:
        if item["score"] < 0.3:
            continue
        try:
            doc = await col.find_one(
                {"_id": ObjectId(item["article_id"]), "status": "published"},
                {"title":1,"slug":1,"excerpt":1,"content":1,"category_id":1}
            )
            if not doc:
                continue
            clean   = re.sub(r"<[^>]+>", " ", doc.get("content",""))
            clean   = re.sub(r"\s+", " ", clean).strip()[:800]
            title   = doc.get("title","")
            slug    = doc.get("slug","")
            excerpt = doc.get("excerpt","")
            ctx_parts.append(f"Article: {title}\nURL: /blog/{slug}\nSummary: {excerpt}\nContent: {clean}")
            articles.append({"title": title, "slug": slug, "score": item["score"]})
        except Exception:
            continue

    return "\n\n---\n\n".join(ctx_parts), articles


@router.post("/chat")
async def chat(body: ChatRequest):
    context, articles = await get_context(body.message)

    # Build conversation history
    history_text = ""
    for msg in body.history[-6:]:  # last 6 messages for context
        role = "User" if msg.role == "user" else "Assistant"
        history_text += f"{role}: {msg.content}\n"

    system = """You are a helpful assistant for "Life & Tech Journal" — a blog about life lessons, 
career growth, personal development, AI, and technology.

Your job is to help readers find relevant articles and answer their questions about the content.
Always be friendly, concise, and helpful. If you reference an article, include the URL path.
If you don't know something or can't find relevant articles, say so honestly."""

    if context:
        prompt = f"""Conversation history:
{history_text}

Relevant articles from our blog:
{context}

User's question: {body.message}

Answer helpfully using the articles above. Include article links (/blog/slug) when relevant.
If the articles don't fully answer the question, say so and provide general advice."""
    else:
        prompt = f"""Conversation history:
{history_text}

User's question: {body.message}

No specific articles were found for this query. Answer generally based on your knowledge about 
life, career, personal growth, and technology. Suggest the user browse /blog for more content."""

    async def stream():
        # First yield article references as metadata
        if articles:
            meta = json.dumps({"type": "sources", "articles": articles[:3]})
            yield f"data: {meta}\n\n"

        # Then stream the AI response
        async for token in generate_stream(prompt, model=MAIN_MODEL, system=system):
            data = json.dumps({"type": "token", "content": token})
            yield f"data: {data}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})