// ===================================================================
// HOROSCOPE DISPLAY ISLAND - Cosmic horoscope with dark magic vibes
// ===================================================================

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";
import { analytics } from "../utils/analytics.ts";
import { getZodiacEmoji, getZodiacSign } from "../utils/zodiac.ts";
import { COLOR_EFFECTS, VISUAL_EFFECTS } from "../utils/constants.ts";
import { MagicDropdown } from "../components/MagicDropdown.tsx";
import { TerminalDisplay } from "../components/TerminalDisplay.tsx";
import { CosmicHeader } from "../components/CosmicHeader.tsx";
import { applyColorToArt } from "../utils/colorEffects.ts";
import {
  escapeHtml,
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
  const colorEffect = useSignal("none");
  const visualEffect = useSignal("neon");
  const selectedFont = useSignal("Standard");
  const asciiOutput = useSignal("");
  const colorizedHtml = useSignal("");
  const showCustomization = useSignal(false);

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
      // Generate ASCII art with sign name as header
      const ascii = generateHoroscopeAscii(sign, text, selectedFont.value);
      asciiOutput.value = ascii;

      // Apply color effect if selected
      if (colorEffect.value !== "none") {
        const colorized = applyColorToArt(ascii, colorEffect.value);
        colorizedHtml.value = colorized;
      } else {
        colorizedHtml.value = "";
      }
    }
  }, [horoscopeData.value, selectedFont.value, colorEffect.value]);

  const fetchHoroscope = async (zodiacSign: string, period: Period) => {
    isLoading.value = true;
    try {
      const response = await fetch(
        `/api/horoscope?sign=${zodiacSign}&period=${period}`,
      );
      const data = await response.json();

      if (data.success) {
        horoscopeData.value = data.data;
        analytics.trackEvent("horoscope_viewed", { sign: zodiacSign, period });
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
    <div class="w-full min-h-screen relative flex flex-col items-center">
      {/* Main content container - max-width 1200px, centered */}
      <div class="w-full max-w-[1200px] mx-auto px-4" style="margin-top: 64px;">
        {/* Compact Header - Icon + Sign inline */}
        <CosmicHeader
          sign={sign}
          emoji={emoji}
        />

        {/* Date Range - moved below header, subtle */}
        {zodiacInfo?.dates && (
          <div
            class="text-center font-mono opacity-50"
            style="font-size: 12px; color: var(--color-text, #faf9f6); margin-bottom: 32px;"
          >
            {zodiacInfo.dates}
          </div>
        )}

        {/* Period selector - brutalist style */}
        <div
          class="flex justify-center"
          style="gap: 16px; margin-bottom: 32px;"
        >
          {["daily", "weekly", "monthly"].map((period) => {
            const isActive = currentPeriod.value === period;
            return (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                class="relative px-8 py-3 font-black font-mono text-sm uppercase tracking-wider transition-all duration-150 border-4 rounded-lg hover:scale-105 active:scale-95"
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
                  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
                `}
                aria-label={`View ${period} horoscope`}
                aria-pressed={isActive}
              >
                {period}
              </button>
            );
          })}
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
              {/* Date - 14px, muted, 24px below tabs */}
              {horoscopeData.value.date && (
                <div
                  class="text-center font-mono"
                  style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 24px;"
                >
                  {horoscopeData.value.date}
                </div>
              )}

              {/* Customization section - ABOVE terminal, collapsible */}
              <div
                class="mx-auto"
                style="width: 90%; max-width: 900px; margin-bottom: 24px;"
              >
                <div class="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      showCustomization.value = !showCustomization.value;
                      sounds.click();
                    }}
                    class="px-6 py-2 font-mono font-bold text-sm border-4 rounded-lg transition-all hover:scale-105 active:scale-95"
                    style="
                    background-color: var(--color-secondary, #1a1a1a);
                    border-color: var(--color-border, #a855f7);
                    color: var(--color-text, #faf9f6);
                    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.6);
                  "
                  >
                    {showCustomization.value ? "▲" : "▼"} Customize Effects
                  </button>

                  {/* Change Sign button - inline with customize */}
                  {onChangeSign && (
                    <button
                      onClick={onChangeSign}
                      class="px-6 py-2 font-mono font-bold text-sm border-4 rounded-lg transition-all hover:scale-105 active:scale-95"
                      style="
                      background-color: var(--color-secondary, #1a1a1a);
                      border-color: var(--color-border, #a855f7);
                      color: var(--color-text, #faf9f6);
                      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.6);
                    "
                      aria-label="Change your zodiac sign"
                    >
                      ← Change Sign
                    </button>
                  )}
                </div>

                {showCustomization.value && (
                  <div
                    class="flex justify-center flex-wrap mt-4"
                    style="gap: 16px;"
                  >
                    <MagicDropdown
                      label="Font"
                      options={FIGLET_FONTS}
                      value={selectedFont.value}
                      onChange={(val) => {
                        selectedFont.value = val;
                        sounds.click();
                      }}
                      changed={selectedFont.value !== "Standard"}
                    />
                    <MagicDropdown
                      label="Color"
                      options={COLOR_EFFECTS}
                      value={colorEffect.value}
                      onChange={(val) => {
                        colorEffect.value = val;
                        sounds.success();
                      }}
                      changed={colorEffect.value !== "none"}
                    />
                    <MagicDropdown
                      label="Effect"
                      options={VISUAL_EFFECTS}
                      value={visualEffect.value}
                      onChange={(val) => {
                        visualEffect.value = val;
                        sounds.success();
                      }}
                      changed={visualEffect.value !== "neon"}
                    />
                  </div>
                )}
              </div>

              {/* Terminal Display - 90% width, max 900px */}
              <div class="mx-auto" style="width: 90%; max-width: 900px;">
                <TerminalDisplay
                  content={asciiOutput.value}
                  htmlContent={colorizedHtml.value}
                  isLoading={isLoading.value}
                  filename={`${sign}-${currentPeriod.value}-horoscope`}
                  terminalPath={`~/cosmic/${sign}.txt`}
                  visualEffect={visualEffect.value}
                  hideExportButtons={false}
                />
              </div>

              {/* Footer - minimal */}
              <footer style="
                margin-top: 64px;
                padding: 24px 0;
                text-align: center;
              ">
                <div
                  class="font-mono opacity-40"
                  style="font-size: 12px; color: var(--color-text, #faf9f6);"
                >
                  ✨
                </div>
              </footer>
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
