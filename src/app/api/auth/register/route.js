import bcrypt from "bcryptjs";
import db from "../../../lib/db";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Check if user already exists
  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);
  if (existingUser) {
    return new Response("User already exists", { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the database
  db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
    email,
    hashedPassword
  );

  return new Response("User registered successfully", { status: 201 });
}
