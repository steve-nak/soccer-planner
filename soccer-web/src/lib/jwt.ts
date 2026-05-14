export const AUTH_COOKIE_NAME = "soccer_planner_session";

const encoder = new TextEncoder();

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
  exp: number;
};

function base64UrlEncode(input: string | ArrayBuffer) {
  const bytes =
    typeof input === "string"
      ? encoder.encode(input)
      : new Uint8Array(input);

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(input: string) {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = padBase64(base64);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function base64UrlDecodeToBytes(input: string) {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(padBase64(base64));

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function padBase64(input: string) {
  return input.padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
}

async function getSigningKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return secret;
}

export async function signSessionToken(
  payload: Omit<SessionPayload, "exp">,
  secret = getJwtSecret()
) {
  const header = { alg: "HS256", typ: "JWT" };
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };
  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(body)
  )}`;
  const key = await getSigningKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(unsignedToken)
  );

  return `${unsignedToken}.${base64UrlEncode(signature)}`;
}

export async function verifySessionToken(token: string, secret = getJwtSecret()) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const key = await getSigningKey(secret);
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecodeToBytes(encodedSignature),
    encoder.encode(`${encodedHeader}.${encodedPayload}`)
  );

  if (!isValid) {
    return null;
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
