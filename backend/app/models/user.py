from datetime import datetime
from typing import Optional
from enum import Enum
from beanie import Document, Indexed
from pydantic import EmailStr, Field


class UserRole(str, Enum):
    reader = "reader"
    author = "author"
    admin  = "admin"


class AuthProvider(str, Enum):
    email  = "email"
    google = "google"


class User(Document):
    name:          str
    email:         Indexed(EmailStr, unique=True)
    password_hash: Optional[str] = None
    avatar:        Optional[str] = None
    bio:           Optional[str] = Field(None, max_length=300)
    role:          UserRole = UserRole.reader
    provider:      AuthProvider = AuthProvider.email
    google_id:     Optional[str] = None
    is_verified:   bool = False
    verify_token:  Optional[str] = None
    reset_token:   Optional[str] = None
    reset_expires: Optional[datetime] = None
    newsletter:    bool = True
    dark_mode:     bool = False
    twitter:       Optional[str] = None
    linkedin:      Optional[str] = None
    website:       Optional[str] = None
    created_at:    datetime = Field(default_factory=datetime.utcnow)
    updated_at:    datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        indexes = ["email", "google_id", "role"]
