export function normalizeYouTubeUrl(raw: string): string {
  try {
    const url = new URL(raw);

    // 1) youtu.be short links
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.slice(1);
      return `https://www.youtube.com/watch?v=${id}`;
    }

    // 2) shorts URLs
    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/")[2];
      return `https://www.youtube.com/watch?v=${id}`;
    }

    // 3) already a watch URL (also covers embed URLs)
    return raw;
  } catch {
    // return invalid URL as it is
    return raw;
  }
}
