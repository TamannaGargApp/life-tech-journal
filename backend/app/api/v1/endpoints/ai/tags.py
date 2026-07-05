"""
backend/app/api/v1/endpoints/ai/tags.py
POST /api/v1/ai/tags
Content → suggested category + keywords.
"""
import json
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ollama import generate, FAST_MODEL
from app.services.ai_cache import get_cached, set_cached

router = APIRouter()

CATEGORIES = [
    "personal-growth","career","lifestyle","relationships",
    "productivity","travel","motivation","ai","programming",
    "web-dev","marketing","cybersecurity","cloud","data-science",
]


class TagsRequest(BaseModel):
    title:   str
    content: str


class TagsResponse(BaseModel):
    category:   str
    keywords:   list[str]
    confidence: float


def extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except Exception:
            pass
    # Manual extraction fallback
    result = {}
    m = re.search(r'"category"\s*:\s*"([^"]+)"', text)
    if m: result["category"] = m.group(1)
    m = re.search(r'"keywords"\s*:\s*\[(.*?)\]', text, re.DOTALL)
    if m: result["keywords"] = re.findall(r'"([^"]+)"', m.group(1))
    m = re.search(r'"confidence"\s*:\s*([\d.]+)', text)
    if m: result["confidence"] = float(m.group(1))
    return result


@router.post("/tags", response_model=TagsResponse)
async def suggest_tags(body: TagsRequest):
    cached = await get_cached("tags", title=body.title, content=body.content[:300])
    if cached:
        return cached

    clean = re.sub(r"<[^>]+>", " ", body.content)
    clean = re.sub(r"\s+", " ", clean).strip()[:1500]

    cats  = ", ".join(CATEGORIES)
    prompt = f"""Classify this blog article. Available categories: {cats}

Title: {body.title}
Content: {clean}

Respond with ONLY this JSON, no other text:
{{"category":"best matching category from the list","keywords":["kw1","kw2","kw3","kw4","kw5"],"confidence":0.9}}"""

    try:
        raw  = await generate(prompt, model=FAST_MODEL)
        data = extract_json(raw)

        cat = str(data.get("category", "ai")).lower().strip()
        # Find closest match
        if cat not in CATEGORIES:
            cat = next((c for c in CATEGORIES if c in cat or cat in c), "ai")

        result = TagsResponse(
            category   = cat,
            keywords   = [str(k) for k in data.get("keywords", [])][:8],
            confidence = float(data.get("confidence", 0.8)),
        )
        await set_cached("tags", result.model_dump(),
                         title=body.title, content=body.content[:300])
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI failed: {str(e)[:100]}. Try again.")