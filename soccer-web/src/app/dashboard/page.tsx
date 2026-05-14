import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getActiveMatches, getArchiveMatches } from "@/services/matchService";
import { MatchCard } from "@/components/MatchCard";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const activeMatches = await getActiveMatches(currentUser.userId);
  const archiveMatches = await getArchiveMatches(currentUser.userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {currentUser.name}! Browse and manage your matches.
          </p>
        </div>

        {/* Active Matches Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-8 bg-blue-600 rounded"></span>
              Active Matches
            </h2>
            <p className="mt-1 text-gray-600">
              Upcoming and current matches you can join
            </p>
          </div>

          {activeMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-600 text-lg">
                No active matches at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Archive Matches Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-8 bg-gray-400 rounded"></span>
              Archive Matches
            </h2>
            <p className="mt-1 text-gray-600">
              Past and canceled matches
            </p>
          </div>

          {archiveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-600 text-lg">
                No archive matches yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
