import { normalizeYouTubeUrl } from "./ytUtils";

export const getYouTubeEmbedUrl = (rawLink: string): string | null => {
  const watchUrl = normalizeYouTubeUrl(rawLink);
  let url: URL;
  try {
    url = new URL(watchUrl);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase();
  const listId = url.searchParams.get("list");
  const videoId = url.searchParams.get("v");

  // playlist links
  const isStandardYouTube =
    hostname === "www.youtube.com" || hostname === "youtube.com";
  if (listId && isStandardYouTube) {
    return `https://www.youtube.com/embed/videoseries?list=${listId}`;
  }

  // can embed YTmusic links as well as videos
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export const loadTwitterScript = (): (() => void) => {
  const script = document.createElement("script");
  script.setAttribute("src", "https://platform.twitter.com/widgets.js");
  script.setAttribute("async", "true");
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
};

export const loadInstagramScript = (): (() => void) => {
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  document.body.appendChild(script);

  if ((window as any).instgrm?.Embeds) {
    (window as any).instgrm.Embeds.process();
  }

  return () => {
    document.body.removeChild(script);
  };
};