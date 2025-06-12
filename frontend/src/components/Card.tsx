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

    let script: HTMLScriptElement | null = null;

    if (type === "instagram") {
      script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
    if (type === "instagram" && (window as any).instgrm?.Embeds) {
    (window as any).instgrm.Embeds.process();
  }

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, [type, link]);

  const getEmbedUrl = (rawLink: string) => {
    const watchUrl = normalizeYouTubeUrl(rawLink);
    const videoId = new URL(watchUrl).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <div
      className="
        w-full flex flex-col h-96
        bg-white border border-gray-200 rounded-xl
        shadow-sm p-4
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

      {/* Content - Added scrolling and height constraints to maintain card size */}
      <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
        {type === "youtube" &&
          (() => {
            const embedUrl = getEmbedUrl(link);
            return embedUrl ? (
              // Made YouTube embed smaller and contained within card
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
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
          })()}

        {type === "twitter" && (
          // Fixed height container for Twitter embeds to maintain card size
          <div className="w-full h-48 overflow-hidden">
            <blockquote className="twitter-tweet" data-theme="light">
              <a href={link.replace("x.com", "twitter.com")}>{link}</a>
            </blockquote>
          </div>
        )}

        {type === "instagram" && (
          // Fixed height container for Instagram embeds to maintain card size
          <div className="w-full h-48 overflow-hidden">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={link}
              data-instgrm-version="14"
              style={{ margin: "0 auto", maxWidth: "100%" }}
            ></blockquote>
          </div>
        )}

        {description && (
          <div className="mt-2">
            {type === "note" ? (
              // Notes get more space but still contained within card
              <div
                className="
                max-h-32 overflow-y-auto
                bg-gray-50 rounded-lg p-3
                border border-gray-200
              "
              >
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
              // Other descriptions are clamped to 3 lines to save space
              <p
                className="
                  text-sm text-gray-600 leading-relaxed
                  break-words hyphens-auto
                "
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3, // Back to 3 lines to maintain card size
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
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