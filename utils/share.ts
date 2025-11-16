// Share functionality - Pablo style
// "No integrations, just URLs that work"

export function generateShareableHoroscope(
  horoscope: string,
  sign: string,
  effect: string,
): string {
  // Create a shareable URL with the horoscope encoded
  const data = {
    horoscope: horoscope.substring(0, 5000), // Limit for URL safety
    sign,
    effect,
    ts: Date.now(),
    v: "1.0",
  };

  // Simple base64 encoding
  const encoded = btoa(JSON.stringify(data));

  // Create shareable URL (support SSR/globalThis environments)
  const locationObj = typeof globalThis !== "undefined" &&
      typeof (globalThis as { location?: Location }).location !== "undefined"
    ? (globalThis as { location?: Location }).location
    : undefined;
  const origin = locationObj?.origin ?? "";
  const url = origin ? `${origin}/#share=${encoded}` : `/#share=${encoded}`;

  return url;
}

export function parseSharedHoroscope(
  hash: string,
): { horoscope: string; sign: string; effect: string } | null {
  if (!hash.startsWith("#share=")) return null;

  try {
    const encoded = hash.replace("#share=", "");
    const decoded = atob(encoded);
    const data = JSON.parse(decoded);

    return {
      horoscope: data.horoscope,
      sign: data.sign,
      effect: data.effect,
    };
  } catch {
    return null;
  }
}

// Cosmic share messages (e-girl grind fiction energy)
export const shareMessages = [
  "The stars said what now? →",
  "My cosmic read →",
  "Horoscope hit different today →",
  "Universe dropped this →",
  "Cosmic vibes check →",
  "Reading came through →",
  "Stars really said this →",
];

export function getRandomShareMessage(): string {
  return shareMessages[Math.floor(Math.random() * shareMessages.length)];
}
