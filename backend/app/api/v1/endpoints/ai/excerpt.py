"""
backend/app/api/v1/endpoints/ai/excerpt.py
POST /api/v1/ai/excerpt
Generates excerpt + meta description + meta title from article content.
"""
import json
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ollama import generate, FAST_MODEL
from app.services.ai_cache import get_cached, set_cached

router = APIRouter()


class ExcerptRequest(BaseModel):
    title:   str
    content: str


class ExcerptResponse(BaseModel):
    excerpt:          str
    meta_title:       str
    meta_description: str
    keywords:         list[str]


def extract_json(text: str) -> dict:
    """Robustly extract JSON from model output that may have extra text."""
    text = text.strip()

    # Remove markdown fences
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    text = text.strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Find first { ... } block
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Try to extract individual fields manually as fallback
    result = {}
    for field in ["excerpt", "meta_title", "meta_description"]:
        m = re.search(rf'"{field}"\s*:\s*"([^"]*)"', text)
        if m:
            result[field] = m.group(1)

    # Extract keywords array
    m = re.search(r'"keywords"\s*:\s*\[(.*?)\]', text, re.DOTALL)
    if m:
        kws = re.findall(r'"([^"]+)"', m.group(1))
        result["keywords"] = kws

    if result:
        return result

    raise ValueError(f"Could not extract JSON from: {text[:200]}")


@router.post("/excerpt", response_model=ExcerptResponse)
async def generate_excerpt(body: ExcerptRequest):
    # Check cache
    cached = await get_cached("excerpt", title=body.title, content=body.content[:500])
    if cached:
        return cached

    # Strip HTML tags
    clean = re.sub(r"<[^>]+>", " ", body.content).strip()
    clean = re.sub(r"\s+", " ", clean)[:2000]

    prompt = f"""You are an SEO expert. Generate SEO metadata for this blog article.

Title: {body.title}
Content: {clean}

Respond with ONLY a JSON object, no other text, no markdown fences:
{{"excerpt":"compelling 1-2 sentence summary under 160 chars","meta_title":"SEO title 50-60 chars","meta_description":"meta description 120-158 chars","keywords":["kw1","kw2","kw3","kw4","kw5"]}}"""

    try:
        raw = await generate(prompt, model=FAST_MODEL)
        data = extract_json(raw)

        result = ExcerptResponse(
            excerpt          = str(data.get("excerpt", ""))[:400],
            meta_title       = str(data.get("meta_title", body.title))[:60],
            meta_description = str(data.get("meta_description", ""))[:160],
            keywords         = [str(k) for k in data.get("keywords", [])][:8],
        )

        await set_cached("excerpt", result.model_dump(),
                         title=body.title, content=body.content[:500])
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI parsing failed: {str(e)[:100]}. Try again.")