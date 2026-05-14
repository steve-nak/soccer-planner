"use server";

import {
  joinMatch,
  unjoinMatch,
  updateExtraSlots,
  isUserGroupMember,
  getMatchDetails,
} from "@/services/matchService";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function joinMatchAction(matchId: number) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get match details to verify group membership
  const matchDetails = await getMatchDetails(matchId, user.userId);
  if (!matchDetails) {
    throw new Error("Match not found");
  }

  // Verify user is a member of the group
  const isMember = await isUserGroupMember(user.userId, matchDetails.groupId);
  if (!isMember) {
    throw new Error("You are not a member of this match's group");
  }

  await joinMatch(matchId, user.userId);
  revalidatePath(`/matches/${matchId}`);
  revalidatePath("/dashboard");
}

export async function unjoinMatchAction(matchId: number) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get match details to verify group membership
  const matchDetails = await getMatchDetails(matchId, user.userId);
  if (!matchDetails) {
    throw new Error("Match not found");
  }

  // Verify user is a member of the group
  const isMember = await isUserGroupMember(user.userId, matchDetails.groupId);
  if (!isMember) {
    throw new Error("You are not a member of this match's group");
  }

  await unjoinMatch(matchId, user.userId);
  revalidatePath(`/matches/${matchId}`);
  revalidatePath("/dashboard");
}

export async function updateExtraSlotsAction(
  matchId: number,
  extraSlots: number
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get match details to verify group membership
  const matchDetails = await getMatchDetails(matchId, user.userId);
  if (!matchDetails) {
    throw new Error("Match not found");
  }

  // Verify user is a member of the group
  const isMember = await isUserGroupMember(user.userId, matchDetails.groupId);
  if (!isMember) {
    throw new Error("You are not a member of this match's group");
  }

  // Verify user is joined to the match
  const isJoined = matchDetails.players.some((p) => p.userId === user.userId);
  if (!isJoined) {
    throw new Error("You must be joined to the match to update slots");
  }

  // Validate extra slots
  if (extraSlots < 0 || extraSlots > 10) {
    throw new Error("Extra slots must be between 0 and 10");
  }

  await updateExtraSlots(matchId, user.userId, extraSlots);
  revalidatePath(`/matches/${matchId}`);
  revalidatePath("/dashboard");
}
