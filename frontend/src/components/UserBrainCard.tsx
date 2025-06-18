import { Button } from "./Buttons";
import { formatCardDate } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";

interface UserBrainCardProps {
  username: string;
  hash: string;
  createdAt: string;
}

export function UserBrainCard({ username, hash, createdAt }: UserBrainCardProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {username}'s Brain
      </h3>
      <p className="text-sm text-gray-600 mb-1">Link ID: <code>{hash}</code></p>
      <p className="text-xs text-gray-400 mb-4">Added on {formatCardDate(createdAt)}</p>
      <Button
        variant="primary"
        text="Open Brain"
        fullWidth
        onClick={() => navigate(`/brain/share/${hash}`)}
      />
    </div>
  );
}