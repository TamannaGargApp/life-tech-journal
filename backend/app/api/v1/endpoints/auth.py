"""
Authentication endpoints — email + Google OAuth
"""
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, Response, status, Cookie
from fastapi.responses import RedirectResponse
from app.schemas.schemas import (
    RegisterRequest, LoginRequest, TokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest,
    GoogleAuthRequest, UserPublic,
)
from app.models.user import User, UserRole, AuthProvider
from app.core.security import hash_password, verify_password, create_token, decode_token
from app.core.config import settings
from app.api.deps import get_current_user
from fastapi import Depends

router = APIRouter(prefix="/auth", tags=["Auth"])

FRONTEND_URL = "http://localhost:3001"


# ── Register ──────────────────────────────────────────────────────────────────
@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    existing = await User.find_one(User.email == body.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    verify_token = secrets.token_urlsafe(32)
    user = User(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
        verify_token=verify_token,
        # Auto-verify in development so users can login immediately
        is_verified=True,
    )
    await user.insert()
    return {"message": "Account created successfully. You can now sign in."}


# ── Email Login ───────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, response: Response):
    user = await User.find_one(User.email == body.email)
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first")

    access  = create_token(str(user.id), "access")
    refresh = create_token(str(user.id), "refresh")
    response.set_cookie(
        key="refresh_token", value=refresh,
        httponly=True, secure=False,   # False for localhost dev
        samesite="lax",
        max_age=7 * 24 * 3600,
    )
    return TokenResponse(access_token=access)


# ── Google OAuth — redirect flow ──────────────────────────────────────────────
@router.get("/google-redirect")
async def google_redirect():
    """Redirect browser to Google's OAuth consent screen."""
    from urllib.parse import urlencode
    params = {
        "client_id":     settings.GOOGLE_CLIENT_ID,
        "redirect_uri":  f"http://localhost:8080/api/v1/auth/google-callback",
        "response_type": "code",
        "scope":         "openid email profile",
        "access_type":   "offline",
    }
    google_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=google_url)


@router.get("/google-callback")
async def google_callback(code: str, response: Response):
    """Exchange code for tokens, create/update user, redirect to frontend."""
    import httpx

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code":          code,
                "client_id":     settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri":  f"http://localhost:8080/api/v1/auth/google-callback",
                "grant_type":    "authorization_code",
            },
        )
        if token_res.status_code != 200:
            return RedirectResponse(f"{FRONTEND_URL}/auth/login?error=google_failed")

        tokens    = token_res.json()
        id_token  = tokens.get("id_token")

        # Verify ID token and get user info
        info_res = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        )
        if info_res.status_code != 200:
            return RedirectResponse(f"{FRONTEND_URL}/auth/login?error=google_failed")

        info = info_res.json()

    email    = info.get("email")
    name     = info.get("name", email)
    picture  = info.get("picture")
    google_id = info.get("sub")

    # Find or create user
    user = await User.find_one(User.google_id == google_id)
    if not user:
        user = await User.find_one(User.email == email)
        if user:
            user.google_id = google_id
            user.provider  = AuthProvider.google
            user.is_verified = True
        else:
            user = User(
                name=name, email=email, avatar=picture,
                google_id=google_id, provider=AuthProvider.google,
                is_verified=True,
            )
        await user.save()

    access  = create_token(str(user.id), "access")
    refresh = create_token(str(user.id), "refresh")

    # Redirect to frontend with token in URL fragment (or set cookie)
    redirect = RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?token={access}")
    redirect.set_cookie(key="refresh_token", value=refresh, httponly=True, secure=False, samesite="lax", max_age=7*24*3600)
    return redirect


# ── Google OAuth — token-based (for SPA use) ──────────────────────────────────
@router.post("/google", response_model=TokenResponse)
async def google_auth_token(body: GoogleAuthRequest, response: Response):
    """Accept Google ID token from frontend (alternative to redirect flow)."""
    import httpx
    async with httpx.AsyncClient() as client:
        r = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={body.id_token}")
        if r.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        info = r.json()

    user = await User.find_one(User.google_id == info["sub"])
    if not user:
        user = await User.find_one(User.email == info["email"])
        if user:
            user.google_id = info["sub"]
        else:
            user = User(name=info.get("name",""), email=info["email"], avatar=info.get("picture"), google_id=info["sub"], provider=AuthProvider.google, is_verified=True)
        await user.save()

    access  = create_token(str(user.id), "access")
    refresh = create_token(str(user.id), "refresh")
    response.set_cookie(key="refresh_token", value=refresh, httponly=True, secure=False, samesite="lax", max_age=7*24*3600)
    return TokenResponse(access_token=access)

#------------------ Delete Account ─────────────────────────────────────────────
@router.delete("/me", status_code=204)
async def delete_account(user: User = Depends(get_current_user)):
    await user.delete()
    return None

# ── Refresh ───────────────────────────────────────────────────────────────────
@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: Optional[str] = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")
    payload = decode_token(refresh_token, expected_type="refresh")
    user = await User.get(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return TokenResponse(access_token=create_token(str(user.id), "access"))


# ── Logout ────────────────────────────────────────────────────────────────────
@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


# ── Verify Email ──────────────────────────────────────────────────────────────
@router.get("/verify-email/{token}")
async def verify_email(token: str):
    user = await User.find_one(User.verify_token == token)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired link")
    user.is_verified = True
    user.verify_token = None
    await user.save()
    return {"message": "Email verified. You can now sign in."}


# ── Forgot Password ───────────────────────────────────────────────────────────
@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    user = await User.find_one(User.email == body.email)
    if user and user.provider == AuthProvider.email:
        token = secrets.token_urlsafe(32)
        user.reset_token   = token
        user.reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        await user.save()
    return {"message": "If an account exists, a reset link has been sent."}


# ── Reset Password ────────────────────────────────────────────────────────────
@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest):
    user = await User.find_one(User.reset_token == body.token)
    if not user or not user.reset_expires or datetime.now(timezone.utc) > user.reset_expires:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    user.password_hash = hash_password(body.password)
    user.reset_token   = None
    user.reset_expires = None
    await user.save()
    return {"message": "Password reset successfully"}


# ── Me ────────────────────────────────────────────────────────────────────────
@router.get("/me", response_model=UserPublic)
async def get_me(user: User = Depends(get_current_user)):
    return UserPublic(
        id=str(user.id), name=user.name, email=user.email,
        avatar=user.avatar, bio=user.bio, role=user.role.value,
        is_verified=user.is_verified, created_at=user.created_at,
    )