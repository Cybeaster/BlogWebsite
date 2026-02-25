import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { remark } from "remark";
import html from "remark-html";

export type PostFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft?: boolean;
};

export type PostSummary = PostFrontmatter & {
  slug: string;
};

export type PostContent = PostSummary & {
  html: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

const getPostSlugs = cache((): string[] => {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
});

const readPostFile = (slug: string): { frontmatter: PostFrontmatter; content: string } => {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  const frontmatter: PostFrontmatter = {
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    description: data.description ?? "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft ?? false,
  };

  return { frontmatter, content };
};

export const getAllPosts = cache((): PostSummary[] => {
  return getPostSlugs()
    .map((slug) => {
      const { frontmatter } = readPostFile(slug);
      return { slug, ...frontmatter } satisfies PostSummary;
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
});

export const getPostBySlug = cache(async (slug: string): Promise<PostContent> => {
  const { frontmatter, content } = readPostFile(slug);
  const processed = await remark().use(html).process(content);
  return {
    slug,
    ...frontmatter,
    html: processed.toString(),
  } satisfies PostContent;
});

export const getPublishedPostSlugs = cache(() => {
  return getAllPosts().map((post) => post.slug);
});
