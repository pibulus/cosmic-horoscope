// ===================================================================
// HOROSCOPE DISPLAY ISLAND - Cosmic horoscope with dark magic vibes
// ===================================================================

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";
import { analytics } from "../utils/analytics.ts";
import { getZodiacEmoji, getZodiacSign } from "../utils/zodiac.ts";
import { COLOR_EFFECTS } from "../utils/constants.ts";
import { MagicDropdown } from "../components/MagicDropdown.tsx";
import { TerminalDisplay } from "../components/TerminalDisplay.tsx";
import { CosmicHeader } from "../components/CosmicHeader.tsx";
import { applyColorToArt } from "../utils/colorEffects.ts";
import {
  FIGLET_FONTS,
  generateHoroscopeAscii,
} from "../utils/asciiArtGenerator.ts";

interface HoroscopeDisplayProps {
  sign: string;
  onChangeSign?: () => void;
}

type Period = "daily" | "weekly" | "monthly";

export default function HoroscopeDisplay(
  { sign, onChangeSign }: HoroscopeDisplayProps,
) {
  const currentPeriod = useSignal<Period>("daily");
  const horoscopeData = useSignal<any>(null);
  const isLoading = useSignal(false);
  const colorEffect = useSignal("sunrise");
  const visualEffect = useSignal("neon"); // Hard-coded to neon
  const selectedFont = useSignal("Standard");
  const asciiOutput = useSignal("");
  const colorizedHtml = useSignal("");

  // Initialize analytics
  useEffect(() => {
    analytics.init();
  }, []);

  // Fetch horoscope when sign or period changes
  useEffect(() => {
    if (sign) {
      fetchHoroscope(sign, currentPeriod.value);
    }
  }, [sign, currentPeriod.value]);

  // Generate ASCII art when horoscope data or font changes
  useEffect(() => {
    if (horoscopeData.value?.horoscope_data) {
      const text = horoscopeData.value.horoscope_data;
      const date = horoscopeData.value.date || "";
      // Generate ASCII art with sign name, period, and date
      const ascii = generateHoroscopeAscii(
        sign,
        text,
        selectedFont.value,
        currentPeriod.value,
        date,
      );
      asciiOutput.value = ascii;

      // Always apply special header formatting
      // Even with no color effect, header gets golden color
      if (colorEffect.value !== "none") {
        const colorized = applyColorToArt(ascii, colorEffect.value);
        colorizedHtml.value = colorized;
      } else {
        // No color effect: still highlight header in gold
        const colorized = applyHeaderHighlight(ascii);
        colorizedHtml.value = colorized;
      }
    }
  }, [horoscopeData.value, selectedFont.value, colorEffect.value]);

  // Helper function to highlight header even without color effects
  const applyHeaderHighlight = (art: string): string => {
    const lines = art.split("\n");
    const colorizedLines: string[] = [];
    let inHeader = false;

    for (const line of lines) {
      if (line.includes("[HEADER_START]")) {
        inHeader = true;
        continue;
      }
      if (line.includes("[HEADER_END]")) {
        inHeader = false;
        continue;
      }

      if (inHeader) {
        // Header in gold/yellow
        colorizedLines.push(
          `<span style="color: #FFD700; font-weight: 900; letter-spacing: 0.1em;">${line}</span>`,
        );
      } else if (line.trim()) {
        // Body in terminal green
        colorizedLines.push(`<span style="color: #00FF41;">${line}</span>`);
      } else {
        colorizedLines.push(line);
      }
    }

    return colorizedLines.join("\n");
  };

  const fetchHoroscope = async (zodiacSign: string, period: Period) => {
    isLoading.value = true;
    try {
      const response = await fetch(
        `/api/horoscope?sign=${zodiacSign}&period=${period}`,
      );
      const data = await response.json();

      if (data.success) {
        horoscopeData.value = data.data;
        analytics.trackHoroscopeViewed(zodiacSign, period, colorEffect.value);
        sounds.success();
      } else {
        console.error("Horoscope fetch failed:", data.error);
        sounds.error();
      }
    } catch (error) {
      console.error("Failed to fetch horoscope:", error);
      sounds.error();
    } finally {
      isLoading.value = false;
    }
  };

  const handlePeriodChange = (period: string) => {
    currentPeriod.value = period as Period;
  };

  const zodiacInfo = getZodiacSign(sign);
  const emoji = getZodiacEmoji(sign);

  return (
    <div class="w-full relative flex flex-col items-center">
      {/* Main content container - max-width 1200px, centered */}
      <div
        class="w-full max-w-[1200px] mx-auto px-2 sm:px-4"
        style="padding-bottom: 60px;"
      >
        <style>
          {`
            @media (min-width: 640px) {
              .w-full.max-w-\\[1200px\\] {
                padding-bottom: 120px !important;
              }
            }
          `}
        </style>
        {/* Period selector + Color control - Compact horizontal row */}
        <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-8">
          {/* Period buttons - Compact on mobile */}
          {[
            { period: "daily", emoji: "📅" },
            { period: "weekly", emoji: "🗓️" },
            { period: "monthly", emoji: "📆" },
          ].map(({ period, emoji }) => {
            const isActive = currentPeriod.value === period;
            return (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                class="relative flex-shrink-0 px-3 sm:px-8 py-2 sm:py-3 font-black font-mono text-[10px] sm:text-sm uppercase tracking-wide sm:tracking-wider transition-all duration-150 border-3 sm:border-4 rounded-lg hover:scale-105 active:scale-95"
                style={`
                  background-color: ${
                  isActive
                    ? "var(--color-accent, #a855f7)"
                    : "var(--color-secondary, #1a1a1a)"
                };
                  border-color: ${
                  isActive
                    ? "var(--color-text, #faf9f6)"
                    : "var(--color-border, #a855f7)"
                };
                  color: var(--color-text, #faf9f6);
                  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
                `}
                aria-label={`View ${period} horoscope`}
                aria-pressed={isActive}
              >
                <span class="mr-1">{emoji}</span>
                {period}
              </button>
            );
          })}

          {/* Color control - Now fits in same row on mobile */}
          <MagicDropdown
            label="Color"
            options={COLOR_EFFECTS}
            value={colorEffect.value}
            onChange={(val) => {
              colorEffect.value = val;
              sounds.success();
            }}
            changed={colorEffect.value !== "sunrise"}
          />
        </div>

        {/* Horoscope content */}
        {isLoading.value
          ? (
            <div class="text-center" style="padding: 64px 0;">
              <div
                class="text-6xl mb-6 animate-pulse"
                style="animation: glow-pulse 2s ease-in-out infinite;"
              >
                ✨
              </div>
              <p style="color: rgba(255, 255, 255, 0.6); font-size: 18px;">
                Reading the stars...
              </p>
            </div>
          )
          : horoscopeData.value
          ? (
            <div>
              {/* Terminal Display - Responsive width with breathing room */}
              <div class="mx-auto terminal-container">
                <style>
                  {`
                    .terminal-container {
                      width: 95%;
                      max-width: 900px;
                    }
                    @media (min-width: 640px) {
                      .terminal-container {
                        width: 90%;
                      }
                    }
                    @media (min-width: 1024px) {
                      .terminal-container {
                        width: 85%;
                      }
                    }
                  `}
                </style>
                <TerminalDisplay
                  content={asciiOutput.value}
                  htmlContent={colorizedHtml.value}
                  isLoading={isLoading.value}
                  filename={`${sign}-${currentPeriod.value}-${
                    horoscopeData.value.date
                      ? horoscopeData.value.date.toLowerCase().replace(
                        /[\s,]+/g,
                        "-",
                      )
                      : "horoscope"
                  }`}
                  terminalPath={`~/cosmic/${sign}.txt`}
                  visualEffect={visualEffect.value}
                  hideExportButtons={false}
                />
              </div>
            </div>
          )
          : (
            <div class="text-center py-32 text-purple-400">
              <p class="text-xl">No horoscope data available</p>
            </div>
          )}
      </div>
    </div>
  );
}
