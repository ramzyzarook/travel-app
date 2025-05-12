import db from "../../../app/lib/db";
import { NextResponse } from "next/server";

// Get all posts (public)
export async function GET() {
  try {
    // Fetch posts with relevant data (title, author, country, date, likes, and comments)
    const posts = db
      .prepare(
        `SELECT posts.id, posts.title, posts.user_id, users.email AS author, posts.country, 
                posts.created_at AS date, posts.likes, posts.comments
         FROM posts 
         JOIN users ON users.id = posts.user_id 
         ORDER BY posts.created_at DESC`
      )
      .all();

    // Format posts to match the structure needed for the client
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      user_id: post.user_id, // Included user_id here
      author: post.author,
      country: post.country,
      date: post.date,
      likes: post.likes,
      comments: post.comments,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// Create a new post (for testing or future implementation)
export async function POST(req) {
  try {
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
      INSERT INTO posts (user_id, title, content, country, visit_date, flag, currency, capital, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      user_id,
      title,
      content,
      country,
      visit_date,
      flag,
      currency,
      capital,
      new Date().toISOString() // Add timestamp for created_at
    );

    return NextResponse.json({ success: true, postId: info.lastInsertRowid });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
