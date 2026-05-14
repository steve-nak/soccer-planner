import Link from "next/link";
import { MatchWithDetails } from "@/services/matchService";

interface MatchCardProps {
  match: MatchWithDetails;
}

export function MatchCard({ match }: MatchCardProps) {
  const formattedDate = match.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = match.date.toLocaleTimeString("en-US", {
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

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-600">{formattedDate}</p>
            <p className="text-lg font-semibold text-gray-900">{formattedTime}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(match.state, match.canceled)}`}>
              {getStateLabel()}
            </span>
          </div>
        </div>

        <div className="mb-3 border-t pt-3">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Location:</span> {match.location}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Group:</span> {match.groupTitle}
          </p>
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getCapacityColor(match.capacityStatus)}`}>
                {getCapacityLabel()}
              </span>
            </div>
          </div>
          <div className="flex gap-3 text-sm text-gray-600">
            <span>💬 {match.commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
