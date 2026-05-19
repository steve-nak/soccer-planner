import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

function getCorsHeaders(origin: string | null) {
  const allowOrigin = origin ?? "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  } as Record<string, string>;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");

  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight for API routes centrally
  if (isApi && request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  // Allow public page routes as before. For API public routes, include CORS headers.
  if (isPublicPath(pathname)) {
    return isApi ? NextResponse.next({ headers: corsHeaders }) : NextResponse.next();
  }

  // API requests: authenticate and return JSON 401 on failure (with CORS headers)
  if (isApi) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (session) {
      return NextResponse.next({ headers: corsHeaders });
    }

    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  }

  // Non-API pages: preserve existing redirect-to-login behavior
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
