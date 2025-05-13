import db from "../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response("Invalid credentials", { status: 401 });
  }

  // Generate JWT token including the userId in the payload
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return new Response(JSON.stringify({ token, userId: user.id }), {
    status: 200,
  });
}
