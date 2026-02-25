"use client";

import { useState, useEffect } from "react";

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  content: string;
};

type PostEditorProps = {
  post: Post | null;
  onSave: () => void;
  onCancel: () => void;
};

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [slug, setSlug] = useState(post?.slug || "");
  const [title, setTitle] = useState(post?.title || "");
  const [date, setDate] = useState(
    post?.date || new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(post?.description || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [draft, setDraft] = useState(post?.draft || false);
  const [content, setContent] = useState(post?.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from title if creating new post
  useEffect(() => {
    if (!post && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  }, [title, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const postData = {
        slug,
        title,
        date,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        draft,
        content,
        newSlug: post && slug !== post.slug ? slug : undefined,
      };

      const url = post
        ? `/api/admin/posts/${post.slug}`
        : "/api/admin/posts";

      const method = post ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save post");
      }
    } catch (err) {
      setError("Failed to save post. Please try again.");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {post ? "Edit Post" : "New Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              pattern="[a-z0-9-]+"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="post-url-slug"
            />
            <p className="mt-1 text-xs text-slate-500">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="tag1, tag2, tag3"
            />
            <p className="mt-1 text-xs text-slate-500">
              Comma-separated list
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Short description for cards and SEO"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Content (Markdown) *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Write your post content in Markdown..."
          />
          <p className="mt-1 text-xs text-slate-500">
            Supports Markdown formatting
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="draft"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
          />
          <label htmlFor="draft" className="ml-2 text-sm text-slate-700">
            Save as draft (hidden from public)
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-6 py-2 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : post ? "Update Post" : "Create Post"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-6 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
