import React from "react";
import { CardType } from "../types/cardTypes";
import { getCardTypeConfig } from "../config/cardConfig";
import { getYouTubeEmbedUrl } from "../utils/embedUtils";

interface CardContentProps {
  type: CardType;
  link: string;
  description?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ type, link, description }) => {
  const renderYouTubeEmbed = () => {
    const embedUrl = getYouTubeEmbedUrl(link);
    return embedUrl ? (
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
  };

  const renderTwitterEmbed = () => (
    <div className="w-full h-48 overflow-hidden">
      <blockquote className="twitter-tweet" data-theme="light">
        <a href={link.replace("x.com", "twitter.com")}>{link}</a>
      </blockquote>
    </div>
  );

  const renderInstagramEmbed = () => (
    <div className="w-full h-48 overflow-hidden">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={link}
        data-instgrm-version="14"
        style={{ margin: "0 auto", maxWidth: "100%" }}
      />
    </div>
  );

  const renderLinkPreview = () => {
    const config = getCardTypeConfig(type);
    const IconComponent = config.icon;
    
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className={`w-12 h-12 mx-auto mb-3 ${config.color}`}>
            <IconComponent />
          </div>
          <p className="text-sm font-medium text-gray-600">{config.label}</p>
          <p className="text-xs text-gray-400 mt-1">Click to open</p>
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    if (!description) return null;

    if (type === "note") {
      return (
        <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p
            className="text-sm text-gray-700 leading-relaxed break-words hyphens-auto whitespace-pre-wrap"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {description}
          </p>
        </div>
      );
    }

    return (
      <p
        className="text-sm text-gray-600 leading-relaxed break-words hyphens-auto"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {description}
      </p>
    );
  };

  return (
    <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
      {type === "youtube" && renderYouTubeEmbed()}
      {type === "twitter" && renderTwitterEmbed()}
      {type === "instagram" && renderInstagramEmbed()}
      {(type === "music" || type === "link") && renderLinkPreview()}
      {description && <div className="mt-2">{renderDescription()}</div>}
    </div>
  );
};