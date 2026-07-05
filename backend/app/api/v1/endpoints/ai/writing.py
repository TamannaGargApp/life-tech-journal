"""
backend/app/api/v1/endpoints/ai/writing.py
POST /api/v1/ai/writing-assist
Inline writing suggestions — streaming.
"""
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from .ollama import generate_stream, MAIN_MODEL

router = APIRouter()


class WritingRequest(BaseModel):
    content:    str   # current content
    cursor_pos: int = -1  # where the cursor is
    action:     str = "continue"  # continue | improve | shorten | expand | fix-grammar


ACTION_PROMPTS = {
    "continue": "Continue writing the article naturally from where it left off. Write 2-3 more paragraphs in the same style and tone.",
    "improve":  "Rewrite this content to be more engaging, clearer, and better structured. Keep the same information but improve the writing quality.",
    "shorten":  "Shorten this content by 40% while keeping all key points. Make it more concise and punchy.",
    "expand":   "Expand this content with more detail, examples, and explanation. Add 2-3 paragraphs with supporting information.",
    "fix-grammar": "Fix all grammar, spelling, and punctuation errors. Keep the same content and style.",
}


@router.post("/writing-assist")
async def writing_assist(body: WritingRequest):
    import re
    clean   = re.sub(r"<[^>]+>", " ", body.content)
    clean   = re.sub(r"\s+", " ", clean).strip()

    action_instruction = ACTION_PROMPTS.get(body.action, ACTION_PROMPTS["continue"])

    system = """You are an expert editor and writer for "Life & Tech Journal".
You write in a clear, engaging, and professional tone that is accessible to general readers.
Output only HTML content using p, h2, h3, ul, li, blockquote, strong, em tags."""

    prompt = f"""Here is the current article content:

{body.content[:4000]}

Task: {action_instruction}

Output ONLY the HTML content — no explanations, no markdown, just HTML."""

    async def stream():
        async for token in generate_stream(prompt, model=MAIN_MODEL, system=system):
            yield token

    return StreamingResponse(stream(), media_type="text/plain")