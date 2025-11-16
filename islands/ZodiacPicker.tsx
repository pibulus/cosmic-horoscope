// ===================================================================
// ZODIAC PICKER ISLAND - Terminal-flavored sign selector
// ===================================================================

import { signal } from "@preact/signals";
import { useEffect, useMemo } from "preact/hooks";
import {
  saveZodiacSign,
  ZODIAC_SIGNS,
  type ZodiacSign,
} from "../utils/zodiac.ts";
import { sounds } from "../utils/sounds.ts";
import { renderFigletText } from "../utils/asciiArtGenerator.ts";

interface ZodiacPickerProps {
  onSignSelected: (sign: string) => void;
}

const PRIMARY_TERMINAL_COLOR = "#00FF41";
const ACCENT_COLORS = [
  "#74FBA4",
  "#00F5FF",
  "#FF71F6",
  "#F5F349",
  "#8CF1FF",
  "#FF8DF1",
  "#7DF4FF",
];

const selectedSign = signal<string | null>(null);
const hoveredSign = signal<string | null>(null);

const PICKER_TITLE_ASCII = renderFigletText("STARGRAM", {
  font: "ANSI Shadow",
  width: 72,
});
const PICKER_HINT_TEXT = "COSMIC ACCESS PANEL";
const IDLE_PREVIEW_ASCII = [
  " /\\  /\\ ",
  "/  \\/  \\",
  "\\      /",
  " \\_/\\_/ ",
].join("\n");
const ASCII_DIVIDER = "::::::::::::::::::::::::::::::::::::::::";
const COSMIC_ANIMATION_STYLES = `
@keyframes cosmicFloat {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -12px, 8px); }
  100% { transform: translate3d(0, 0, 0); }
}
@keyframes cursorBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.cosmic-scrollless {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.cosmic-scrollless::-webkit-scrollbar {
  display: none;
}
.cursor-blink {
  animation: cursorBlink 1s steps(2, start) infinite;
}
`;

const SIGN_ASCII_CACHE = new Map<string, string>();

function getSignAsciiArt(sign: string, width = 32): string {
  const key = `${sign.toUpperCase()}-${width}`;
  if (!SIGN_ASCII_CACHE.has(key)) {
    SIGN_ASCII_CACHE.set(
      key,
      renderFigletText(sign.toUpperCase(), {
        font: "Mini",
        width,
      }),
    );
  }
  return SIGN_ASCII_CACHE.get(key)!;
}

function getSignTitle(sign: string): string {
  return sign.toUpperCase();
}

function getSignData(name: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((sign) => sign.name === name);
}

export default function ZodiacPicker({ onSignSelected }: ZodiacPickerProps) {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = COSMIC_ANIMATION_STYLES;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const { accentColor, accentGlowColor } = useMemo(() => {
    const primaryIndex = Math.floor(Math.random() * ACCENT_COLORS.length);
    const remaining = ACCENT_COLORS.filter((_, idx) => idx !== primaryIndex);
    const secondaryIndex = Math.floor(Math.random() * remaining.length);
    return {
      accentColor: ACCENT_COLORS[primaryIndex],
      accentGlowColor: remaining[secondaryIndex] ??
        ACCENT_COLORS[(primaryIndex + 3) % ACCENT_COLORS.length],
    };
  }, []);

  const handleSignClick = (sign: string) => {
    selectedSign.value = sign;
    saveZodiacSign(sign);
    sounds.success();
    onSignSelected(sign);
  };

  const previewTarget = hoveredSign.value || selectedSign.value;
  const previewSign = previewTarget ? getSignData(previewTarget) : undefined;
  const previewAscii = previewSign
    ? getSignAsciiArt(previewSign.name, 32)
    : IDLE_PREVIEW_ASCII;
  const dossierMeta = previewSign
    ? [
      { label: "Element", value: previewSign.element.toUpperCase() },
      { label: "Modality", value: previewSign.modality.toUpperCase() },
      { label: "Ruling Planet", value: previewSign.rulingPlanet.toUpperCase() },
      { label: "Solar Dates", value: previewSign.dates.toUpperCase() },
    ]
    : [];
  const dossierCursorColor = previewSign ? accentColor : accentGlowColor;

  return (
    <div class="relative">
      <div class="w-full min-h-[90dvh] flex items-center justify-center px-3 sm:px-6 py-12 md:py-16">
        <div
          class="w-full max-w-6xl border-[3px] sm:border-4 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden terminal-shell"
          style={`background: rgba(2, 4, 12, 0.95); border-color: ${accentGlowColor}80; box-shadow: 0 0 45px ${accentGlowColor}2e, 0 25px 90px rgba(0,0,0,0.7); animation: cosmicFloat 12s ease-in-out infinite;`}
        >
          {/* Terminal title bar */}
          <div
            class="flex items-center gap-3 px-5 sm:px-8 py-3 border-b-[3px] sm:border-b-4"
            style="border-color: rgba(0, 255, 65, 0.18); background: rgba(0, 0, 0, 0.8);"
          >
            <div class="flex gap-2">
              <span class="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span class="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div
              class="text-xs sm:text-sm font-mono tracking-[0.18em] uppercase"
              style={`color: ${accentColor};`}
            >
              ~/cosmic/bin/zodiac.sh
            </div>
          </div>

          <div class="p-5 sm:p-8 lg:p-12">
            <div class="flex flex-col lg:flex-row gap-10 lg:gap-12">
              <div
                class="flex-1"
                style="animation: cosmicFloat 16s ease-in-out infinite; animation-delay: 0.7s;"
              >
                <div class="mb-5">
                  <pre
                    class="font-mono text-[9px] sm:text-[10px] md:text-xs leading-[1.1] whitespace-pre mb-2"
                    style={`color: ${accentColor}; text-shadow: 0 0 14px ${accentColor}88;`}
                  >
                    {PICKER_TITLE_ASCII}
                  </pre>
                  <div class="w-full text-center">
                    <p
                      class="font-mono uppercase tracking-[0.4em] text-[10px] sm:text-xs"
                      style={`color: ${accentGlowColor}; letter-spacing: clamp(0.2em, 2vw, 0.5em);`}
                    >
                      {PICKER_HINT_TEXT}
                    </p>
                  </div>
                </div>

                <pre
                  class="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase"
                  style={`color: ${accentGlowColor}88;`}
                >
                  {ASCII_DIVIDER}
                </pre>

                <div
                  class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3"
                  role="listbox"
                  aria-label="Select your zodiac sign"
                >
                  {ZODIAC_SIGNS.map((zodiac) => {
                    const isSelected = selectedSign.value === zodiac.name;
                    const isHovered = hoveredSign.value === zodiac.name;
                    const cardTitle = getSignTitle(zodiac.name);
                    const elementLabel = zodiac.element.toUpperCase();
                    const titleColor = isSelected || isHovered
                      ? accentColor
                      : `${accentColor}AA`;
                    const borderColor = isSelected || isHovered
                      ? accentColor
                      : `${accentGlowColor}44`;
                    const backgroundColor = isSelected
                      ? "rgba(0, 30, 8, 0.92)"
                      : isHovered
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(0, 0, 0, 0.45)";
                    const glow = isSelected
                      ? `0 0 32px ${accentColor}80, 0 12px 35px rgba(0,0,0,0.55)`
                      : isHovered
                      ? `0 0 16px ${accentColor}40, 0 8px 22px rgba(0,0,0,0.5)`
                      : "0 6px 18px rgba(0,0,0,0.55)";

                    return (
                      <button
                        key={zodiac.name}
                        type="button"
                        onClick={() => handleSignClick(zodiac.name)}
                        onMouseEnter={() => hoveredSign.value = zodiac.name}
                        onMouseLeave={() => hoveredSign.value = null}
                        onFocus={() => hoveredSign.value = zodiac.name}
                        onBlur={() => hoveredSign.value = null}
                        role="option"
                        aria-selected={isSelected}
                        class="group w-full text-left font-mono border-[3px] rounded-2xl px-4 py-4 transition-all duration-150"
                        style={`
                        border-color: ${borderColor};
                        background: ${backgroundColor};
                        color: ${PRIMARY_TERMINAL_COLOR};
                        box-shadow: ${glow};
                      `}
                      >
                        <div class="flex items-center">
                          <p
                            class="text-[11px] sm:text-sm uppercase tracking-[0.4em] whitespace-nowrap overflow-hidden text-ellipsis"
                            style={`letter-spacing: 0.38em; color: ${titleColor}; text-shadow: 0 0 12px ${titleColor}40;`}
                          >
                            {cardTitle}
                          </p>
                        </div>
                        <div
                          class="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.28em]"
                          style={`color: ${accentGlowColor}CC;`}
                        >
                          {zodiac.dates.toUpperCase()} • {elementLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Pane */}
              <div
                class="w-full lg:w-[320px] xl:w-[360px] border-[3px] rounded-3xl p-5 bg-black/35"
                style={`border-color: ${accentGlowColor}40; box-shadow: inset 0 0 32px ${accentGlowColor}22;`}
              >
                <div
                  class="text-xs uppercase tracking-[0.4em] mb-4"
                  style={`color: ${accentGlowColor}CC;`}
                >
                  {previewSign ? "COSMIC DOSSIER" : "SIGNAL STANDBY"}
                </div>

                {previewSign
                  ? (
                    <div class="space-y-4">
                      <pre
                        class="font-mono text-[9px] leading-[1.05] whitespace-pre"
                        style={`color: ${accentColor}; text-shadow: 0 0 10px ${accentColor}33;`}
                      >
                      {previewAscii}
                      </pre>

                      <p
                        class="font-mono text-sm leading-relaxed"
                        style={`color: ${accentGlowColor}DD;`}
                      >
                        {previewSign.bio}
                      </p>

                      <div class="grid grid-cols-1 gap-3 text-[10px] uppercase tracking-[0.35em]">
                        {dossierMeta.map((item) => (
                          <div
                            key={item.label}
                            class="flex justify-between pb-1"
                            style={`border-bottom: 1px solid ${accentGlowColor}44;`}
                          >
                            <span style={`color: ${accentGlowColor}B0;`}>
                              {item.label}
                            </span>
                            <span style={`color: ${accentColor};`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <p
                          class="text-[10px] uppercase tracking-[0.4em] mb-1"
                          style={`color: ${accentGlowColor}AA;`}
                        >
                          Signature Move
                        </p>
                        <p
                          class="font-mono text-sm leading-relaxed"
                          style={`color: ${accentColor}D0;`}
                        >
                          {previewSign.signatureMove}
                        </p>
                      </div>

                      <div>
                        <p
                          class="text-[10px] uppercase tracking-[0.4em] mb-1"
                          style={`color: ${accentGlowColor}AA;`}
                        >
                          Recharge Protocol
                        </p>
                        <p
                          class="font-mono text-sm leading-relaxed"
                          style={`color: ${accentGlowColor}D0;`}
                        >
                          {previewSign.recharge}
                        </p>
                      </div>

                      <div>
                        <p
                          class="text-[10px] uppercase tracking-[0.4em] mb-1"
                          style={`color: ${accentGlowColor}AA;`}
                        >
                          Keywords
                        </p>
                        <ul class="space-y-1 text-[11px] uppercase tracking-[0.35em]">
                          {previewSign.keywords.map((keyword) => (
                            <li
                              key={keyword}
                              class="font-mono"
                              style={`color: ${accentGlowColor};`}
                            >
                              • {keyword.toUpperCase()}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p
                          class="text-[10px] uppercase tracking-[0.4em] mb-1"
                          style={`color: ${accentGlowColor}AA;`}
                        >
                          Motto
                        </p>
                        <p
                          class="font-mono text-sm italic"
                          style={`color: ${accentColor}C2;`}
                        >
                          “{previewSign.motto}”
                        </p>
                      </div>

                      {selectedSign.value && (
                        <p
                          class="pt-2 font-mono text-[11px] tracking-[0.25em] uppercase border-t"
                          style={`color: ${accentGlowColor}AA; border-color: ${accentGlowColor}28;`}
                        >
                          {`> LOCKED :: ${selectedSign.value.toUpperCase()}`}
                        </p>
                      )}

                      <span
                        class="inline-block h-4 w-2 cursor-blink"
                        style={`background: ${dossierCursorColor};`}
                      />
                    </div>
                  )
                  : (
                    <div class="space-y-3">
                      <pre
                        class="font-mono text-[9px] leading-[1.05] whitespace-pre"
                        style={`color: ${accentColor};`}
                      >
                      {previewAscii}
                      </pre>
                      <p
                        class="font-mono text-sm leading-relaxed"
                        style={`color: ${accentGlowColor}DD;`}
                      >
                        Hover a sign to load intel. Tap to lock your signal and
                        fetch the horoscope stream.
                      </p>
                      <p
                        class="font-mono text-[11px] uppercase tracking-[0.35em]"
                        style={`color: ${accentGlowColor}B0;`}
                      >
                        No sign selected
                      </p>
                      <span
                        class="inline-block h-4 w-2 cursor-blink"
                        style={`background: ${dossierCursorColor};`}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
