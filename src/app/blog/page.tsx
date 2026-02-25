import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export const metadata = {
  title: "Blog",
  description: "All published posts powered by local Markdown content.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">Blog</p>
        <h1 className="text-4xl font-bold text-slate-900">All posts</h1>
        <p className="text-slate-600">Every published entry, sorted by recency.</p>
      </header>

      {posts.length ? (
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No posts yet. Add a markdown file in <code>content/posts</code>.</p>
      )}
    </div>
  );
}
