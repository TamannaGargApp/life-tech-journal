"""
backend/app/api/v1/endpoints/ai/newsletter.py
POST /api/v1/ai/newsletter
Auto-curate weekly newsletter from top articles.
"""
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ollama import generate, MAIN_MODEL
from app.core.database import get_db
from datetime import datetime, timedelta

router = APIRouter()


class NewsletterRequest(BaseModel):
    weeks_back: int = 1       # look at articles from last N weeks
    max_articles: int = 5     # include up to N articles


class NewsletterResponse(BaseModel):
    subject:      str
    preview_text: str
    intro:        str
    articles:     list[dict]
    outro:        str


@router.post("/newsletter", response_model=NewsletterResponse)
async def curate_newsletter(body: NewsletterRequest):
    db  = get_db()
    col = db["articles"]

    # Fetch recent published articles
    since = datetime.utcnow() - timedelta(weeks=body.weeks_back)
    docs  = await col.find(
        {"status": "published", "published_at": {"$gte": since}},
        {"title":1,"slug":1,"excerpt":1,"category_id":1,"views":1,"likes":1,"read_time":1}
    ).sort([("views", -1), ("likes", -1)]).limit(body.max_articles).to_list(body.max_articles)

    if not docs:
        # Fall back to all-time top articles if no recent ones
        docs = await col.find(
            {"status": "published"},
            {"title":1,"slug":1,"excerpt":1,"category_id":1,"views":1,"likes":1,"read_time":1}
        ).sort([("views", -1)]).limit(body.max_articles).to_list(body.max_articles)

    if not docs:
        raise HTTPException(status_code=404, detail="No published articles found")

    articles_text = "\n".join([
        f"- {d.get('title','')} ({d.get('read_time',5)} min read, {d.get('views',0)} views)"
        for d in docs
    ])

    prompt = f"""You are writing a weekly newsletter for "Life & Tech Journal" subscribers.

This week's top articles:
{articles_text}

Write a newsletter in JSON format:
{{
  "subject": "Email subject line (engaging, 50 chars max)",
  "preview_text": "Preview text shown in inbox (90 chars max)",
  "intro": "Warm, engaging 2-3 sentence intro paragraph for this week's issue",
  "outro": "Friendly 1-2 sentence sign-off encouraging readers to share or reply"
}}

Be warm, personal, and enthusiastic. Sound like a human editor, not a robot."""

    try:
        raw = await generate(prompt, model=MAIN_MODEL)
        raw = raw.strip()
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        data = json.loads(raw.strip())

        formatted_articles = []
        for doc in docs:
            formatted_articles.append({
                "id":       str(doc.get("_id", "")),
                "title":    doc.get("title",""),
                "slug":     doc.get("slug",""),
                "excerpt":  doc.get("excerpt",""),
                "category": doc.get("category_id",""),
                "readTime": doc.get("read_time", 5),
                "views":    doc.get("views", 0),
                "url":      f"/blog/{doc.get('slug','')}",
            })

        return NewsletterResponse(
            subject      = data.get("subject", "This Week on Life & Tech Journal"),
            preview_text = data.get("preview_text", ""),
            intro        = data.get("intro", ""),
            articles     = formatted_articles,
            outro        = data.get("outro", ""),
        )

    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI unavailable: {str(e)}")