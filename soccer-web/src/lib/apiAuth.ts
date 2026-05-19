import { type SessionPayload, verifySessionToken } from "./jwt";

export async function getUserFromAuthHeader(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return null;
    const parts = auth.split(" ");
    if (parts.length !== 2) return null;
    const scheme = parts[0];
    const token = parts[1];
    if (scheme.toLowerCase() !== "bearer") return null;

    const payload = await verifySessionToken(token);
    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(payload: null): Response;
export function requireAuth(payload: SessionPayload): null;
export function requireAuth(payload: SessionPayload | null) {
  if (!payload) {
    const headers = { "Content-Type": "application/json" };
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers,
    });
  }

  return null;
}
