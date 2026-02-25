# Admin Panel Guide

## Features

✅ **Secure Login** - Password-protected admin access  
✅ **Create Posts** - Write new blog posts with Markdown  
✅ **Edit Posts** - Update existing posts  
✅ **Delete Posts** - Remove posts permanently  
✅ **Draft Mode** - Save posts as drafts (hidden from public)  
✅ **Auto Slug** - Automatic URL slug generation from title  
✅ **Tags & Metadata** - Full frontmatter control  

---

## Setup

### 1. Set Admin Password

Edit `.env.local` and change the default password:

```bash
ADMIN_PASSWORD=your-secure-password-here
```

**⚠️ Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

### 2. Restart Dev Server

```bash
npm run dev
```

---

## Usage

### Access Admin Panel

Navigate to: **http://localhost:3000/admin**

On first visit, you'll be redirected to the login page.

### Login

1. Go to **http://localhost:3000/admin/login**
2. Enter the password from `.env.local`
3. Click "Login"

The session lasts 24 hours.

### Create a New Post

1. Click **"+ New Post"** button
2. Fill in the form:
   - **Title** (required) - Post title
   - **Slug** (required) - URL-friendly identifier (auto-generated from title)
   - **Date** (required) - Publication date
   - **Tags** - Comma-separated list (e.g., `nextjs, react, tutorial`)
   - **Description** - Short summary for cards and SEO
   - **Content** (required) - Markdown content
   - **Draft** checkbox - Hide from public if checked
3. Click **"Create Post"**

The post will be saved to `content/posts/{slug}.md`.

### Edit a Post

1. Click **"Edit"** button on any post
2. Update fields as needed
3. Click **"Update Post"**

You can change the slug, which will rename the file.

### Delete a Post

1. Click **"Delete"** button on any post
2. Confirm deletion

**⚠️ Warning:** Deletion is permanent!

---

## API Endpoints

All endpoints require authentication (admin cookie).

### Authentication

- `POST /api/admin/login` - Login with password

### Posts

- `GET /api/admin/posts` - List all posts (including drafts)
- `POST /api/admin/posts` - Create new post
- `GET /api/admin/posts/[slug]` - Get single post
- `PUT /api/admin/posts/[slug]` - Update post
- `DELETE /api/admin/posts/[slug]` - Delete post

---

## Security Notes

### Production Deployment

1. **Use a strong password** in production environment variables
2. **Enable HTTPS** (secure cookie transmission)
3. **Consider adding 2FA** for extra security
4. **Review auth cookies** - currently set to httpOnly, secure in production
5. **Add rate limiting** to prevent brute force attacks

### Environment Variables

On Vercel/Netlify:
1. Add `ADMIN_PASSWORD` to environment variables
2. Redeploy

The `.env.local` file is only for local development.

---

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard (protected)
│   │   └── login/
│   │       └── page.tsx      # Login page
│   └── api/
│       └── admin/
│           ├── login/
│           │   └── route.ts  # Login API
│           └── posts/
│               ├── route.ts          # List/create posts
│               └── [slug]/
│                   └── route.ts      # Get/update/delete post
└── components/
    ├── admin-dashboard.tsx   # Dashboard UI
    └── post-editor.tsx       # Post editor form
```

---

## Troubleshooting

### "Unauthorized" Error

- Ensure `.env.local` exists with `ADMIN_PASSWORD`
- Restart dev server after changing `.env.local`
- Clear browser cookies and login again

### Posts Not Saving

- Check file permissions on `content/posts/` directory
- Verify slug format (lowercase, hyphens only)
- Check browser console for errors

### Can't Access Admin Panel

- Ensure you're logged in (`/admin/login`)
- Check that cookie is being set (browser dev tools → Application → Cookies)

---

## Future Enhancements

Possible improvements:

- 📸 Image upload/management
- 🔍 Search posts in admin
- 📊 Analytics dashboard
- 👥 Multi-user support with roles
- 🔐 Two-factor authentication
- 📝 Rich Markdown editor (WYSIWYG)
- 🌐 i18n support for multiple languages
- 📅 Scheduled publishing
- 🗂️ Category management

---

## Development

Built with:
- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- gray-matter (frontmatter parsing)
- File-based storage (no database required)

Simple, lightweight, and easy to customize!
