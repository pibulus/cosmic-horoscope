// ===================================================================
// HOROSCOPE API - Proxy to horoscope API with timezone handling
// ===================================================================
// Fetches daily/weekly/monthly horoscopes from external API
// Handles timezone conversion for Melbourne (15-16hrs ahead of US)

import { FreshContext } from "$fresh/server.ts";

const HOROSCOPE_API_BASE =
  "https://horoscope-app-api.vercel.app/api/v1/get-horoscope";

// Zodiac signs (validated)
const VALID_SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

interface HoroscopeParams {
  sign: string;
  period: "daily" | "weekly" | "monthly";
  day?: string; // For daily only: "today" | "tomorrow" | "yesterday" | "YYYY-MM-DD"
}

/**
 * Determine correct day parameter for API based on Melbourne timezone
 * Melbourne is 15-16 hours ahead of US (where API is hosted)
 *
 * Logic:
 * - Before 6pm Melbourne → Use "tomorrow" (Melbourne is ahead)
 * - After 6pm Melbourne → Use "today" (calendars sync up)
 */
function getDayParamForTimezone(): string {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 18) {
    // Morning/afternoon Melbourne = ahead of US, use "tomorrow"
    return "tomorrow";
  } else {
    // Evening Melbourne = same calendar day as US, use "today"
    return "today";
  }
}

export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const url = new URL(req.url);
  const sign = url.searchParams.get("sign")?.toLowerCase();
  const period =
    url.searchParams.get("period") as "daily" | "weekly" | "monthly" || "daily";
  const customDay = url.searchParams.get("day"); // Optional override

  // Validate sign
  if (!sign || !VALID_SIGNS.includes(sign)) {
    return new Response(
      JSON.stringify({
        error: "Invalid zodiac sign",
        validSigns: VALID_SIGNS,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Build API URL based on period
  let apiUrl = "";
  const params = new URLSearchParams({ sign });

  if (period === "daily") {
    // Use custom day or auto-detect timezone
    const day = customDay || getDayParamForTimezone();
    params.append("day", day);
    apiUrl = `${HOROSCOPE_API_BASE}/daily?${params}`;
  } else if (period === "weekly") {
    apiUrl = `${HOROSCOPE_API_BASE}/weekly?${params}`;
  } else if (period === "monthly") {
    apiUrl = `${HOROSCOPE_API_BASE}/monthly?${params}`;
  } else {
    return new Response(
      JSON.stringify({
        error: "Invalid period. Must be: daily, weekly, or monthly",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Fetch from horoscope API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Return the horoscope data
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      },
    );
  } catch (error) {
    console.error("Horoscope API error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch horoscope",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
