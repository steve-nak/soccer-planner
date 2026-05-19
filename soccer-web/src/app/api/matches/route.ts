import { NextResponse } from "next/server";
import { getUserFromAuthHeader, requireAuth } from "@/lib/apiAuth";
import { getActiveMatches } from "@/services/matchService";

export async function GET(req: Request) {
  const user = await getUserFromAuthHeader(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const pageSize = Math.max(1, Math.min(100, Number(url.searchParams.get("pageSize") || "20")));

  const allMatches = await getActiveMatches(user.userId);
  const total = allMatches.length;
  const start = (page - 1) * pageSize;
  const items = allMatches.slice(start, start + pageSize);

  return NextResponse.json({ total, page, pageSize, items });
}
