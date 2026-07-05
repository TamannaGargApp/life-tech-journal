# Life & Tech Journal — User Guide 📖

Complete guide for readers, writers, and admins.

---

## For Readers

### Creating an Account

1. Click **Sign In** in the top navbar
2. Click **Create Account** tab
3. Fill in your name, email, and password
   - Password must be 8+ characters with at least one uppercase letter and one number
4. Click **Create Account →**
5. You'll automatically be switched to Sign In after 1.5 seconds
6. Sign in with your new credentials

**Or sign in with Google** — click **Continue with Google** for one-click access.

---

### Reading Articles

**Browse articles:**
- Click **Blog** in the navbar to see all articles
- Filter by category using the chips bar (AI & ML, Career, Lifestyle, etc.)
- Sort by Latest, Popular, or Trending
- Search by keyword using the search bar

**On an article page:**
- A **reading progress bar** at the top shows how far you've read
- **Like** an article with the ❤️ button
- **Save** an article with the 📌 button to read later
- **Share** via Twitter/X, LinkedIn, or copy link

---

### Your Profile

After signing in, click your **avatar** (top right) to access:

| Page | What it contains |
|---|---|
| 👤 My Profile | Edit name, bio, website, change password |
| 📖 Reading List | All articles you've read with progress % |
| 🔖 Saved Articles | Articles you bookmarked, remove anytime |

**To edit your profile:**
1. Click avatar → My Profile
2. Update your name, bio, or social links
3. Click **Save Changes**

**To change your password:**
1. My Profile → Change Password section
2. Enter current password and new password
3. Click **Update Password**

**To delete your account:**
1. My Profile → Danger Zone
2. Click **Delete My Account**
3. Type `DELETE MY ACCOUNT` to confirm
4. Your account and all data will be permanently removed

---

### Staying Signed In

Your session lasts **7 days**. The app automatically refreshes your token in the background every 14 minutes while you have any tab open — you won't be logged out unexpectedly.

If you close your browser for more than 7 days, you'll need to sign in again.

---

## For Writers (Author Role)

Authors can create and manage their own articles. Contact an admin to get the `author` role.

### Writing an Article

1. Sign in → click avatar → **Admin Panel** (only visible to authors and admins)
2. Click **✏️ New Article** in the sidebar
3. Fill in the **Content** tab:

**Title** — write a clear, SEO-friendly title (30–60 chars ideal)

**URL Slug** — auto-generated from title, or click **Auto** to regenerate

**Excerpt** — 1–2 sentence summary shown on article cards (80–400 chars)

**Images:**
- **🏔️ Banner tab** — paste an image URL for the hero image at top of article
  - Recommended size: 1200×630px
  - Free images: [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com)
- **📷 In-Content tab** — insert images inside your article body
  - Choose layout: Full Width, With Caption, Half Width, Float Right
  - Images insert at cursor position in the editor

**Content** — write in HTML using the toolbar buttons:
- H2, H3 — headings
- Para — paragraph
- Bold, Italic — text formatting
- Link — hyperlink
- List — bullet list
- Quote — blockquote
- Code — inline code
- Block — code block
- Image — image tag
- HR — horizontal divider

Click **👁 Preview** below the editor to see rendered output.

4. Fill in the **SEO** tab:
   - Meta title (50–60 chars)
   - Meta description (120–158 chars)
   - Keywords (comma separated)
   - Check the SEO checklist — aim for all green

5. Fill in the **Settings** tab:
   - Set status: Draft / Published / Archived
   - Toggle **⭐ Featured** to show on homepage hero
   - Toggle **✏️ Editor's Pick** for highlighted badge

6. Click **🚀 Publish** to go live, or **💾 Draft** to save without publishing

---

### Editing an Article

1. Admin Panel → **📝 Articles**
2. Find your article → click **Edit**
3. Make changes → click **Publish** or **Save Draft**

### Deleting an Article

1. Admin Panel → Articles
2. Click **Del** next to the article
3. Confirm the deletion prompt

---

## For Admins

Admins have full access to the CMS and can manage all articles.

### Accessing the Admin Panel

**Option 1 — Quick Access (no account needed):**
1. Go to `http://localhost:3001/admin`
2. Click **🔑 Quick Access** tab
3. Enter the admin password configured in `frontend/.env`
4. You're in

**Option 2 — Account Login:**
1. Use your registered email and password
2. Must have `admin` or `author` role

---

### Admin Dashboard

The dashboard shows:
- Total articles, views, likes, drafts
- **Recent Articles** — latest 6 articles with status badges
- **Top Performing** — highest viewed articles

---

### Articles Management

Filter articles by: All / Published / Draft / Archived

Sort by: Newest / Most Viewed / A–Z

Each row shows: thumbnail, title, slug, category, status, views, likes, Edit and Delete buttons.

---

### SEO Manager

Overview of all articles' SEO health:
- **SEO Score** — % of articles with full meta data
- Per-article checklist: Title ✓/✗ · Description ✓/✗ · Keywords ✓/✗ · Image ✓/✗
- Score out of 4 for each article

---

### Analytics

- Total views and likes across all articles
- **Top Articles** bar chart by views
- **Views by Category** breakdown

---

### Settings

- Site name and tagline
- Contact email and YouTube URL
- Articles per page
- Enable/disable comments and newsletter
- Admin password reminder

---

## Troubleshooting

### "Cannot connect to server"
The backend isn't running. Start it:
```powershell
cd D:\projects\life-tech-journal\backend
uvicorn app.main:app --reload --port 8080
```

### "Token expired"
Your session expired. Sign in again. This shouldn't happen often — the app auto-refreshes tokens every 14 minutes while the tab is open.

### "Not authenticated" in admin editor
The Quick Access password doesn't give API access automatically if the auto-login failed. Try:
1. Sign out of admin panel
2. Sign in using the **👤 Account Login** tab with your registered email/password

### Google OAuth not working
- Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Check Google Console has `http://localhost:8080/api/v1/auth/google-callback` as an authorized redirect URI
- Restart the backend after changing `.env`

### Articles showing 422 error
The `size` parameter exceeds the backend limit. This is fixed automatically in the latest admin panel — make sure you're using the latest `admin/page.tsx`.

### Reading List / Saved Articles empty
These fetch from backend endpoints (`/user/reading-history` and `/user/bookmarks`) that need to be implemented. The pages show a loading state and empty state correctly.

---

## Keyboard Shortcuts (Article Editor)

| Key | Action |
|---|---|
| `Enter` in title | Moves focus to excerpt |
| `Enter` in password fields | Submits login/register form |
| Toolbar buttons | Insert HTML snippets at cursor |

---

## Free Image Resources

| Site | Best for |
|---|---|
| [Unsplash](https://unsplash.com) | Photography, lifestyle, tech |
| [Pexels](https://pexels.com) | Business, people, nature |
| [Pixabay](https://pixabay.com) | Illustrations, vectors |
| [StockSnap](https://stocksnap.io) | Clean, minimal photography |

Right-click any image → **Copy Image Address** → paste in the banner or in-content image URL field.

---

*Life & Tech Journal — Built with ❤️ using Next.js & FastAPI*
