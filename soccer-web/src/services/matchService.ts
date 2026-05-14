import { db } from "@/db";
import {
  matches,
  matchJoins,
  groups,
  groupMembers,
  users,
  matchComments,
} from "@/db/schema";
import { eq, and, or, desc, asc, count, inArray } from "drizzle-orm";

export type MatchState = "upcoming" | "current" | "past";
export type CapacityStatus = "full" | "under" | "over";

export interface MatchWithDetails {
  id: number;
  groupId: number;
  groupTitle: string;
  date: Date;
  location: string;
  capacity: number;
  canceled: boolean;
  state: MatchState;
  capacityStatus: CapacityStatus;
  playerCount: number;
  commentCount: number;
  joinedByCurrentUser: boolean;
}

/**
 * Calculate the state of a match based on its start date
 * - upcoming: start time not yet reached
 * - current: at start time, lasts for 1 hour
 * - past: after 1 hour from start
 */
export function calculateMatchState(matchDate: Date): MatchState {
  const now = new Date();
  const oneHourAfterStart = new Date(matchDate.getTime() + 60 * 60 * 1000);

  if (now < matchDate) {
    return "upcoming";
  } else if (now < oneHourAfterStart) {
    return "current";
  } else {
    return "past";
  }
}

/**
 * Determine if a match is active (can be joined/unjoined)
 * A match is active when it's upcoming or current and not canceled
 */
export function isMatchActive(
  state: MatchState,
  canceled: boolean
): boolean {
  return (state === "upcoming" || state === "current") && !canceled;
}

/**
 * Calculate the capacity status of a match
 */
export function calculateCapacityStatus(
  playerCount: number,
  capacity: number
): CapacityStatus {
  if (playerCount > capacity) {
    return "over";
  } else if (playerCount === capacity) {
    return "full";
  } else {
    return "under";
  }
}

/**
 * Get all matches for a user's groups with details
 */
export async function getAllUserMatches(
  userId: number
): Promise<MatchWithDetails[]> {
  // First get all groups the user is a member of
  const userGroupIds = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(eq(groupMembers.userId, userId));

  if (userGroupIds.length === 0) {
    return [];
  }

  const groupIds = userGroupIds.map((g) => g.groupId);

  // Get all matches in those groups
  const userMatches = await db
    .select({
      id: matches.id,
      groupId: matches.groupId,
      groupTitle: groups.title,
      date: matches.date,
      location: matches.location,
      capacity: matches.capacity,
      canceled: matches.canceled,
    })
    .from(matches)
    .innerJoin(groups, eq(matches.groupId, groups.id))
    .where(inArray(matches.groupId, groupIds))
    .orderBy(asc(matches.date));

  // For each match, get player count, comment count, and check if user joined
  const matchesWithDetails = await Promise.all(
    userMatches.map(async (match) => {
      const playerCountResult = await db
        .select({ count: count() })
        .from(matchJoins)
        .where(eq(matchJoins.matchId, match.id));

      const commentCountResult = await db
        .select({ count: count() })
        .from(matchComments)
        .where(eq(matchComments.matchId, match.id));

      const userJoined = await db
        .select({ id: matchJoins.id })
        .from(matchJoins)
        .where(
          and(
            eq(matchJoins.matchId, match.id),
            eq(matchJoins.userId, userId)
          )
        )
        .limit(1);

      const state = calculateMatchState(match.date);
      const playerCount = playerCountResult[0]?.count || 0;
      const commentCount = commentCountResult[0]?.count || 0;
      const capacityStatus = calculateCapacityStatus(playerCount, match.capacity);

      return {
        id: match.id,
        groupId: match.groupId,
        groupTitle: match.groupTitle,
        date: match.date,
        location: match.location,
        capacity: match.capacity,
        canceled: match.canceled,
        state,
        capacityStatus,
        playerCount,
        commentCount,
        joinedByCurrentUser: userJoined.length > 0,
      };
    })
  );

  return matchesWithDetails;
}

/**
 * Get active matches for a user (upcoming or current, not canceled)
 */
export async function getActiveMatches(
  userId: number
): Promise<MatchWithDetails[]> {
  const allMatches = await getAllUserMatches(userId);
  return allMatches.filter(
    (match) => !match.canceled && (match.state === "upcoming" || match.state === "current")
  );
}

/**
 * Get archive matches for a user (past or canceled)
 */
export async function getArchiveMatches(
  userId: number
): Promise<MatchWithDetails[]> {
  const allMatches = await getAllUserMatches(userId);
  return allMatches.filter(
    (match) => match.canceled || match.state === "past"
  );
}

/**
 * Get a specific match with all details including players and comments
 */
export async function getMatchDetails(matchId: number, userId?: number) {
  const matchData = await db
    .select({
      id: matches.id,
      groupId: matches.groupId,
      groupTitle: groups.title,
      date: matches.date,
      location: matches.location,
      capacity: matches.capacity,
      canceled: matches.canceled,
      createdAt: matches.createdAt,
    })
    .from(matches)
    .innerJoin(groups, eq(matches.groupId, groups.id))
    .where(eq(matches.id, matchId))
    .limit(1);

  if (!matchData.length) {
    return null;
  }

  const match = matchData[0];

  // Get players joined to this match with their details
  const players = await db
    .select({
      userId: matchJoins.userId,
      userName: users.name,
      extraSlots: matchJoins.extraSlots,
      joinedAt: matchJoins.joinedAt,
    })
    .from(matchJoins)
    .innerJoin(users, eq(matchJoins.userId, users.id))
    .where(eq(matchJoins.matchId, matchId))
    .orderBy(asc(matchJoins.joinedAt));

  // Get comments
  const comments = await db
    .select({
      id: matchComments.id,
      userId: matchComments.userId,
      userName: users.name,
      text: matchComments.text,
      createdAt: matchComments.createdAt,
    })
    .from(matchComments)
    .innerJoin(users, eq(matchComments.userId, users.id))
    .where(eq(matchComments.matchId, matchId))
    .orderBy(desc(matchComments.createdAt));

  const state = calculateMatchState(match.date);
  const isActive = isMatchActive(state, match.canceled);
  const capacityStatus = calculateCapacityStatus(players.length, match.capacity);

  return {
    id: match.id,
    groupId: match.groupId,
    groupTitle: match.groupTitle,
    date: match.date,
    location: match.location,
    capacity: match.capacity,
    canceled: match.canceled,
    createdAt: match.createdAt,
    state,
    isActive,
    capacityStatus,
    playerCount: players.length,
    players,
    comments,
    joinedByCurrentUser: userId
      ? players.some((p) => p.userId === userId)
      : false,
  };
}

/**
 * Join a user to a match
 */
export async function joinMatch(matchId: number, userId: number) {
  return await db.insert(matchJoins).values({
    matchId,
    userId,
    extraSlots: 0,
  });
}

/**
 * Unjoin a user from a match
 */
export async function unjoinMatch(matchId: number, userId: number) {
  return await db
    .delete(matchJoins)
    .where(and(eq(matchJoins.matchId, matchId), eq(matchJoins.userId, userId)));
}

/**
 * Check if a user is a member of a group
 */
export async function isUserGroupMember(
  userId: number,
  groupId: number
): Promise<boolean> {
  const result = await db
    .select({ id: groupMembers.id })
    .from(groupMembers)
    .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)))
    .limit(1);

  return result.length > 0;
}

/**
 * Update extra slots for a player in a match
 */
export async function updateExtraSlots(
  matchId: number,
  userId: number,
  extraSlots: number
) {
  // Ensure extraSlots is not negative
  const validSlots = Math.max(0, extraSlots);

  return await db
    .update(matchJoins)
    .set({ extraSlots: validSlots })
    .where(and(eq(matchJoins.matchId, matchId), eq(matchJoins.userId, userId)));
}
