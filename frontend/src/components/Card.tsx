import { useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { ShareIcon } from "../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: string;
  createdAt?: string;
  description?: string;
  onDelete?: () => void;
}

export function Card({
  title,
  link,
  type,
  description,
  createdAt,
  onDelete,
}: CardProps) {

  useEffect(() => {
    if (type === "twitter") {
      const script = document.createElement("script");
      script.setAttribute("src", "https://platform.twitter.com/widgets.js");
      script.setAttribute("async", "true");
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [type, link]);

  return (
    <div
      className="
        w-full flex flex-col h-full
        bg-white border border-gray-200 rounded-xl
        shadow-sm p-4
        min-h-0
      "
    >
      {/* Header - Improved responsive layout */}
      <div className="flex justify-between items-start gap-3 mb-4">
        {/* Left side - Icon and Title with proper constraints */}
        <div className="flex items-start min-w-0 flex-1">
          {/* Icon container with fixed dimensions */}
          <div className="text-gray-500 mr-2 flex-shrink-0 w-5 h-5 mt-0.5">
            <DocumentIcon />
          </div>
          {/* Title with proper text handling */}
          <h2 
            className="text-lg font-semibold text-gray-900 leading-tight break-words hyphens-auto" 
            title={title}
            style={{ 
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: '1.4'
            }}
          >
            {title || "Untitled"}
          </h2>
        </div>

        {/* Right side - Action buttons with fixed positioning */}
        <div className="flex items-center text-gray-500 gap-1 flex-shrink-0">
          {/* Share button with consistent sizing */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title="Open"
            className="
              flex-shrink-0 p-1 rounded-md
              hover:bg-gray-100 hover:text-gray-700
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-purple-300
            "
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <ShareIcon />
            </div>
          </a>
          
          {/* Delete button with consistent sizing */}
          <button
            onClick={onDelete}
            title="Delete"
            className="
              flex-shrink-0 p-1 rounded-md
              hover:bg-red-50 hover:text-red-500
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-red-300
            "
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <DeleteIcon />
            </div>
          </button>
        </div>
      </div>

      {/* Content area with proper overflow handling */}
      <div className="flex-1 space-y-4 min-h-0 overflow-hidden">
        {/* YouTube embed with responsive aspect ratio */}
        {type === "youtube" && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${new URL(link).searchParams.get("v")}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}

        {/* Twitter embed with container constraints */}
        {type === "twitter" && (
          <div className="w-full overflow-hidden">
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}>{link}</a>
            </blockquote>
          </div>
        )}

        {/* Description with conditional display based on type */}
        {description && (
          <div className="mt-2">
            {/* For Note type - show full description with scroll */}
            {type === "note" ? (
              <div className="
                max-h-64 overflow-y-auto
                bg-gray-50 rounded-lg p-3
                border border-gray-200
              ">
                <p className="
                  text-sm text-gray-700 leading-relaxed
                  break-words hyphens-auto whitespace-pre-wrap
                "
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}>
                  {description}
                </p>
              </div>
            ) : (
              /* For other types - show limited description with line clamp */
              <p className="
                text-sm text-gray-600 leading-relaxed
                break-words hyphens-auto
                overflow-hidden
              "
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer with date - positioned at bottom */}
      {createdAt && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-left">
            Added on{" "}
            {new Date(createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}