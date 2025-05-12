import db from "../../../lib/db";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Function to get the userId from the JWT token
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (err) {
    return null; // If token is invalid, return null
  }
};

// Get a specific post
export async function GET(_, { params, request }) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(params.id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// Update a post
export async function PUT(req, { params, request }) {
  const { title, content, country, visit_date, flag, currency, capital } =
    await req.json();

  const token = request?.headers?.authorization?.split(" ")[1]; // Bearer token
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the post to ensure the user is the owner
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(params.id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  db.prepare(
    `
    UPDATE posts
    SET title = ?, content = ?, country = ?, visit_date = ?, flag = ?, currency = ?, capital = ?
    WHERE id = ?
  `
  ).run(
    title,
    content,
    country,
    visit_date,
    flag,
    currency,
    capital,
    params.id
  );

  return NextResponse.json({ success: true });
}


// Delete a post
export async function DELETE(req, { params, request }) {
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Bearer token
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the post to ensure the user is the owner
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(params.id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  db.prepare("DELETE FROM posts WHERE id = ?").run(params.id);

  return NextResponse.json({ success: true });
}
