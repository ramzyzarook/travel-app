import db from "../../../lib/db"; // Assuming you have a `db.js` for SQLite
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Install this package if you haven't already

// Access the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return new Response("Invalid credentials", { status: 401 });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response("Invalid credentials", { status: 401 });
  }

  // Generate JWT token using the secret from the environment
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return new Response(JSON.stringify({ token }), { status: 200 });
}
