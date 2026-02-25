import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/date";

type PostCardProps = {
  post: PostSummary;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {formatDate(post.date)}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-slate-600">{post.description}</p>
      {post.tags?.length ? (
        <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-slate-100 px-2 py-1 uppercase tracking-wide">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
