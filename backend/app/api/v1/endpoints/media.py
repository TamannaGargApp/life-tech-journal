import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.schemas import PresignRequest, PresignResponse
from app.models.other import MediaFile
from app.models.user import User
from app.api.deps import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/media", tags=["Media"])
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/svg+xml"}


def _get_s3():
    import boto3
    return boto3.client("s3", region_name=settings.AWS_REGION, aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)


@router.post("/presign", response_model=PresignResponse)
async def get_presign_url(body: PresignRequest, user: User = Depends(get_current_user)):
    if body.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    ext    = body.filename.rsplit(".", 1)[-1] if "." in body.filename else "jpg"
    s3_key = f"{body.folder}/{str(user.id)}/{uuid.uuid4()}.{ext}"
    url    = _get_s3().generate_presigned_url("put_object", Params={"Bucket": settings.AWS_S3_BUCKET, "Key": s3_key, "ContentType": body.content_type}, ExpiresIn=settings.AWS_PRESIGN_EXPIRY)
    return PresignResponse(upload_url=url, public_url=f"https://{settings.AWS_CLOUDFRONT_DOMAIN}/{s3_key}", s3_key=s3_key, expires_in=settings.AWS_PRESIGN_EXPIRY)


@router.post("", status_code=201)
async def save_media(s3_key: str, filename: str, mime_type: str, size_bytes: int, user: User = Depends(get_current_user)):
    media = MediaFile(uploaded_by=str(user.id), filename=filename, s3_key=s3_key, public_url=f"https://{settings.AWS_CLOUDFRONT_DOMAIN}/{s3_key}", mime_type=mime_type, size_bytes=size_bytes)
    await media.insert()
    return {"id": str(media.id), "url": media.public_url}


@router.get("")
async def list_media(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), user: User = Depends(get_current_user)):
    total = await MediaFile.find(MediaFile.uploaded_by == str(user.id)).count()
    files = await MediaFile.find(MediaFile.uploaded_by == str(user.id)).sort(-MediaFile.created_at).skip((page - 1) * size).limit(size).to_list()
    return {"items": [{"id": str(f.id), "filename": f.filename, "url": f.public_url, "size_bytes": f.size_bytes, "created_at": f.created_at} for f in files], "total": total}


@router.delete("/{media_id}", status_code=204)
async def delete_media(media_id: str, user: User = Depends(get_current_user)):
    media = await MediaFile.get(media_id)
    if not media or media.uploaded_by != str(user.id):
        raise HTTPException(status_code=404, detail="Not found")
    _get_s3().delete_object(Bucket=settings.AWS_S3_BUCKET, Key=media.s3_key)
    await media.delete()
