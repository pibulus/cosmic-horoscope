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
import { generateHoroscopeAscii, FIGLET_FONTS, escapeHtml } from "../utils/asciiArtGenerator.ts";

interface HoroscopeDisplayProps {
  sign: string;
  onChangeSign?: () => void;
}

type Period = "daily" | "weekly" | "monthly";

export default function HoroscopeDisplay({ sign, onChangeSign }: HoroscopeDisplayProps) {
  const currentPeriod = useSignal<Period>("daily");
  const horoscopeData = useSignal<any>(null);
  const isLoading = useSignal(false);
  const colorEffect = useSignal("none");
  const visualEffect = useSignal("neon");
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
      const response = await fetch(`/api/horoscope?sign=${zodiacSign}&period=${period}`);
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
      <div class="w-full max-w-[1200px] mx-auto px-4" style="margin-top: 96px;">

        {/* Flat Header - Icon, Sign, Dates */}
        <CosmicHeader
          sign={sign}
          emoji={emoji}
          dates={zodiacInfo?.dates}
        />

        {/* Period selector - 48px below header */}
        <div class="flex justify-center" style="gap: 16px; margin-bottom: 24px;">
          {["daily", "weekly", "monthly"].map((period, index) => {
            const isActive = currentPeriod.value === period;
            return (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                class={`
                  relative px-8 py-4 font-black text-base uppercase tracking-wider
                  magnetic brutal-shadow
                  transition-all duration-200
                  ${isActive
                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white border-pink-400"
                    : "bg-black/70 backdrop-blur text-purple-300 border-purple-500/50 hover:border-purple-400"
                  }
                `}
                style={`
                  border-width: 3px;
                  animation: stagger-in 0.4s ease-out backwards;
                  animation-delay: ${index * 0.1}s;
                  ${isActive ? "box-shadow: 5px 5px 0 rgba(236, 72, 153, 0.6), 0 0 30px rgba(236, 72, 153, 0.4);" : ""}
                `}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.transform = "translate(-2px, -2px) scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = "";
                }}
                onMouseDown={(e) => {
                  (e.target as HTMLElement).style.transform = "translate(2px, 2px) scale(0.98)";
                }}
                onMouseUp={(e) => {
                  (e.target as HTMLElement).style.transform = "";
                }}
                aria-label={`View ${period} horoscope`}
                aria-pressed={isActive}
              >
                {period}

                {/* Active indicator underline */}
                {isActive && (
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-purple-400"
                    style="animation: slide-underline 0.3s ease-out;"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Horoscope content */}
        {isLoading.value ? (
          <div class="text-center" style="padding: 64px 0;">
            <div class="text-6xl mb-6 animate-pulse" style="animation: glow-pulse 2s ease-in-out infinite;">
              ✨
            </div>
            <p style="color: rgba(255, 255, 255, 0.6); font-size: 18px;">Reading the stars...</p>
          </div>
        ) : horoscopeData.value ? (
          <div>
            {/* Date - 14px, muted, 24px below tabs */}
            {horoscopeData.value.date && (
              <div class="text-center font-mono" style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 64px;">
                {horoscopeData.value.date}
              </div>
            )}

            {/* Terminal Display - 90% width, max 900px */}
            <div class="mx-auto" style="width: 90%; max-width: 900px; margin-bottom: 24px;">
              <TerminalDisplay
                content={asciiOutput.value}
                htmlContent={colorizedHtml.value}
                isLoading={isLoading.value}
                filename={`${sign}-${currentPeriod.value}-horoscope`}
                terminalPath={`~/cosmic/${sign}.txt`}
                visualEffect={visualEffect.value}
              />
            </div>

            {/* Customization dropdowns - NO LABEL, 48px below terminal */}
            <div class="mx-auto" style="width: 90%; max-width: 900px; margin-top: 48px;">
              <div class="flex justify-center flex-wrap" style="gap: 24px;">
                <MagicDropdown
                  label="ASCII Font"
                  options={FIGLET_FONTS}
                  value={selectedFont.value}
                  onChange={(val) => {
                    selectedFont.value = val;
                    sounds.click();
                  }}
                  changed={selectedFont.value !== "Standard"}
                />
                <MagicDropdown
                  label="Color Gradient"
                  options={COLOR_EFFECTS}
                  value={colorEffect.value}
                  onChange={(val) => {
                    colorEffect.value = val;
                    sounds.success();
                  }}
                  changed={colorEffect.value !== "none"}
                />
                <MagicDropdown
                  label="Visual Effect"
                  options={VISUAL_EFFECTS}
                  value={visualEffect.value}
                  onChange={(val) => {
                    visualEffect.value = val;
                    sounds.success();
                  }}
                  changed={visualEffect.value !== "neon"}
                />
              </div>
            </div>

            {/* Change Sign button - 48px below dropdowns, HUGE */}
            {onChangeSign && (
              <div class="flex justify-center" style="margin-top: 48px;">
                <button
                  onClick={onChangeSign}
                  class="rounded-2xl font-black uppercase tracking-wider magnetic brutal-shadow transition-all duration-200 bg-gradient-to-br from-pink-500 to-purple-600 text-white border-pink-400"
                  style="
                    height: 64px;
                    width: 280px;
                    font-size: 20px;
                    border-width: 4px;
                    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.8), 0 0 30px rgba(236, 72, 153, 0.5);
                  "
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.transform = "translate(-3px, -3px) scale(1.05)";
                    (e.target as HTMLElement).style.boxShadow = "9px 9px 0 rgba(0, 0, 0, 0.8), 0 0 40px rgba(236, 72, 153, 0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = "";
                    (e.target as HTMLElement).style.boxShadow = "6px 6px 0 rgba(0, 0, 0, 0.8), 0 0 30px rgba(236, 72, 153, 0.5)";
                  }}
                  onMouseDown={(e) => {
                    (e.target as HTMLElement).style.transform = "translate(3px, 3px) scale(0.98)";
                    (e.target as HTMLElement).style.boxShadow = "3px 3px 0 rgba(0, 0, 0, 0.8)";
                  }}
                  onMouseUp={(e) => {
                    (e.target as HTMLElement).style.transform = "translate(-3px, -3px) scale(1.05)";
                    (e.target as HTMLElement).style.boxShadow = "9px 9px 0 rgba(0, 0, 0, 0.8), 0 0 40px rgba(236, 72, 153, 0.7)";
                  }}
                  aria-label="Change your zodiac sign"
                >
                  ✨ CHANGE SIGN
                </button>
              </div>
            )}

            {/* Footer - 96px below button */}
            <footer
              style="
                margin-top: 96px;
                height: 64px;
                border-top: 3px solid #a855f7;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div style="font-size: 14px; color: #ffffff;">
                Made with cosmic vibes ✨
              </div>
            </footer>
          </div>
        ) : (
          <div class="text-center py-32 text-purple-400">
            <p class="text-xl">No horoscope data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
