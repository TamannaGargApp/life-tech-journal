# Life & Tech Journal 📰

> **Stories That Inspire. Technology That Empowers.**

A full-stack editorial blogging platform built with Next.js 15, FastAPI, and MongoDB. Features a rich CMS, Google OAuth, JWT authentication, and a beautiful editorial design system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Database | MongoDB (via Beanie ODM) |
| Cache | Redis |
| Auth | JWT + httpOnly cookies + Google OAuth |
| Storage | AWS S3 + CloudFront |
| Email | Resend |

---

## Project Structure

```
life-tech-journal/
├── .env                          ← Root env file (shared)
├── backend/
│   ├── app/
│   │   ├── main.py               ← FastAPI app entry point
│   │   ├── core/
│   │   │   ├── config.py         ← Settings from .env
│   │   │   ├── database.py       ← MongoDB connection
│   │   │   ├── redis.py          ← Redis connection
│   │   │   └── security.py       ← JWT + bcrypt
│   │   ├── models/               ← Beanie ODM models
│   │   ├── schemas/              ← Pydantic request/response schemas
│   │   ├── api/v1/endpoints/     ← Route handlers
│   │   └── middleware/           ← Rate limiting, audit logging
└── frontend/
    ├── src/app/                  ← Next.js App Router pages
    │   ├── page.tsx              ← Homepage
    │   ├── blog/                 ← Blog listing + article pages
    │   ├── admin/                ← CMS dashboard
    │   ├── auth/                 ← Login, register, OAuth callback
    │   ├── profile/              ← User profile
    │   ├── reading-list/         ← Reading history
    │   └── saved/                ← Bookmarked articles
    └── src/components/
        ├── AuthProvider.tsx      ← Global token auto-refresh
        ├── AuthButtons.tsx       ← Sign in / avatar navbar component
        └── ProfilePages.tsx      ← Shared profile layout
```

---

## Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB (local or Atlas)
- Redis (Windows MSI or WSL)

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/yourname/life-tech-journal.git
cd life-tech-journal

# Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Copy and fill in the root `.env`:

```dotenv
# App
ENV=development
SECRET_KEY=your-32-char-random-string

# MongoDB
MONGODB_URI=mongodb://localhost:27017/life_tech_journal
MONGODB_DB=life_tech_journal

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-32-char-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
REFRESH_TOKEN_EXPIRE_DAYS=7

# AWS S3 + CloudFront (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=
AWS_CLOUDFRONT_DOMAIN=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=hello@yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret

# CORS
CORS_ORIGINS=http://localhost:3001,http://localhost:3001
ALLOWED_HOSTS=*

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_ADMIN_UI_PASSWORD=your-admin-ui-password
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-account-password
```

### 3. Configure admin access

Set the admin values in `frontend/.env`. The admin page reads
`NEXT_PUBLIC_ADMIN_UI_PASSWORD`, `NEXT_PUBLIC_ADMIN_EMAIL`, and
`NEXT_PUBLIC_ADMIN_PASSWORD` from that file.

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
uvicorn app.main:app --reload --port 8080

# Terminal 2 — Frontend
cd frontend
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8080 |
| API Docs | http://localhost:8080/api/docs |
| Admin Panel | http://localhost:3001/admin |

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials → OAuth Client ID
3. Application type: **Web application**
4. Authorized redirect URIs: `http://localhost:8080/api/v1/auth/google-callback`
5. Authorized JavaScript origins: `http://localhost:3001`, `http://localhost:8080`
6. Copy Client ID and Secret to `.env`
7. Add test users under OAuth consent screen

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Sign in, returns JWT |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/auth/me` | Get current user |
| DELETE | `/api/v1/auth/me` | Delete account |
| GET | `/api/v1/auth/google-redirect` | Start Google OAuth |
| GET | `/api/v1/auth/google-callback` | Google OAuth callback |

### Articles
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/articles` | List published articles |
| GET | `/api/v1/articles/{slug}` | Get article by slug |
| POST | `/api/v1/articles` | Create article (author+) |
| PUT | `/api/v1/articles/{id}` | Update article |
| DELETE | `/api/v1/articles/{id}` | Delete article (admin) |
| POST | `/api/v1/articles/{id}/like` | Toggle like |
| POST | `/api/v1/articles/{id}/bookmark` | Toggle bookmark |
| GET | `/api/v1/articles/{id}/related` | Related articles |
| GET | `/api/v1/articles/featured` | Featured articles |

Full docs at `http://localhost:8080/api/docs`

---

## Categories

**Life:** Personal Growth · Career · Lifestyle · Relationships · Productivity · Travel · Motivation

**Technology:** AI & ML · Programming · Web Development · Digital Marketing · Cybersecurity · Cloud Computing · Data Science

---

## Roles

| Role | Permissions |
|---|---|
| `reader` | Read articles, like, save, comment |
| `author` | + Create and edit own articles |
| `admin` | + Delete any article, access admin panel |

---

## Deployment

### Environment changes for production:

```dotenv
ENV=production
SECRET_KEY=<strong-random-32-chars>
JWT_SECRET=<strong-random-32-chars>
CORS_ORIGINS=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### Recommended stack:
- **Frontend**: Vercel
- **Backend**: Railway / Render / EC2
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud / Upstash

---

## License

MIT © 2025 Life & Tech Journal
