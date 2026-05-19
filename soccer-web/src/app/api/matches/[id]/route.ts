import { NextResponse } from "next/server";
import { getUserFromAuthHeader, requireAuth } from "@/lib/apiAuth";
import { getMatchDetails } from "@/services/matchService";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromAuthHeader(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
  }

  const details = await getMatchDetails(id, user.userId);

  if (!details) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  return NextResponse.json(details);
}
