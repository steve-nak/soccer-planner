import { NextResponse } from "next/server";
import { getUserFromAuthHeader, requireAuth } from "@/lib/apiAuth";
import { getMatchDetails, unjoinMatch } from "@/services/matchService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteContext) {
  const user = await getUserFromAuthHeader(req);
  if (!user) return requireAuth(user);

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
  }

  const details = await getMatchDetails(id, user.userId);
  if (!details) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  if (!details.joinedByCurrentUser) {
    return NextResponse.json({ message: "Not joined" });
  }

  await unjoinMatch(id, user.userId);

  return NextResponse.json({ message: "Left" }, { status: 200 });
}
