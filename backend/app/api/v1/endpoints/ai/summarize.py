"""
backend/app/api/v1/endpoints/ai/summarize.py
POST /api/v1/ai/summarize
Article content → 3-bullet summary.
"""
import json
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ollama import generate, FAST_MODEL
from app.services.ai_cache import get_cached, set_cached

router = APIRouter()


class SummarizeRequest(BaseModel):
    slug:    str
    title:   str
    content: str


class SummarizeResponse(BaseModel):
    bullets:  list[str]
    takeaway: str


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
    # Fallback — extract bullets as lines
    result = {}
    m = re.search(r'"bullets"\s*:\s*\[(.*?)\]', text, re.DOTALL)
    if m:
        result["bullets"] = re.findall(r'"([^"]+)"', m.group(1))
    m = re.search(r'"takeaway"\s*:\s*"([^"]+)"', text)
    if m:
        result["takeaway"] = m.group(1)
    return result


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_article(body: SummarizeRequest):
    cached = await get_cached("summarize", slug=body.slug)
    if cached:
        return cached

    clean = re.sub(r"<[^>]+>", " ", body.content)
    clean = re.sub(r"\s+", " ", clean).strip()[:3001]

    prompt = f"""Summarize this article in "Read in 30 seconds" format.

Article: "{body.title}"
Content: {clean}

Respond with ONLY this JSON, no other text:
{{"bullets":["first key point under 20 words","second key point under 20 words","third key point under 20 words"],"takeaway":"single most important sentence"}}"""

    try:
        raw  = await generate(prompt, model=FAST_MODEL)
        data = extract_json(raw)

        bullets  = [str(b) for b in data.get("bullets", [])][:3]
        takeaway = str(data.get("takeaway", ""))

        # Fallback if AI didn't return proper structure
        if not bullets:
            lines = [l.strip() for l in clean.split(".") if len(l.strip()) > 20][:3]
            bullets = lines or ["Key insights from this article"]

        result = SummarizeResponse(bullets=bullets, takeaway=takeaway)
        await set_cached("summarize", result.model_dump(), slug=body.slug)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI failed: {str(e)[:100]}. Try again.")