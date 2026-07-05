from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.other import Comment
from app.models.user import User, UserRole
from app.schemas.schemas import CreateCommentRequest, UpdateCommentRequest
from app.api.deps import get_current_user

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.get("")
async def list_comments(article_id: str = Query(...), page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=50)):
    from app.core.database import get_db
    db    = get_db()
    col   = db["comments"]
    query = {"article_id": article_id, "parent_id": None, "status": "approved"}
    total = await col.count_documents(query)
    docs  = await col.find(query).sort([("created_at", 1)]).skip((page - 1) * size).limit(size).to_list(size)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return {"items": docs, "total": total}


@router.post("", status_code=201)
async def create_comment(body: CreateCommentRequest, user: User = Depends(get_current_user)):
    comment = Comment(article_id=body.article_id, author_id=str(user.id), parent_id=body.parent_id, content=body.content, status="approved")
    await comment.insert()
    return {"id": str(comment.id)}


@router.put("/{comment_id}")
async def update_comment(comment_id: str, body: UpdateCommentRequest, user: User = Depends(get_current_user)):
    comment = await Comment.get(comment_id)
    if not comment or comment.author_id != str(user.id):
        raise HTTPException(status_code=403, detail="Not allowed")
    comment.content = body.content
    comment.is_edited = True
    comment.edited_at = datetime.utcnow()
    await comment.save()
    return {"message": "Updated"}


@router.delete("/{comment_id}", status_code=204)
async def delete_comment(comment_id: str, user: User = Depends(get_current_user)):
    comment = await Comment.get(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Not found")
    if comment.author_id != str(user.id) and user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not allowed")
    await comment.delete()
