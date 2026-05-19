import { NextResponse } from "next/server";
import { getUserFromAuthHeader, requireAuth } from "@/lib/apiAuth";
import { getMatchDetails, joinMatch, isUserGroupMember } from "@/services/matchService";

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
  if (!details.isActive) return NextResponse.json({ error: "Match is not open for joining" }, { status: 400 });

  const member = await isUserGroupMember(user.userId, details.groupId);
  if (!member) return NextResponse.json({ error: "User is not a member of the group" }, { status: 403 });

  if (details.joinedByCurrentUser) {
    return NextResponse.json({ message: "Already joined" });
  }

  await joinMatch(id, user.userId);

  return NextResponse.json({ message: "Joined" }, { status: 200 });
}
