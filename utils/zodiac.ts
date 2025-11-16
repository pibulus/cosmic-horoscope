// ===================================================================
// ZODIAC UTILITIES - Sign data, emojis, and localStorage
// ===================================================================

export interface ZodiacSign {
  name: string;
  emoji: string;
  dates: string;
  element: "fire" | "earth" | "air" | "water";
  bio: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "aries",
    emoji: "♈",
    dates: "Mar 21 - Apr 19",
    element: "fire",
    bio: "Impulsive firestarter who thrives on first moves, dares, and impossible bets.",
  },
  {
    name: "taurus",
    emoji: "♉",
    dates: "Apr 20 - May 20",
    element: "earth",
    bio: "Earthy sensualist—loyal, grounded, and forever chasing tactile luxury.",
  },
  {
    name: "gemini",
    emoji: "♊",
    dates: "May 21 - Jun 20",
    element: "air",
    bio: "Split-signal trickster who lives for gossip, beta builds, and hot takes.",
  },
  {
    name: "cancer",
    emoji: "♋",
    dates: "Jun 21 - Jul 22",
    element: "water",
    bio: "Lunar caretaker with moods synced to the tides and playlists full of feelings.",
  },
  {
    name: "leo",
    emoji: "♌",
    dates: "Jul 23 - Aug 22",
    element: "fire",
    bio: "Solar performer, gold-trim maximalist, and perpetual hype engine.",
  },
  {
    name: "virgo",
    emoji: "♍",
    dates: "Aug 23 - Sep 22",
    element: "earth",
    bio: "Precision analyst turning chaos into clean checklists and clever systems.",
  },
  {
    name: "libra",
    emoji: "♎",
    dates: "Sep 23 - Oct 22",
    element: "air",
    bio: "Charm dealer balancing beauty, diplomacy, and curated drama.",
  },
  {
    name: "scorpio",
    emoji: "♏",
    dates: "Oct 23 - Nov 21",
    element: "water",
    bio: "Psychic hacker who reads motives, guards secrets, and loves transformation.",
  },
  {
    name: "sagittarius",
    emoji: "♐",
    dates: "Nov 22 - Dec 21",
    element: "fire",
    bio: "Galactic explorer chasing horizons, spicy takes, and unfiltered freedom.",
  },
  {
    name: "capricorn",
    emoji: "♑",
    dates: "Dec 22 - Jan 19",
    element: "earth",
    bio: "Saturnian builder stacking legacy moves, status mountains, and spreadsheets.",
  },
  {
    name: "aquarius",
    emoji: "♒",
    dates: "Jan 20 - Feb 18",
    element: "air",
    bio: "Future-wave inventor remixing systems with rebellious humanitarian code.",
  },
  {
    name: "pisces",
    emoji: "♓",
    dates: "Feb 19 - Mar 20",
    element: "water",
    bio: "Dream-diver translating cosmic feelings into art, playlists, and poetry.",
  },
];

const STORAGE_KEY = "cosmic_zodiac_sign";

/**
 * Get zodiac sign data by name
 */
export function getZodiacSign(name: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((sign) => sign.name === name.toLowerCase());
}

/**
 * Get emoji for a zodiac sign
 */
export function getZodiacEmoji(name: string): string {
  const sign = getZodiacSign(name);
  return sign?.emoji || "✨";
}

/**
 * Save user's zodiac sign to localStorage
 */
export function saveZodiacSign(sign: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, sign.toLowerCase());
}

/**
 * Get user's saved zodiac sign from localStorage
 */
export function getSavedZodiacSign(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Clear saved zodiac sign
 */
export function clearSavedZodiacSign(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Validate if a string is a valid zodiac sign
 */
export function isValidZodiacSign(sign: string): boolean {
  return ZODIAC_SIGNS.some((z) => z.name === sign.toLowerCase());
}
