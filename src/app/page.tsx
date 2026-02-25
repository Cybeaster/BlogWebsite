import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="space-y-4 text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">
          Starter Kit
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Ship a blog without rebuilding the basics.
        </h1>
        <p className="text-lg text-slate-600">
          Markdown-powered posts, routed pages, typed content loading, and sensible SEO defaults—ready for your next idea.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Link href="/blog" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
            Browse all posts
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            Next.js Docs
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Latest posts</h2>
          <Link href="/blog" className="text-sm font-medium text-sky-600 hover:underline">
            View all
          </Link>
        </div>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No published posts yet.</p>
        )}
      </section>
    </div>
  );
}
