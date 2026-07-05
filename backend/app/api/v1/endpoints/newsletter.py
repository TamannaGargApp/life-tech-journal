import secrets
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import csv, io
from app.models.other import NewsletterSubscriber
from app.schemas.schemas import SubscribeRequest
from app.api.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


@router.post("/subscribe")
async def subscribe(body: SubscribeRequest):
    existing = await NewsletterSubscriber.find_one(NewsletterSubscriber.email == body.email)
    if existing:
        if existing.is_active:
            return {"message": "Already subscribed"}
        existing.is_active = True
        await existing.save()
        return {"message": "Resubscribed"}
    await NewsletterSubscriber(email=body.email, name=body.name, unsub_token=secrets.token_urlsafe(24)).insert()
    return {"message": "Subscribed successfully"}


@router.post("/unsubscribe/{token}")
async def unsubscribe(token: str):
    sub = await NewsletterSubscriber.find_one(NewsletterSubscriber.unsub_token == token)
    if not sub:
        raise HTTPException(status_code=404, detail="Invalid unsubscribe link")
    sub.is_active = False
    await sub.save()
    return {"message": "Unsubscribed"}


@router.get("/subscribers")
async def list_subscribers(page: int = 1, size: int = 50, admin: User = Depends(require_admin)):
    total = await NewsletterSubscriber.find(NewsletterSubscriber.is_active == True).count()
    subs  = await NewsletterSubscriber.find(NewsletterSubscriber.is_active == True).sort(-NewsletterSubscriber.subscribed_at).skip((page - 1) * size).limit(size).to_list()
    return {"items": [{"email": s.email, "name": s.name, "subscribed_at": s.subscribed_at} for s in subs], "total": total}


@router.get("/export")
async def export_subscribers(admin: User = Depends(require_admin)):
    subs   = await NewsletterSubscriber.find(NewsletterSubscriber.is_active == True).to_list()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["email", "name", "subscribed_at"])
    for s in subs:
        writer.writerow([s.email, s.name or "", s.subscribed_at.isoformat()])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=subscribers.csv"})
