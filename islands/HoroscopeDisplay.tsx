// ===================================================================
// HOROSCOPE DISPLAY ISLAND - Cosmic horoscope with dark magic vibes
// ===================================================================

import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";
import { analytics } from "../utils/analytics.ts";
import { getZodiacEmoji } from "../utils/zodiac.ts";
import { COLOR_EFFECTS } from "../utils/constants.ts";
import { TerminalDisplay } from "../components/TerminalDisplay.tsx";
import { applyColorToArt } from "../utils/colorEffects.ts";
import { generateHoroscopeAscii } from "../utils/asciiArtGenerator.ts";

const RANDOM_COLOR_EFFECTS = COLOR_EFFECTS.filter(effect => effect.value !== "none");

function pickRandomColorEffect(): string {
  if (!RANDOM_COLOR_EFFECTS.length) return "sunrise";
  const randomIndex = Math.floor(Math.random() * RANDOM_COLOR_EFFECTS.length);
  return RANDOM_COLOR_EFFECTS[randomIndex].value;
}

interface HoroscopeDisplayProps {
  sign: string;
  onChangeSign?: () => void;
}

type Period = "daily" | "weekly" | "monthly";

function getDisplayMeta(data: any, period: Period): string {
  if (!data) return "";
  if (period === "weekly") {
    return data.week || data.date || "";
  }
  if (period === "monthly") {
    return data.month || data.date || "";
  }
  return data.date || "";
}

export default function HoroscopeDisplay(
  { sign, onChangeSign }: HoroscopeDisplayProps,
) {
  const currentPeriod = useSignal<Period>("daily");
  const horoscopeData = useSignal<any>(null);
  const isLoading = useSignal(false);
  const isBootingUp = useSignal(false);
  const bootComplete = useSignal(false);
  const bootMessages = useSignal<string[]>([]);
  const colorEffect = useSignal(pickRandomColorEffect());
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
      const metaLabel = getDisplayMeta(horoscopeData.value, currentPeriod.value);
      // Generate ASCII art with sign name, period, and date
      const emoji = getZodiacEmoji(sign);
      const ascii = generateHoroscopeAscii(
        sign,
        text,
        currentPeriod.value,
        metaLabel,
        emoji,
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
    let headerLineIndex = 0;

    for (const line of lines) {
      if (line.includes("[HEADER_START]")) {
        inHeader = true;
        headerLineIndex = 0;
        continue;
      }
      if (line.includes("[HEADER_END]")) {
        inHeader = false;
        headerLineIndex = 0;
        continue;
      }

      if (inHeader) {
        headerLineIndex++;
        const isTitleLine = headerLineIndex === 1;
        // Typography improvements: larger titles, better spacing
        const fontSize = isTitleLine
          ? "clamp(24px, 5.5vw, 38px)" // 1.6-1.9rem equivalent
          : "clamp(14px, 3.5vw, 22px)"; // 0.9-1rem equivalent
        const letterSpacing = isTitleLine ? "0.22em" : "0.16em"; // More breathing
        const marginBottom = isTitleLine ? "0.8em" : "0.5em"; // Add rhythm
        const fontFamily = "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace";
        const textShadow = isTitleLine
          ? "0 0 4px currentColor, 0 0 12px rgba(255, 215, 0, 0.25)" // Stronger glow for titles
          : "0 0 2px currentColor, 0 0 6px rgba(255, 215, 0, 0.15)"; // Subtle for subtitles

        // Header in gold/yellow
        colorizedLines.push(
          `<span style="color: #FFD700; font-weight: 900; letter-spacing: ${letterSpacing}; font-size: ${fontSize}; font-family: ${fontFamily}; text-transform: uppercase; display: block; margin-bottom: ${marginBottom}; text-shadow: ${textShadow};">${
            escapeHtml(line)
          }</span>`,
        );
      } else if (line.trim()) {
        // Body text: 0.95rem, better line-height, reduced glow by ~40%
        colorizedLines.push(
          `<span style="color: #00FF41; font-size: clamp(14px, 3.8vw, 19px); line-height: 1.75; text-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 0 4px currentColor; opacity: 0.92;">${escapeHtml(line)}</span>`,
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
    // Start with an initial boot message so there's always content to show
    bootMessages.value = ["> Initializing..."];

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
        colorEffect.value = pickRandomColorEffect();
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


  return (
    <div class="w-full h-screen flex items-center justify-center p-8 md:p-12" style="transform: translateY(-30px);">
      {/* Always show terminal */}
      {errorMessage.value
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
          : (
            <TerminalDisplay
              content={(isLoading.value || isBootingUp.value)
                ? bootMessages.value.join('\n')
                : (horoscopeData.value ? asciiOutput.value : 'No horoscope data available')
              }
              htmlContent={(isLoading.value || isBootingUp.value)
                ? bootMessages.value.map(msg => `<span style="color: #00FF41;">${msg}</span>`).join('\n')
                : (horoscopeData.value ? colorizedHtml.value : '')
              }
              isLoading={isLoading.value || isBootingUp.value}
              filename={horoscopeData.value ? `${sign}-${currentPeriod.value}-${
                horoscopeData.value.date
                  ? horoscopeData.value.date.toLowerCase().replace(
                    /[\s,]+/g,
                    "-",
                  )
                  : "horoscope"
              }` : `${sign}-horoscope`}
              terminalPath={`~/cosmic/${sign}.txt`}
              visualEffect={visualEffect.value}
              hideExportButtons={!horoscopeData.value}
              enableTypewriter={bootComplete.value && horoscopeData.value}
              typewriterSpeed={60}
              currentPeriod={currentPeriod.value}
              onPeriodChange={handlePeriodChange}
            />
          )}
    </div>
  );
}
