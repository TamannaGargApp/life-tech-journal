# Life & Tech Journal — Complete End-to-End Guide

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [How It All Works Together](#2-how-it-all-works-together)
3. [Frontend Deep Dive](#3-frontend-deep-dive)
4. [Backend Deep Dive](#4-backend-deep-dive)
5. [Database & Cache](#5-database--cache)
6. [Authentication Flow](#6-authentication-flow)
7. [AI Features](#7-ai-features)
8. [Docker Setup](#8-docker-setup)
9. [Deployment — Free & Minimum Cost](#9-deployment--free--minimum-cost)
10. [Environment Variables Reference](#10-environment-variables-reference)

---

## 1. Project Overview

Life & Tech Journal is a **full-stack blogging platform** with:

- Editorial blog with categories, search, reading progress
- Full CMS admin panel for writing and managing articles
- JWT + Google OAuth authentication
- AI writing tools powered by local Ollama models (free, no API cost)
- Semantic search using vector embeddings
- RAG-based chatbot over all published articles

### Tech Stack Summary

```
User Browser
    │
    ▼
Next.js 15 (Frontend) ──────── port 3001
    │  TypeScript, React, Tailwind
    │
    ▼ HTTP/REST
FastAPI (Backend) ──────────── port 8080
    │  Python 3.11, Uvicorn
    │
    ├──▶ MongoDB ─────────────── port 27017  (articles, users, comments)
    ├──▶ Redis ───────────────── port 6379   (caching, rate limiting)
    ├──▶ Ollama ──────────────── port 11434  (local AI models)
    └──▶ AWS S3 ──────────────── (image storage, optional)
```

---

## 2. How It All Works Together

### Request Lifecycle

```
1. User opens localhost:3001
2. Next.js serves the React page
3. Page fetches data from FastAPI at localhost:8080/api/v1
4. FastAPI checks Redis cache → if hit, returns cached data
5. If cache miss → queries MongoDB → caches result → returns data
6. Page renders with data
```

### Article Publishing Flow

```
Admin writes article in CMS
    │
    ▼
POST /api/v1/articles (with JWT token)
    │
    ├── FastAPI validates token
    ├── Saves to MongoDB
    ├── Clears Redis cache for articles list
    └── (Optional) Generates embedding → stores in article_embeddings collection
```

### AI Flow

```
Admin clicks "✨ AI Generate"
    │
    ▼
POST /api/v1/ai/excerpt
    │
    ├── Check Redis cache (if same content was processed before → return instantly)
    │
    ├── Cache miss → send prompt to Ollama at localhost:11434
    │               Model: llama3.2 or mistral
    │
    ├── Ollama generates JSON response
    ├── Backend cleans/parses the JSON
    ├── Stores in Redis cache (1 hour TTL)
    └── Returns excerpt + meta_title + meta_description + keywords
```

---

## 3. Frontend Deep Dive

### Folder Structure

```
frontend/src/
├── app/                    Next.js App Router (each folder = a page)
│   ├── layout.tsx          Root layout — wraps ALL pages with AuthProvider
│   ├── page.tsx            Homepage (/)
│   ├── blog/
│   │   ├── page.tsx        Blog listing (/blog)
│   │   └── [slug]/
│   │       └── page.tsx    Article page (/blog/article-slug)
│   ├── admin/
│   │   └── page.tsx        CMS dashboard (/admin)
│   ├── auth/
│   │   ├── login/page.tsx  Sign in + Register (/auth/login)
│   │   └── callback/page.tsx  Google OAuth callback
│   ├── profile/page.tsx    My Profile (/profile)
│   ├── reading-list/page.tsx  Reading history
│   └── saved/page.tsx      Bookmarked articles
│
└── components/
    ├── AuthProvider.tsx     Wraps app — runs JWT auto-refresh every 14 min
    ├── AuthButtons.tsx      Sign In / Avatar dropdown navbar component
    ├── ProfilePages.tsx     Shared layout for profile/reading/saved pages
    └── ai/
        ├── AISummarizer.tsx         "Read in 30s" button on article pages
        ├── AIExcerptGenerator.tsx   Generate excerpt + SEO meta in admin
        ├── AIDraftGenerator.tsx     Topic → full article draft in admin
        ├── AITagSuggester.tsx       Auto-classify category + keywords
        ├── AIWritingAssistant.tsx   Continue/Improve/Shorten content
        ├── AIChatWidget.tsx         Floating RAG chatbot on all pages
        └── AINewsletterCurator.tsx  Weekly newsletter AI curator in admin
```

### Key Concepts

**App Router** — each `page.tsx` file becomes a route automatically. `[slug]` means dynamic route.

**`"use client"`** — components with this directive run in the browser. Without it, they run on the server (can't use useState, useEffect, localStorage).

**`AuthProvider`** — wraps everything in `layout.tsx`. Uses `useAuth` hook which calls `POST /auth/refresh` every 14 minutes to keep the JWT token fresh.

**`sessionStorage`** — JWT access token is stored here. It's cleared when browser tab closes. More secure than localStorage.

### How Pages Fetch Data

```tsx
// Example: blog page fetching articles
useEffect(() => {
  fetch(`${API}/articles?page=1&size=8&sort=latest`)
    .then(r => r.json())
    .then(data => setArticles(data.items))
}, []);

// Authenticated request (requires JWT)
fetch(`${API}/articles`, {
  headers: { "Authorization": `Bearer ${sessionStorage.getItem("access_token")}` }
})
```

---

## 4. Backend Deep Dive

### Folder Structure

```
backend/app/
├── main.py                 FastAPI app entry — registers middleware, lifespan
├── core/
│   ├── config.py           Reads .env → Settings object (used everywhere)
│   ├── database.py         MongoDB connection using Beanie ODM
│   ├── redis.py            Redis connection + cache helpers
│   └── security.py         bcrypt password hashing + JWT creation/verification
├── models/
│   ├── user.py             User document (email, password_hash, role, provider)
│   ├── article.py          Article document (title, content, slug, status...)
│   └── other.py            Bookmark, Comment, Newsletter, etc.
├── schemas/
│   └── schemas.py          Pydantic request/response validation schemas
├── api/v1/
│   ├── router.py           Mounts all endpoint routers
│   └── endpoints/
│       ├── auth.py         /auth/register, /auth/login, /auth/me, Google OAuth
│       ├── articles.py     /articles CRUD, like, bookmark, related
│       ├── ai/
│       │   ├── router.py   Mounts all AI routes at /ai/*
│       │   ├── ollama.py   Ollama HTTP client (generate, embed, stream)
│       │   ├── excerpt.py  POST /ai/excerpt
│       │   ├── draft.py    POST /ai/draft (streaming)
│       │   ├── summarize.py POST /ai/summarize
│       │   ├── tags.py     POST /ai/tags
│       │   ├── search.py   POST /ai/search (semantic)
│       │   ├── chat.py     POST /ai/chat (RAG streaming)
│       │   ├── writing.py  POST /ai/writing-assist (streaming)
│       │   └── newsletter.py POST /ai/newsletter
│       └── ...
├── services/
│   ├── ai_cache.py         Redis caching for AI responses
│   └── vector_store.py     MongoDB vector similarity search
└── middleware/
    ├── rate_limit.py       Redis-based rate limiting per IP
    └── audit.py            Request logging middleware
```

### Request → Response Flow

```
HTTP Request arrives
    │
    ▼
AuditMiddleware (logs request)
    │
    ▼
RateLimitMiddleware (checks Redis — max requests per IP)
    │
    ▼
CORSMiddleware (allows frontend origin)
    │
    ▼
FastAPI Router → finds matching endpoint function
    │
    ▼
Dependencies run (e.g. get_current_user reads JWT from Authorization header)
    │
    ▼
Endpoint function runs (queries DB, calls Redis, calls Ollama...)
    │
    ▼
Pydantic validates response shape
    │
    ▼
HTTP Response sent back
```

### Beanie ODM

Beanie is an async MongoDB ODM. Models are Python classes:

```python
class Article(Document):
    title: str
    slug: str
    content: str
    status: ArticleStatus = ArticleStatus.draft

    class Settings:
        name = "articles"  # MongoDB collection name

# Usage
article = await Article.find_one(Article.slug == "my-article")
await article.save()
```

### JWT Authentication

```
Login request → backend verifies password with bcrypt
    │
    ▼
create_token(user_id, "access") → JWT signed with JWT_SECRET
    │
    ▼
Token returned to frontend → stored in sessionStorage
    │
    ▼
Next request → frontend sends "Authorization: Bearer <token>"
    │
    ▼
get_current_user() dependency → decode_token() → loads user from DB
```

---

## 5. Database & Cache

### MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | User accounts, roles, auth provider |
| `articles` | All blog articles |
| `bookmarks` | User → Article saves |
| `comments` | Article comments |
| `newsletter_subscribers` | Email subscribers |
| `article_embeddings` | Vector embeddings for semantic search |
| `media_files` | Uploaded file metadata |

### Redis Keys

| Key Pattern | What it stores | TTL |
|---|---|---|
| `articles:list:*` | Paginated article lists | 2 min |
| `articles:slug:*` | Individual article data | 5 min |
| `articles:featured` | Featured/trending articles | 5 min |
| `ai:excerpt:*` | AI-generated excerpts | 1 hour |
| `ai:summarize:*` | Article summaries | 1 hour |
| `ai:tags:*` | Tag suggestions | 1 hour |
| `rate:*` | Rate limit counters per IP | 1 min |

### Why Redis?

Without Redis, every article page load hits MongoDB. With Redis:
- First visitor to `/blog/my-article` → MongoDB query (50ms) → cached
- Next 100 visitors → Redis (1ms) → 50x faster

---

## 6. Authentication Flow

### Email Registration

```
User fills form → POST /auth/register
    │
    ├── Validate email not taken
    ├── bcrypt hash password (truncated to 72 bytes)
    ├── Create User document in MongoDB (role: "reader", is_verified: true)
    └── Return success message

User signs in → POST /auth/login
    │
    ├── Find user by email
    ├── bcrypt verify password
    ├── create_token(user_id, "access") → 7 day JWT
    ├── create_token(user_id, "refresh") → 7 day refresh JWT (httpOnly cookie)
    └── Return { access_token }

Frontend stores access_token in sessionStorage
AuthProvider refreshes it every 14 minutes via POST /auth/refresh
```

### Google OAuth Flow

```
User clicks "Continue with Google"
    │
    ▼
Frontend → GET /api/v1/auth/google-redirect
    │
    ▼
Backend redirects to Google consent screen
    │
    ▼
User approves → Google redirects to:
    http://localhost:8080/api/v1/auth/google-callback?code=xxx
    │
    ▼
Backend exchanges code for Google user info
    │
    ├── Find or create User in MongoDB
    ├── Create JWT access token
    └── Redirect to: http://localhost:3001/auth/callback?token=xxx

Frontend /auth/callback page:
    ├── Reads token from URL
    ├── Stores in sessionStorage
    └── Redirects to home
```

### Role System

| Role | Can do |
|---|---|
| `reader` | Read, like, save, comment |
| `author` | + Create/edit own articles, access admin |
| `admin` | + Delete any article, full admin access |

---

## 7. AI Features

### How Ollama Works

Ollama runs as a local HTTP server on port 11434. Your backend calls it like any REST API:

```python
# Generate text
POST http://localhost:11434/api/generate
{ "model": "llama3.2", "prompt": "Write about AI...", "stream": false }

# Generate embeddings
POST http://localhost:11434/api/embeddings
{ "model": "nomic-embed-text", "prompt": "article content here" }
```

No API key needed. Completely free. Runs on your CPU/GPU.

### Models Used

| Model | Size | Used for |
|---|---|---|
| `llama3.2` (3B) | ~2GB | Fast tasks: excerpt, tags, summarize |
| `mistral` (7B) | ~4GB | Quality tasks: draft, writing assist, chat |
| `nomic-embed-text` | ~274MB | Semantic search embeddings |

### Semantic Search Pipeline

```
Article published
    │
    ▼
POST /ai/embed-article
    │
    ▼
Ollama nomic-embed-text converts article text → 768-dim vector
    │
    ▼
Vector stored in MongoDB article_embeddings collection

User searches "python productivity tips"
    │
    ▼
POST /ai/search { query: "python productivity tips" }
    │
    ▼
nomic-embed-text converts query → 768-dim vector
    │
    ▼
Cosine similarity computed against all stored vectors
    │
    ▼
Top 5 most similar articles returned
```

### RAG Chatbot Pipeline

```
User asks "What should I read about career growth?"
    │
    ▼
Embed query → find top 4 similar articles
    │
    ▼
Build prompt:
  "Here are relevant articles: [article 1 content], [article 2 content]...
   Answer the user's question using these articles."
    │
    ▼
Send to Mistral → stream response tokens back to frontend
    │
    ▼
Frontend renders tokens as they arrive (SSE streaming)
```

---

## 8. Docker Setup

### File Structure

```
life-tech-journal/
├── docker-compose.yml          ← orchestrates all services
├── docker-compose.prod.yml     ← production overrides
├── backend/
│   └── Dockerfile
└── frontend/
    └── Dockerfile
```

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3001
CMD ["node", "server.js"]
```

Add to `frontend/next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // required for Docker
}
module.exports = nextConfig
```

### docker-compose.yml (Development)

Create at project root:

```yaml
version: '3.9'

services:

  mongodb:
    image: mongo:7
    container_name: ltj-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: life_tech_journal

  redis:
    image: redis:7-alpine
    container_name: ltj-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --save 60 1 --loglevel warning
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ltj-backend
    restart: unless-stopped
    ports:
      - "8080:8080"
    env_file:
      - .env
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/life_tech_journal
      - REDIS_URL=redis://redis:6379
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./backend:/app  # hot reload in dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ltj-frontend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
    depends_on:
      - backend

volumes:
  mongodb_data:
  redis_data:
```

### Running with Docker

```bash
# Development — start MongoDB + Redis only (run backend/frontend locally)
docker-compose up mongodb redis -d

# Full stack in Docker
docker-compose up --build -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop everything
docker-compose down

# Stop and delete all data (fresh start)
docker-compose down -v
```

### Important Note on Ollama + Docker

Ollama runs on your HOST machine, not inside Docker. The backend container accesses it via `host.docker.internal:11434` (Windows/Mac) or `172.17.0.1:11434` (Linux).

```yaml
# In docker-compose.yml backend environment:
OLLAMA_BASE_URL=http://host.docker.internal:11434  # Windows/Mac
# OR
OLLAMA_BASE_URL=http://172.17.0.1:11434            # Linux
```

---

## 9. Deployment — Free & Minimum Cost

### Option A — Completely Free (Recommended to Start)

```
Frontend  → Vercel        (free tier, auto-deploys from GitHub)
Backend   → Render        (free tier, 512MB RAM, sleeps after 15min inactivity)
Database  → MongoDB Atlas  (free 512MB M0 cluster)
Cache     → Upstash Redis  (free 10,000 commands/day)
AI        → NOT available  (Ollama needs local machine — use HuggingFace API instead for prod)
Images    → Cloudinary     (free 25GB storage)
```

**Cost: $0/month**

**Limitation:** Backend sleeps on Render free tier (first request after sleep takes ~30 seconds to wake up).

---

### Option B — Minimum Cost (~$5-7/month)

```
Frontend  → Vercel        (free)
Backend   → Render $7/mo  (always-on, no sleep)
Database  → MongoDB Atlas  (free M0)
Cache     → Upstash Redis  (free)
AI        → Ollama on VPS OR HuggingFace free API
Images    → AWS S3         (~$0.02/GB)
```

**Cost: ~$7/month**

---

### Step-by-Step Free Deployment

#### Step 1 — MongoDB Atlas (Free Database)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create account → New Project → Build a Database
3. Choose **M0 Free** → AWS → Mumbai (ap-south-1)
4. Create user: `ltj-user` / strong password
5. Network Access → Add IP → **Allow from anywhere** (0.0.0.0/0)
6. Click Connect → Drivers → copy connection string:
   ```
   mongodb+srv://ltj-user:<password>@cluster0.xxxxx.mongodb.net/life_tech_journal
   ```

#### Step 2 — Upstash Redis (Free Cache)

1. Go to [upstash.com](https://upstash.com)
2. Create account → Create Database
3. Name: `ltj-redis` → Region: `ap-southeast-1`
4. Copy the **Redis URL** (starts with `rediss://`)

#### Step 3 — Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect GitHub repo
4. Settings:
   ```
   Name:          ltj-backend
   Root Directory: backend
   Runtime:       Python 3.11
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
5. Add Environment Variables (copy from your .env):
   ```
   MONGODB_URI=mongodb+srv://...  (Atlas URI)
   MONGODB_DB=life_tech_journal
   REDIS_URL=rediss://...         (Upstash URL)
   JWT_SECRET=your-32-char-secret
   SECRET_KEY=your-32-char-secret
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   CORS_ORIGINS=https://your-app.vercel.app
   FRONTEND_URL=https://your-app.vercel.app
   ENV=production
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   ```
6. Click Deploy

Your backend will be at: `https://ltj-backend.onrender.com`

#### Step 4 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Settings:
   ```
   Root Directory: frontend
   Framework:     Next.js
   ```
4. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://ltj-backend.onrender.com/api/v1
   NEXT_PUBLIC_ADMIN_UI_PASSWORD=your-secure-password
   NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
   NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
   ```
5. Click Deploy

Your site will be at: `https://ltj-frontend.vercel.app`

#### Step 5 — Update Google OAuth for Production

In Google Cloud Console → Credentials → OAuth Client:
- Add Authorized redirect URI: `https://ltj-backend.onrender.com/api/v1/auth/google-callback`
- Add Authorized JavaScript origins: `https://ltj-frontend.vercel.app`

#### Step 6 — Create Admin User in Production

```bash
# Using Render's shell (Dashboard → your service → Shell tab)
Set the admin email and password in `frontend/.env`
```

---

### AI in Production (Free Options)

Since Ollama runs locally, you need a different AI solution for production:

#### Option 1 — HuggingFace Inference API (Free)

```python
# In your AI endpoints, replace Ollama calls with HF API
import httpx

HF_TOKEN = settings.HF_API_TOKEN  # free at huggingface.co

async def hf_generate(prompt: str) -> str:
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            headers={"Authorization": f"Bearer {HF_TOKEN}"},
            json={"inputs": prompt, "parameters": {"max_new_tokens": 500}},
            timeout=60.0,
        )
        return res.json()[0]["generated_text"]
```

**Free tier:** 1000 requests/day per model

#### Option 2 — Groq (Free, Very Fast)

```python
# Groq gives free access to Llama3, Mistral etc with very fast inference
# Sign up at console.groq.com — free 14,400 requests/day

async def groq_generate(prompt: str) -> str:
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
            json={
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1000,
            },
            timeout=30.0,
        )
        return res.json()["choices"][0]["message"]["content"]
```

**Free tier:** 14,400 requests/day — more than enough for a blog

#### Option 3 — Keep Ollama (VPS)

Rent a cheap VPS with 8GB RAM:
- **Oracle Cloud Free Tier** — 4 ARM cores, 24GB RAM, completely free forever
- **Hetzner CX22** — €4/month, 4GB RAM (enough for llama3.2)

Run Ollama on the VPS and point `OLLAMA_BASE_URL` to it.

---

### Custom Domain (Free)

1. Buy domain on [Namecheap](https://namecheap.com) (~$10/year for .com)
2. In Vercel: Settings → Domains → Add `yourdomain.com`
3. Add Vercel's DNS records to Namecheap
4. In Render: Settings → Custom Domain → Add `api.yourdomain.com`
5. SSL is automatic on both platforms

Final URLs:
```
https://yourdomain.com          → Vercel (frontend)
https://api.yourdomain.com      → Render (backend)
```

---

### Production Checklist

Before going live:

```
Security:
[ ] Change SECRET_KEY to random 32+ chars
[ ] Change JWT_SECRET to random 32+ chars  
[ ] Set NEXT_PUBLIC_ADMIN_UI_PASSWORD in frontend/.env
[ ] Set ENV=production in backend
[ ] Set CORS_ORIGINS to your actual domain only

Database:
[ ] Use MongoDB Atlas (not local MongoDB)
[ ] Enable MongoDB Atlas backups

Performance:
[ ] Enable Vercel Analytics (free)
[ ] Set proper Redis TTLs
[ ] Add sitemap.xml for SEO

SEO:
[ ] Add Google Search Console
[ ] Submit sitemap
[ ] Set proper meta tags on all pages
```

---

## 10. Environment Variables Reference

### Root `.env` (Backend reads these)

```dotenv
# App
ENV=development                          # or production
SECRET_KEY=32-char-random-string         # app encryption key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/life_tech_journal
MONGODB_DB=life_tech_journal

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=                          # leave empty for local Redis

# JWT
JWT_SECRET=32-char-jwt-secret            # MUST be 32+ chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080        # 7 days
REFRESH_TOKEN_EXPIRE_DAYS=7

# AWS S3 (optional — for image uploads)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=
AWS_CLOUDFRONT_DOMAIN=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=hello@yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
FRONTEND_URL=http://localhost:3001       # where to redirect after OAuth

# CORS
CORS_ORIGINS=http://localhost:3001,http://localhost:3001
ALLOWED_HOSTS=*

# Frontend (Next.js reads NEXT_PUBLIC_* variables)
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_ADMIN_UI_PASSWORD=your-admin-ui-password
NEXT_PUBLIC_ADMIN_EMAIL=admin@lifetechjournal.com
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-account-password

# Ollama AI
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_FAST_MODEL=llama3.2
OLLAMA_EMBED_MODEL=nomic-embed-text
AI_CACHE_TTL=3600

# Production AI alternatives
HF_API_TOKEN=                            # HuggingFace free API token
GROQ_API_KEY=                            # Groq free API key
```

### Quick Reference — Port Map

| Service | Local Port | Docker Port | Purpose |
|---|---|---|---|
| Next.js | 3001 | 3001 | Frontend |
| FastAPI | 8080 | 8080 | Backend API |
| MongoDB | 27017 | 27017 | Database |
| Redis | 6379 | 6379 | Cache |
| Ollama | 11434 | host only | AI models |

### Quick Reference — Common Commands

```powershell
# Start everything locally
cd backend && uvicorn app.main:app --reload --port 8080
cd frontend && npm run dev
ollama serve

# Docker (MongoDB + Redis only)
docker-compose up mongodb redis -d

# Create admin user
Set admin credentials in frontend/.env

# Pull AI models
ollama pull llama3.2
ollama pull mistral
ollama pull nomic-embed-text

# Embed all existing articles for semantic search
curl -X POST http://localhost:8080/api/v1/ai/embed-all

# Check AI status
curl http://localhost:8080/api/v1/ai/status

# Check all API routes
curl http://localhost:8080/api/docs
```

---

*Life & Tech Journal — Built with Next.js 15 + FastAPI + MongoDB + Ollama*
