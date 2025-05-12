import db from "../../../lib/db";
import { NextResponse } from "next/server";

// GET /api/posts/[id] - Get a single post by ID
export async function GET(_, { params }) {
  try {
    const { id } = params;
    const stmt = db.prepare(
      `SELECT posts.id, posts.title, posts.content, posts.user_id, users.email AS author,
              posts.country, posts.flag, posts.currency, posts.capital, posts.visit_date,
              posts.created_at AS date, posts.likes, posts.comments
       FROM posts 
       JOIN users ON users.id = posts.user_id 
       WHERE posts.id = ?`
    );
    const post = stmt.get(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { title, content, visit_date, country, flag, currency, capital } =
      await req.json();

    const stmt = db.prepare(
      `UPDATE posts 
       SET title = ?, content = ?, visit_date = ?, country = ?, flag = ?, currency = ?, capital = ? 
       WHERE id = ?`
    );

    const info = stmt.run(
      title,
      content,
      visit_date,
      country,
      flag,
      currency,
      capital,
      id
    );

    return NextResponse.json({ success: info.changes > 0 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post by ID
export async function DELETE(_, { params }) {
  try {
    const { id } = params;
    const stmt = db.prepare(`DELETE FROM posts WHERE id = ?`);
    const info = stmt.run(id);

    return NextResponse.json({ success: info.changes > 0 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
