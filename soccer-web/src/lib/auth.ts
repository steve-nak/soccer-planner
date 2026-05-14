import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  AUTH_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/jwt";

export type AuthUser = Pick<SessionPayload, "userId" | "email" | "name">;

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (!name || !email || !input.password) {
    throw new Error("All fields are required.");
  }

  if (input.password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [createdUser] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

  return {
    userId: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new Error("Invalid email or password.");
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function createSession(user: AuthUser) {
  const token = await signSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
  };
}
