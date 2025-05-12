// app/api/posts/[id]/like/route.js
import { NextResponse } from "next/server";
import db from "../../../../lib/db"; // Adjust this import based on how you access your database

// POST: Like a post
export async function POST(req, { params }) {
  const { id } = params; // Post ID from URL
  const { userId } = await req.json(); // Extract the user ID from request body

  try {
    // Increment the like count for the post
    await db.run("UPDATE posts SET likes = likes + 1 WHERE id = ?", [id]);

    // Optionally, record the user's like (e.g., preventing multiple likes per user)
    await db.run("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [
      id,
      userId,
    ]);

    return NextResponse.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ message: "Error liking post" }, { status: 500 });
  }
}
