from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page:  int
    size:  int
    pages: int


class RegisterRequest(BaseModel):
    name:     str = Field(..., min_length=2, max_length=80)
    email:    EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain an uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain a digit")
        return v


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token:    str
    password: str = Field(..., min_length=8)


class GoogleAuthRequest(BaseModel):
    id_token: str


class UserPublic(BaseModel):
    id:          str
    name:        str
    email:       EmailStr
    avatar:      Optional[str] = None
    bio:         Optional[str] = None
    role:        str
    is_verified: bool
    created_at:  datetime


class UpdateProfileRequest(BaseModel):
    name:    Optional[str] = Field(None, min_length=2, max_length=80)
    bio:     Optional[str] = Field(None, max_length=300)
    twitter: Optional[str] = None
    linkedin:Optional[str] = None
    website: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password:     str = Field(..., min_length=8)


class CreateArticleRequest(BaseModel):
    title:          str = Field(..., max_length=200)
    slug:           Optional[str] = None
    excerpt:        str = Field(..., max_length=400)
    content:        str
    featured_image: Optional[str] = None
    category_id:    str
    tag_ids:        List[str] = []
    status:         str = "draft"
    scheduled_at:   Optional[datetime] = None
    featured:       bool = False
    editors_pick:   bool = False
    meta_title:       Optional[str] = None
    meta_description: Optional[str] = None
    keywords:         List[str] = []


class UpdateArticleRequest(BaseModel):
    title:          Optional[str] = None
    excerpt:        Optional[str] = None
    content:        Optional[str] = None
    featured_image: Optional[str] = None
    category_id:    Optional[str] = None
    tag_ids:        Optional[List[str]] = None
    status:         Optional[str] = None
    scheduled_at:   Optional[datetime] = None
    featured:       Optional[bool] = None
    editors_pick:   Optional[bool] = None
    meta_title:       Optional[str] = None
    meta_description: Optional[str] = None
    keywords:         Optional[List[str]] = None


class CreateCommentRequest(BaseModel):
    article_id: str
    content:    str = Field(..., min_length=1, max_length=2000)
    parent_id:  Optional[str] = None


class UpdateCommentRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class PresignRequest(BaseModel):
    filename:     str
    content_type: str
    folder:       str = "uploads"


class PresignResponse(BaseModel):
    upload_url: str
    public_url: str
    s3_key:     str
    expires_in: int


class SubscribeRequest(BaseModel):
    email: EmailStr
    name:  Optional[str] = None
