export async function isAuthenticated(req) {
  // Check for a valid session or token here (simplified for now)
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;

  // Extract token from 'Bearer token' format (you can expand this for JWT or sessions)
  const token = authHeader.split(" ")[1];
  if (!token) return false;

  // For now, just check if the token matches a static value (use JWT or sessions in production)
  if (token !== "valid-token") {
    return false;
  }

  return true;
}
