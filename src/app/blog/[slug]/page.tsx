import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/date";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getPublishedPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    if (post.draft) {
      return {};
    }

    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
      },
    } satisfies Metadata;
  } catch {
    return {
      title: "Post not found",
    } satisfies Metadata;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug).catch(() => null);

  if (!post || post.draft) {
    notFound();
  }

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">{formatDate(post.date)}</p>
        <h1 className="text-4xl font-bold text-slate-900">{post.title}</h1>
        <p className="text-base text-slate-600">{post.description}</p>
        {post.tags?.length ? (
          <ul className="flex flex-wrap gap-2 text-xs text-slate-500">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-slate-100 px-2 py-1 uppercase tracking-wide">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
