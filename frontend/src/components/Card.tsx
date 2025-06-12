import { useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { CardProps } from "../types/cardTypes";
import { getCardTypeConfig } from "../config/cardConfig";
import { loadTwitterScript, loadInstagramScript } from "../utils/embedUtils";
import { formatCardDate } from "../utils/dateUtils";
import { CardContent } from "./CardContent";
import { UploadIcon } from "../icons/UploadIcon";

export function Card({
  title,
  link,
  type,
  description,
  createdAt,
  onDelete,
}: CardProps) {
  const config = getCardTypeConfig(type);
  const IconComponent = config.icon;

  // Handle script loading for embeds
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (type === "twitter") {
      cleanup = loadTwitterScript();
    } else if (type === "instagram") {
      cleanup = loadInstagramScript();
    }

    return cleanup;
  }, [type, link]);

  return (
    <div className="w-full flex flex-col h-96 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex items-start min-w-0 flex-1">
          <div className={`mr-2 flex-shrink-0 w-5 h-5 mt-0.5 ${config.color}`}>
            <IconComponent />
          </div>
          <h2
            className="text-lg font-semibold text-gray-900 leading-tight break-words hyphens-auto"
            title={title}
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              lineHeight: "1.4",
            }}
          >
            {title || "Untitled"}
          </h2>
        </div>
        
        <div className="flex items-center text-gray-500 gap-1 flex-shrink-0">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title="Open"
            className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <UploadIcon />
            </div>
          </a>
          <button
            onClick={onDelete}
            title="Delete"
            className="flex-shrink-0 p-1 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <DeleteIcon />
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <CardContent type={type} link={link} description={description} />

      {/* Footer */}
      {createdAt && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-left">
            Added on {formatCardDate(createdAt)}
          </p>
        </div>
      )}
    </div>
  );
}