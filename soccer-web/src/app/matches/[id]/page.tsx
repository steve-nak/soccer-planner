import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMatchDetails, isUserGroupMember } from "@/services/matchService";
import { MatchDetailClient } from "@/components/MatchDetailClient";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { id } = await params;
  const matchId = parseInt(id);

  if (isNaN(matchId)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700">Invalid match ID</p>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const matchDetails = await getMatchDetails(matchId, currentUser.userId);

  if (!matchDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700">Match not found</p>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Verify that the user is a member of the group that owns this match
  const isMember = await isUserGroupMember(currentUser.userId, matchDetails.groupId);

  if (!isMember) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-red-200 bg-red-50">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-700 mb-6">
              You are not a member of the group <strong>{matchDetails.groupTitle}</strong> that owns this match.
              Only group members can view match details.
            </p>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MatchDetailClient match={matchDetails} currentUserId={currentUser.userId} />
      </div>
    </div>
  );
}
