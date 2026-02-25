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

// GET single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContents);

    return NextResponse.json({
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split("T")[0],
      description: data.description || "",
      tags: data.tags || [],
      draft: data.draft || false,
      content,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// PUT update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, date, description, tags, draft, content, newSlug } = body;

    const oldPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(oldPath)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const frontmatter = {
      title,
      date: date || new Date().toISOString().split("T")[0],
      description: description || "",
      tags: tags || [],
      draft: draft || false,
    };

    const fileContent = matter.stringify(content || "", frontmatter);

    // If slug changed, rename the file
    if (newSlug && newSlug !== slug) {
      const newPath = path.join(postsDirectory, `${newSlug}.md`);
      
      if (fs.existsSync(newPath)) {
        return NextResponse.json({ error: "New slug already exists" }, { status: 409 });
      }

      fs.writeFileSync(newPath, fileContent, "utf-8");
      fs.unlinkSync(oldPath);

      return NextResponse.json({ success: true, slug: newSlug });
    } else {
      fs.writeFileSync(oldPath, fileContent, "utf-8");
      return NextResponse.json({ success: true, slug });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    fs.unlinkSync(fullPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
