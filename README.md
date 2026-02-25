# Minimal Blog Starter

A strictly typed Next.js (App Router + Tailwind) starter that ships with Markdown content loading, clean routing, and ready-to-go SEO metadata.

## What you get

- Local Markdown posts stored in `content/posts` with typed frontmatter (`title`, `date`, `description`, `tags`, `draft`).
- Static routes for the home page, blog index, and per-post detail pages.
- Simple layout with header/footer, responsive typography, and OG-ready metadata.
- Zero runtime data fetching—content is loaded at build time only.

## Requirements

- Node.js 18.18+ (Next.js 16 requirement)
- npm (or pnpm/bun if you adapt the lockfile)

## Local development

```bash
npm install
npm run dev
```

Visit <http://localhost:3000>. Markdown files are read at build time, so restart the dev server after adding a new file or changing frontmatter.

## Quality checks

```bash
npm run lint
npm run build
```

Both commands must pass before deploying. The build step statically renders every page, ensuring `fs` usage never leaks into edge runtimes.

## Add a new post

1. Create a new Markdown file in `content/posts`, e.g. `my-new-post.md`.
2. Include the required frontmatter at the top:

```md
---
title: "My New Post"
date: "2025-03-10"
description: "One-sentence summary for cards and SEO."
tags:
  - nextjs
  - notes
draft: false
---

Your markdown content lives here.
```

3. Restart `npm run dev` so the new file is picked up.
4. Set `draft: true` to hide a post from all listings while still committing it.

## Deploy

This project works anywhere Next.js does (Vercel, Netlify, etc.). For Vercel:

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Create a new Vercel project and select the repo.
3. Leave the default build command (`next build`) and output directory (`.next`).
4. Trigger the first deploy.

Because pages are fully static, you get CDN caching by default and zero server costs.

## Project structure

```
content/posts     ← Markdown sources
src/app           ← App Router routes (/, /blog, /blog/[slug])
src/components    ← Reusable UI pieces
src/lib           ← Content + formatting helpers
```

Happy shipping! ✨
