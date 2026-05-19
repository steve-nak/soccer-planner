import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { signSessionToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await loginUser({ email, password });

    const token = await signSessionToken({ userId: user.userId, email: user.email, name: user.name });

    return NextResponse.json(
      { token, user },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid credentials";

    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}
