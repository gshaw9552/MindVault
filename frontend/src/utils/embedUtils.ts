import { normalizeYouTubeUrl } from "./ytUtils";

export const getYouTubeEmbedUrl = (rawLink: string): string | null => {
  const watchUrl = normalizeYouTubeUrl(rawLink);
  const videoId = new URL(watchUrl).searchParams.get("v");
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

  // Process Instagram embeds if available
  if ((window as any).instgrm?.Embeds) {
    (window as any).instgrm.Embeds.process();
  }

  return () => {
    document.body.removeChild(script);
  };
};