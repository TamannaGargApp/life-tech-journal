"""
backend/app/api/v1/endpoints/ai/ollama.py
Ollama client helper — wraps all model calls in one place.
"""
import httpx
import json
from app.core.config import settings

OLLAMA_URL  = getattr(settings, "OLLAMA_BASE_URL",  "http://localhost:11434")
MAIN_MODEL  = getattr(settings, "OLLAMA_MODEL",      "mistral")
FAST_MODEL  = getattr(settings, "OLLAMA_FAST_MODEL", "llama3.2")
EMBED_MODEL = getattr(settings, "OLLAMA_EMBED_MODEL","nomic-embed-text")


async def generate(prompt: str, model: str = MAIN_MODEL, system: str = "") -> str:
    """Single-shot generation — returns full response string."""
    payload = {
        "model":  model,
        "prompt": prompt,
        "stream": False,
    }
    if system:
        payload["system"] = system

    async with httpx.AsyncClient(timeout=120.0) as client:
        res = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
        res.raise_for_status()
        return res.json().get("response", "").strip()


async def generate_stream(prompt: str, model: str = MAIN_MODEL, system: str = ""):
    """Streaming generation — yields text chunks as they arrive."""
    payload = {
        "model":  model,
        "prompt": prompt,
        "stream": True,
    }
    if system:
        payload["system"] = system

    async with httpx.AsyncClient(timeout=180.0) as client:
        async with client.stream("POST", f"{OLLAMA_URL}/api/generate", json=payload) as res:
            async for line in res.aiter_lines():
                if line.strip():
                    try:
                        data = json.loads(line)
                        token = data.get("response", "")
                        if token:
                            yield token
                        if data.get("done"):
                            break
                    except json.JSONDecodeError:
                        continue


async def embed(text: str) -> list[float]:
    """Generate embedding vector for text using nomic-embed-text."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        res = await client.post(
            f"{OLLAMA_URL}/api/embeddings",
            json={"model": EMBED_MODEL, "prompt": text[:8000]},
        )
        res.raise_for_status()
        return res.json().get("embedding", [])


async def is_available() -> bool:
    """Check if Ollama is running."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res = await client.get(f"{OLLAMA_URL}/api/tags")
            return res.status_code == 200
    except Exception:
        return False


async def list_models() -> list[str]:
    """Return list of pulled model names."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(f"{OLLAMA_URL}/api/tags")
            data = res.json()
            return [m["name"] for m in data.get("models", [])]
    except Exception:
        return []
    