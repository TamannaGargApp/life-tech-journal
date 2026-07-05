"""
backend/app/api/v1/endpoints/ai/status.py
Health check for Ollama — lets frontend know if AI is available.
"""
from fastapi import APIRouter
from .ollama import is_available, list_models

router = APIRouter()

@router.get("/status")
async def ai_status():
    available = await is_available()
    models    = await list_models() if available else []
    return {
        "ollama_available": available,
        "models":           models,
        "ready":            available and len(models) > 0,
    }