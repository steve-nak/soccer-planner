"use client";

import Link from "next/link";
import { useState } from "react";
import {
  joinMatchAction,
  unjoinMatchAction,
  updateExtraSlotsAction,
} from "@/app/matches/actions";
import type {
  MatchState,
  CapacityStatus,
} from "@/services/matchService";

interface MatchDetailClientProps {
  match: {
    id: number;
    groupId: number;
    groupTitle: string;
    date: Date;
    location: string;
    capacity: number;
    canceled: boolean;
    createdAt: Date;
    state: MatchState;
    isActive: boolean;
    capacityStatus: CapacityStatus;
    playerCount: number;
    players: Array<{
      userId: number;
      userName: string;
      extraSlots: number;
      joinedAt: Date;
    }>;
    comments: Array<{
      id: number;
      userId: number;
      userName: string;
      text: string;
      createdAt: Date;
    }>;
    joinedByCurrentUser: boolean;
  };
  currentUserId: number;
}

export function MatchDetailClient({
  match,
  currentUserId,
}: MatchDetailClientProps) {
  const [isJoined, setIsJoined] = useState(match.joinedByCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [playerExtraSlots, setPlayerExtraSlots] = useState(
    () => {
      const player = match.players.find((p) => p.userId === currentUserId);
      return player?.extraSlots || 0;
    }
  );
  const [slotsEditMode, setSlotsEditMode] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const formattedDate = new Date(match.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(match.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStateColor = (state: string, canceled: boolean) => {
    if (canceled) return "bg-red-100 text-red-800";
    if (state === "upcoming") return "bg-blue-100 text-blue-800";
    if (state === "current") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const getCapacityColor = (capacityStatus: string) => {
    if (capacityStatus === "full") return "bg-orange-100 text-orange-800";
    if (capacityStatus === "over") return "bg-red-100 text-red-800";
    return "bg-green-100 text-green-800";
  };

  const getStateLabel = () => {
    if (match.canceled) return "Canceled";
    return match.state.charAt(0).toUpperCase() + match.state.slice(1);
  };

  const getCapacityLabel = () => {
    const playersText = `${match.playerCount}/${match.capacity}`;
    if (match.capacityStatus === "full") return `${playersText} (Full)`;
    if (match.capacityStatus === "over")
      return `${playersText} (Over capacity)`;
    return `${playersText} (Under capacity)`;
  };

  const handleJoinToggle = async () => {
    setIsLoading(true);
    try {
      if (isJoined) {
        await unjoinMatchAction(match.id);
      } else {
        await joinMatchAction(match.id);
      }
      setIsJoined(!isJoined);
      setPlayerExtraSlots(0);
      setSlotsEditMode(false);
    } catch (error) {
      console.error("Error toggling join status:", error);
      alert("Failed to update join status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLink = async () => {
    const matchUrl = `${window.location.origin}/matches/${match.id}`;
    try {
      await navigator.clipboard.writeText(matchUrl);
      setShareMessage("Link copied to clipboard!");
      setTimeout(() => setShareMessage(""), 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      setShareMessage("Failed to copy link");
      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  const handleUpdateSlots = async () => {
    if (playerExtraSlots < 0 || playerExtraSlots > 10) {
      alert("Extra slots must be between 0 and 10");
      return;
    }

    setSlotsLoading(true);
    try {
      await updateExtraSlotsAction(match.id, playerExtraSlots);
      setSlotsEditMode(false);
    } catch (error) {
      console.error("Error updating slots:", error);
      alert("Failed to update slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSlotIncrement = () => {
    if (playerExtraSlots < 10) {
      setPlayerExtraSlots(playerExtraSlots + 1);
    }
  };

  const handleSlotDecrement = () => {
    if (playerExtraSlots > 0) {
      setPlayerExtraSlots(playerExtraSlots - 1);
    }
  };

  const getTotalPlayersCount = () => {
    return isJoined ? 1 + playerExtraSlots : 1;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Match Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {formattedDate} at {formattedTime}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{match.location}</p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Group:</span> {match.groupTitle}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStateColor(
                match.state,
                match.canceled
              )}`}
            >
              {getStateLabel()}
            </span>
            <span
              className={`px-4 py-2 rounded text-sm font-medium ${getCapacityColor(
                match.capacityStatus
              )}`}
            >
              {getCapacityLabel()}
            </span>
          </div>
        </div>

        {/* Action Section */}
        <div className="border-t pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Join/Leave & Friends Section */}
            {match.isActive ? (
              <div className="flex items-center gap-4">
                {/* Join/Leave Button */}
                <button
                  onClick={handleJoinToggle}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors text-white ${
                    isJoined
                      ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                      : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                  }`}
                >
                  {isLoading ? "Loading..." : isJoined ? "Leave Match" : "Join Match"}
                </button>

                {/* Friends Slots Section - Only when joined */}
                {isJoined && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      Bringing friends:
                    </span>
                    {!slotsEditMode ? (
                      <>
                        <span className="text-lg font-bold text-blue-600">
                          +{playerExtraSlots}
                        </span>
                        <button
                          onClick={() => setSlotsEditMode(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSlotDecrement}
                          disabled={playerExtraSlots === 0 || slotsLoading}
                          className="px-2 py-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 rounded font-semibold text-sm"
                        >
                          −
                        </button>
                        <span className="text-lg font-bold text-blue-600 w-6 text-center">
                          {playerExtraSlots}
                        </span>
                        <button
                          onClick={handleSlotIncrement}
                          disabled={playerExtraSlots === 10 || slotsLoading}
                          className="px-2 py-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 rounded font-semibold text-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={handleUpdateSlots}
                          disabled={slotsLoading}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded text-sm font-semibold"
                        >
                          {slotsLoading ? "..." : "Save"}
                        </button>
                        <button
                          onClick={() => setSlotsEditMode(false)}
                          disabled={slotsLoading}
                          className="px-3 py-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white rounded text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {match.canceled ? "This match has been canceled" : "This match is no longer active"}
              </p>
            )}

            {/* Share Link Button */}
            <button
              onClick={handleShareLink}
              className="px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
              title="Copy match link to clipboard"
            >
              🔗 Share Match
            </button>

            {/* Share Message */}
            {shareMessage && (
              <div className="text-sm font-medium text-green-600">
                {shareMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Players ({match.playerCount}/{match.capacity})
          </h2>
        </div>

        {match.players.length > 0 ? (
          <div className="space-y-3">
            {match.players.map((player) => (
              <div
                key={player.userId}
                className="flex items-center justify-between py-3 px-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{player.userName}</p>
                    {player.userId === currentUserId && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Joined{" "}
                    {new Date(player.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {player.extraSlots > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                    +{player.extraSlots}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No players joined yet</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Comments ({match.comments.length})
        </h2>

        {match.comments.length > 0 ? (
          <div className="space-y-4">
            {match.comments.map((comment) => (
              <div key={comment.id} className="pb-4 border-b last:border-b-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-900">{comment.userName}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No comments yet</p>
        )}
      </div>
    </div>
  );
}
