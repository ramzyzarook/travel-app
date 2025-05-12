import db from "../../../app/lib/db";
import { NextResponse } from "next/server";

// Get all posts (public)
export async function GET() {
  const posts = db
    .prepare(
      "SELECT posts.*, users.email FROM posts JOIN users ON users.id = posts.user_id ORDER BY created_at DESC"
    )
    .all();
  return NextResponse.json(posts);
}

// Create post
export async function POST(req) {
  const {
    user_id,
    title,
    content,
    country,
    visit_date,
    flag,
    currency,
    capital,
  } = await req.json();

  const stmt = db.prepare(`
    INSERT INTO posts (user_id, title, content, country, visit_date, flag, currency, capital)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    user_id,
    title,
    content,
    country,
    visit_date,
    flag,
    currency,
    capital
  );

  return NextResponse.json({ success: true, postId: info.lastInsertRowid });
}
