import { useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { ShareIcon } from "../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: string;
  createdAt?: string; 
  onDelete?: () => void;
}

export function Card({ title, link, type, createdAt, onDelete }: CardProps) {
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

  return (
    <div className="w-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="text-gray-500 mr-2">
            <DocumentIcon />
          </div>
          <h2 className="text-lg font-semibold truncate">
            {title || "Untitled"}
          </h2>
        </div>
        <div className="flex items-center text-gray-500 space-x-2">
          <a href={link} target="_blank" rel="noopener noreferrer" title="Open">
            <ShareIcon />
          </a>
          <div
            className="cursor-pointer hover:text-red-500 transition"
            onClick={onDelete}
            title="Delete"
          >
            <DeleteIcon />
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {type === "youtube" && (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${new URL(link).searchParams.get("v")}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {type === "twitter" && (
          <blockquote className="twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}>{link}</a>
          </blockquote>
        )}
      </div>
      {createdAt && (
        <p className="text-sm text-gray-400 pt-2 text-left font-serif">
          Added on {new Date(createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
)}
    </div>
  );
}
