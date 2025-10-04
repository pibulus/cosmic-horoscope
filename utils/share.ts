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

  // Create shareable URL
  const url = `${window.location.origin}/#share=${encoded}`;

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

// Cosmic share messages
export const shareMessages = [
  "The stars spoke to me ✨",
  "My cosmic reading →",
  "Check out my horoscope →",
  "The universe has a message →",
  "Cosmic vibes incoming →",
  "My daily celestial guidance →",
  "Reading the stars →",
];

export function getRandomShareMessage(): string {
  return shareMessages[Math.floor(Math.random() * shareMessages.length)];
}
