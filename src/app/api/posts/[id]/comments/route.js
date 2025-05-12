// app/api/posts/[id]/comments/route.js
import { NextResponse } from "next/server";
import db from "../../../../lib/db"; // Adjust this import based on how you access your database

// POST: Add a comment to a post
export async function POST(req, { params }) {
  const { id } = params; // Post ID from URL
  const { comment, userId } = await req.json(); // Extract comment content and user ID from request body

  try {
    // Insert the comment into the database
    await db.run(
      "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
      [id, userId, comment]
    );

    // Increment the comment count for the post
    await db.run("UPDATE posts SET comments = comments + 1 WHERE id = ?", [id]);

    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "Error adding comment" },
      { status: 500 }
    );
  }
}

// GET: Get all comments for a specific post
export async function GET(req, { params }) {
  const { id } = params; // Post ID from URL

  try {
    const comments = await db.all("SELECT * FROM comments WHERE post_id = ?", [
      id,
    ]);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Error fetching comments" },
      { status: 500 }
    );
  }
}
