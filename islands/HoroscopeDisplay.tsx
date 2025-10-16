// ===================================================================
// HOROSCOPE DISPLAY ISLAND - Cosmic horoscope with dark magic vibes
// ===================================================================

import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";
import { analytics } from "../utils/analytics.ts";
import { getZodiacEmoji, getZodiacSign } from "../utils/zodiac.ts";
import { COLOR_EFFECTS } from "../utils/constants.ts";
import { MagicDropdown } from "../components/MagicDropdown.tsx";
import { TerminalDisplay } from "../components/TerminalDisplay.tsx";
import { CosmicHeader } from "../components/CosmicHeader.tsx";
import { applyColorToArt } from "../utils/colorEffects.ts";
import { generateHoroscopeAscii } from "../utils/asciiArtGenerator.ts";

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
  const isBootingUp = useSignal(false);
  const bootComplete = useSignal(false);
  const bootMessages = useSignal<string[]>([]);
  const colorEffect = useSignal("sunrise");
  const visualEffect = useSignal("neon"); // Hard-coded to neon
  const asciiOutput = useSignal("");
  const colorizedHtml = useSignal("");
  const requestIdRef = useRef(0);
  const activeController = useRef<AbortController | null>(null);
  const errorMessage = useSignal<string | null>(null);

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
  }, [horoscopeData.value, colorEffect.value]);

  // Helper function to highlight header even without color effects
  const escapeHtml = (value: string): string =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

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
          `<span style="color: #FFD700; font-weight: 900; letter-spacing: 0.1em;">${
            escapeHtml(line)
          }</span>`,
        );
      } else if (line.trim()) {
        // Body in terminal green
        colorizedLines.push(
          `<span style="color: #00FF41;">${escapeHtml(line)}</span>`,
        );
      } else {
        colorizedLines.push(line);
      }
    }

    return colorizedLines.join("\n");
  };

  const fetchHoroscope = async (zodiacSign: string, period: Period) => {
    // Abort any in-flight request before starting a new one
    if (activeController.current) {
      activeController.current.abort();
    }
    const controller = new AbortController();
    activeController.current = controller;
    const requestToken = ++requestIdRef.current;

    // Start boot sequence
    isBootingUp.value = true;
    bootComplete.value = false;
    errorMessage.value = null;
    bootMessages.value = [];

    // Array of different boot sequences for variety
    const bootSequences = [
      // 1. Technical (original)
      [
        "> Establishing link to Celestial Mainframe...",
        "> Signal lock: ACQUIRED",
        `> Decrypting transmission for [${zodiacSign.toUpperCase()}]...`,
        "> LOADING...",
      ],
      // 2. Mystical
      [
        "> Consulting the astral records...",
        "> Planetary alignment: VERIFIED",
        `> Channeling cosmic wisdom for [${zodiacSign.toUpperCase()}]...`,
        "> RECEIVING...",
      ],
      // 3. Cyberpunk
      [
        "> Jacking into the zodiac matrix...",
        "> Neural link: ESTABLISHED",
        `> Decrypting star data for [${zodiacSign.toUpperCase()}]...`,
        "> DOWNLOADING...",
      ],
      // 4. Retro Sci-Fi
      [
        "> Contacting mothership...",
        "> Transmission received",
        `> Decoding celestial message for [${zodiacSign.toUpperCase()}]...`,
        "> PROCESSING...",
      ],
      // 5. Casual/Cheeky
      [
        "> Waking up the fortune teller...",
        "> Cosmic vibes: STRONG",
        `> Reading the stars for [${zodiacSign.toUpperCase()}]...`,
        "> BREWING...",
      ],
      // 6. Hacker
      [
        "> Breaching cosmic firewall...",
        "> Root access: GRANTED",
        `> Extracting horoscope data for [${zodiacSign.toUpperCase()}]...`,
        "> COMPILING...",
      ],
    ];

    // Randomly pick a boot sequence
    const selectedBootMessages = bootSequences[Math.floor(Math.random() * bootSequences.length)];
    bootMessages.value = selectedBootMessages;

    // Type out boot messages with delays
    for (let i = 0; i < selectedBootMessages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (controller.signal.aborted || requestToken !== requestIdRef.current) {
        return;
      }
      sounds.click();
      bootMessages.value = selectedBootMessages.slice(0, i + 1);
    }

    // Wait a moment before starting fetch
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (controller.signal.aborted || requestToken !== requestIdRef.current) {
      return;
    }

    // Boot complete, start actual fetch
    isBootingUp.value = false;
    bootComplete.value = true;
    isLoading.value = true;

    try {
      const response = await fetch(
        `/api/horoscope?sign=${zodiacSign}&period=${period}`,
        { signal: controller.signal },
      );
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      const data = await response.json();

      if (controller.signal.aborted || requestToken !== requestIdRef.current) {
        return;
      }

      if (data.success) {
        horoscopeData.value = data.data;
        analytics.trackHoroscopeViewed(zodiacSign, period, colorEffect.value);
        sounds.success();
      } else {
        console.error("Horoscope fetch failed:", data.error);
        sounds.error();
        horoscopeData.value = null;
        asciiOutput.value = "";
        colorizedHtml.value = "";
        // Random error messages with personality
        const errorMessages = [
          "⚠️ TRANSMISSION CORRUPTED — The stars sent back static. Retry?",
          "❌ LINK SEVERED — Cosmic firewall blocked the vibes. Try again?",
          "⚡ SIGNAL LOST — Mothership went dark. Reconnect?",
          "🔮 DIVINATION FAILED — The universe hung up on us. One more time?",
        ];
        errorMessage.value = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      }
    } catch (error) {
      if (controller.signal.aborted || requestToken !== requestIdRef.current) {
        return;
      }
      console.error("Failed to fetch horoscope:", error);
      sounds.error();
      horoscopeData.value = null;
      asciiOutput.value = "";
      colorizedHtml.value = "";
      // Random network error messages
      const networkErrors = [
        "🛰️ CONNECTION TIMEOUT — Can't reach the astral plane. Check your link?",
        "⚠️ MAINFRAME OFFLINE — The celestial servers are napping. Retry?",
        "❌ DECRYPT FAILED — Star data scrambled beyond recognition. Try again?",
        "🌌 VOID DETECTED — Nothing but cosmic silence out there. Reconnect?",
      ];
      errorMessage.value = networkErrors[Math.floor(Math.random() * networkErrors.length)];
    } finally {
      if (controller.signal.aborted || requestToken !== requestIdRef.current) {
        return;
      }
      isLoading.value = false;
      if (activeController.current === controller) {
        activeController.current = null;
      }
    }
  };

  const handlePeriodChange = (period: string) => {
    currentPeriod.value = period as Period;
  };

  const handleRetry = () => {
    sounds.click();
    fetchHoroscope(sign, currentPeriod.value);
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
        {(isLoading.value || isBootingUp.value)
          ? (
            <div class="text-center" style="padding: 64px 0;">
              <div
                class="text-6xl mb-6 animate-pulse"
                style="animation: glow-pulse 2s ease-in-out infinite;"
              >
                ✨
              </div>
              {isBootingUp.value
                ? (
                  <div
                    class="font-mono text-left inline-block"
                    style="color: #00FF41; font-size: 16px; line-height: 1.8;"
                  >
                    {bootMessages.value.map((msg) => <p key={msg}>{msg}</p>)}
                  </div>
                )
                : (
                  <p style="color: rgba(255, 255, 255, 0.6); font-size: 18px;">
                    Receiving transmission...
                  </p>
                )}
            </div>
          )
          : errorMessage.value
          ? (
            <div class="w-full flex justify-center" style="padding: 64px 0;">
              <div
                class="border-4 rounded-2xl px-6 py-8 max-w-md text-center shadow-brutal-lg"
                style="background-color: rgba(10, 10, 10, 0.85); border-color: var(--color-border, #a855f7);"
              >
                <p
                  class="font-mono text-sm sm:text-base mb-6"
                  style="color: var(--color-text, #faf9f6); line-height: 1.7;"
                >
                  {errorMessage.value}
                </p>
                <button
                  onClick={handleRetry}
                  class="inline-flex items-center gap-2 font-mono font-black uppercase tracking-wide px-6 py-3 border-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-brutal"
                  style="background-color: var(--color-accent, #a855f7); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7);"
                >
                  🔁 Retry
                </button>
              </div>
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
                  enableTypewriter={bootComplete.value}
                  typewriterSpeed={60}
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
