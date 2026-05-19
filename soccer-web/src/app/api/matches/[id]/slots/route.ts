import { NextResponse } from "next/server";
import { getUserFromAuthHeader, requireAuth } from "@/lib/apiAuth";
import { getMatchDetails, updateExtraSlots } from "@/services/matchService";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromAuthHeader(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const id = Number(params.id);
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
