"""
backend/app/api/v1/endpoints/ai/router.py
Mounts all AI endpoints under /api/v1/ai
"""
from fastapi import APIRouter
from .excerpt    import router as excerpt_router
from .draft      import router as draft_router
from .summarize  import router as summarize_router
from .tags       import router as tags_router
from .search     import router as search_router
from .chat       import router as chat_router
from .writing    import router as writing_router
from .newsletter import router as newsletter_router
from .status     import router as status_router

ai_router = APIRouter(prefix="/ai", tags=["AI"])

ai_router.include_router(status_router)
ai_router.include_router(excerpt_router)
ai_router.include_router(draft_router)
ai_router.include_router(summarize_router)
ai_router.include_router(tags_router)
ai_router.include_router(search_router)
ai_router.include_router(chat_router)
ai_router.include_router(writing_router)
ai_router.include_router(newsletter_router)