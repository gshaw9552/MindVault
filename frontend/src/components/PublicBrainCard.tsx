import { formatCardDate } from "../utils/dateUtils";
import { Button } from "./Buttons";
import { LightBulb } from "../icons/LightBulb";

interface PublicBrainCardProps {
  username: string;
  hash: string;
  createdAt: string;
  onOpenBrain: (hash: string) => void;
}

export function PublicBrainCard({
  username,
  hash,
  createdAt,
  onOpenBrain,
}: PublicBrainCardProps) {
  return (
    <div className="w-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header with Brain Icon */}
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
          <div className="w-5 h-5 text-purple-600">
            <LightBulb />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {username}'s Brain
          </h3>
        </div>
      </div>

      {/* Hash Display */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 font-mono bg-gray-50 rounded px-2 py-1 break-all">
          {hash}
        </p>
      </div>

      {/* Date */}
      <div className="mb-6 flex-1">
        <p className="text-xs text-gray-400">
          Added on {formatCardDate(createdAt)}
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <Button
          onClick={() => onOpenBrain(hash)}
          variant="primary"
          text="Open Brain"
          fullWidth
        />
      </div>
    </div>
  );
}