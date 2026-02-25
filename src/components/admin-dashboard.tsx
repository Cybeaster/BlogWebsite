"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PostEditor from "./post-editor";

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  content: string;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete post "${slug}"?`)) return;

    try {
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchPosts();
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleSaveComplete = () => {
    setShowEditor(false);
    setEditingPost(null);
    fetchPosts();
  };

  if (showEditor) {
    return (
      <PostEditor
        post={editingPost}
        onSave={handleSaveComplete}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your blog posts</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleNewPost}
            className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
          >
            + New Post
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Site
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-600">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
          <p className="text-lg text-slate-600">No posts yet</p>
          <button
            onClick={handleNewPost}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {post.title}
                  </h2>
                  {post.draft && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Draft
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{post.description}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span>📅 {post.date}</span>
                  <span>🔗 {post.slug}</span>
                  {post.tags.length > 0 && (
                    <span>🏷️ {post.tags.join(", ")}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
