from fastapi import APIRouter
from app.api.v1.endpoints.auth       import router as auth_router
from app.api.v1.endpoints.articles   import router as articles_router
from app.api.v1.endpoints.search     import router as search_router
from app.api.v1.endpoints.comments   import router as comments_router
from app.api.v1.endpoints.newsletter import router as newsletter_router
from app.api.v1.endpoints.media      import router as media_router
from app.api.v1.endpoints.ai.router  import ai_router


api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(articles_router)
api_router.include_router(search_router)
api_router.include_router(comments_router)
api_router.include_router(newsletter_router)
api_router.include_router(media_router)
api_router.include_router(ai_router)