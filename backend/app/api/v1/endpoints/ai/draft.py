"""
backend/app/api/v1/endpoints/ai/draft.py
POST /api/v1/ai/draft
Topic/title → full structured HTML article draft (content only, no DOCTYPE/html/body tags).
"""
import re
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from .ollama import generate, MAIN_MODEL

router = APIRouter()


class DraftRequest(BaseModel):
    title:    str
    category: str = "general"
    tone:     str = "professional"
    length:   str = "medium"
    keywords: list[str] = []


LENGTH_MAP = {"short": "500", "medium": "1000", "long": "1500"}


def clean_draft(text: str) -> str:
    """Remove any HTML boilerplate the model might add."""
    # Remove markdown code fences
    text = re.sub(r"```html?\s*", "", text)
    text = re.sub(r"```\s*", "", text)

    # Remove full HTML document wrapper tags
    text = re.sub(r"<!DOCTYPE[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<html[^>]*>.*?</html>", lambda m: _extract_body(m.group()), text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r"<head>.*?</head>", "", text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r"</?html[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"</?body[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"</?head[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"</?main[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"</?article[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<meta[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<title>[^<]*</title>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<link[^>]*>", "", text, flags=re.IGNORECASE)

    # Clean up excessive whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract_body(html: str) -> str:
    """Extract content between <body> tags if present."""
    match = re.search(r"<body[^>]*>(.*?)</body>", html, re.DOTALL|re.IGNORECASE)
    return match.group(1) if match else html


@router.post("/draft")
async def generate_draft(body: DraftRequest):
    if not body.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")

    word_count = LENGTH_MAP.get(body.length, "1000")
    kw_str     = ", ".join(body.keywords) if body.keywords else "relevant keywords"

    system = """You are an expert content writer for "Life & Tech Journal".
Write ONLY the article body content in HTML format.
DO NOT include DOCTYPE, <html>, <head>, <body>, <meta>, or <title> tags.
Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <blockquote>, <strong>, <em>, <code>, <pre>, <hr>
Start directly with the first paragraph or heading. No preamble, no explanation."""

    prompt = f"""Write a complete blog article for "Life & Tech Journal".

Title: {body.title}
Category: {body.category}
Tone: {body.tone}
Target length: {word_count} words
Focus keywords: {kw_str}

IMPORTANT: Output ONLY the article body HTML. No DOCTYPE, no html/head/body tags.
Start directly with content like <p>...</p> or <h2>...</h2>.

Structure to follow:
1. Opening paragraph (hook the reader, include main keyword)
2. 3-4 sections with <h2> headings
3. A bullet list of key points using <ul><li>
4. Strong conclusion paragraph

Begin writing now:"""

    # Use non-streaming for cleaner output that we can post-process
    async def stream():
        try:
            # Generate full response then clean it
            result = await generate(prompt, model=MAIN_MODEL, system=system)
            cleaned = clean_draft(result)
            yield cleaned
        except Exception as e:
            yield f"<p>Error generating draft: {str(e)}</p>"

    return StreamingResponse(stream(), media_type="text/plain")