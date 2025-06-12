import { useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { normalizeYouTubeUrl } from "../utils";

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
  // Dynamically load Twitter script for tweet embedding
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

  // Helper to get YouTube embed URL, handling /shorts/ and youtu.be links
  const getEmbedUrl = (rawLink: string) => {
    const watchUrl = normalizeYouTubeUrl(rawLink);
    const videoId = new URL(watchUrl).searchParams.get("v");
    return videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : null;
  };

  return (
    <div
      className="
        w-full flex flex-col h-full
        bg-white border border-gray-200 rounded-xl
        shadow-sm p-4
        min-h-0
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex items-start min-w-0 flex-1">
          <div className="text-gray-500 mr-2 flex-shrink-0 w-5 h-5 mt-0.5">
            <DocumentIcon />
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

      {/* Content */}
      <div className="flex-1 space-y-4 min-h-0 overflow-hidden">
        {type === "youtube" && (
          (() => {
            const embedUrl = getEmbedUrl(link);
            return embedUrl ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-red-500">Invalid YouTube URL</p>
            );
          })()
        )}

        {type === "twitter" && (
          <div className="w-full overflow-hidden">
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}>{link}</a>
            </blockquote>
          </div>
        )}

        {description && (
          <div className="mt-2">
            {type === "note" ? (
              <div className="
                max-h-64 overflow-y-auto
                bg-gray-50 rounded-lg p-3
                border border-gray-200
              ">
                <p
                  className="
                    text-sm text-gray-700 leading-relaxed
                    break-words hyphens-auto whitespace-pre-wrap
                  "
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {description}
                </p>
              </div>
            ) : (
              <p
                className="
                  text-sm text-gray-600 leading-relaxed
                  break-words hyphens-auto
                  overflow-hidden
                "
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
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
