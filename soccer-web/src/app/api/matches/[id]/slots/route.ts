import { NextResponse } from "next/server";
import { getUserFromAuthHeader, requireAuth } from "@/lib/apiAuth";
import { getMatchDetails, updateExtraSlots } from "@/services/matchService";

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

  const body = await req.json();
  const extraSlots = Math.max(0, Number(body?.extraSlots ?? 0));

  const details = await getMatchDetails(id, user.userId);
  if (!details) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  if (!details.joinedByCurrentUser) {
    return NextResponse.json({ error: "User has not joined the match" }, { status: 400 });
  }

  await updateExtraSlots(id, user.userId, extraSlots);

  return NextResponse.json({ message: "Slots updated" }, { status: 200 });
}
