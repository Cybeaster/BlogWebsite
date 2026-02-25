import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

async function checkAuth() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("admin_token");
  return authToken?.value === process.env.ADMIN_PASSWORD;
}

// GET all posts (including drafts)
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ posts: [] });
    }

    const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
    
    const posts = files.map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split("T")[0],
        description: data.description || "",
        tags: data.tags || [],
        draft: data.draft || false,
        content,
      };
    });

    posts.sort((a, b) => (a.date < b.date ? 1 : -1));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, date, description, tags, draft, content } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    const filename = `${slug}.md`;
    const fullPath = path.join(postsDirectory, filename);

    if (fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Post already exists" }, { status: 409 });
    }

    const frontmatter = {
      title,
      date: date || new Date().toISOString().split("T")[0],
      description: description || "",
      tags: tags || [],
      draft: draft || false,
    };

    const fileContent = matter.stringify(content || "", frontmatter);

    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    fs.writeFileSync(fullPath, fileContent, "utf-8");

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
