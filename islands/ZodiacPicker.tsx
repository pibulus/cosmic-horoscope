// ===================================================================
// ZODIAC PICKER ISLAND - Terminal-flavored sign selector
// ===================================================================

import { signal } from "@preact/signals";
import { useMemo } from "preact/hooks";
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
const ACCENT_COLORS = ["#FF61E6", "#A5F3FC", "#C084FC", "#FFB347"];

const selectedSign = signal<string | null>(null);
const hoveredSign = signal<string | null>(null);

const PICKER_TITLE_ASCII = renderFigletText("STARGRAM", {
  font: "ANSI Shadow",
  width: 72,
});
const PICKER_HINT_WORDS = ["COSMIC", "ACCESS", "PANEL"].map((word) =>
  renderFigletText(word, { font: "Mini", width: 52 })
);
const IDLE_PREVIEW_ASCII = [
  " /\\  /\\ ",
  "/  \\/  \\",
  "\\      /",
  " \\_/\\_/ ",
].join("\n");

const SIGN_ASCII_CACHE = new Map<string, string>();
const DATE_ASCII_CACHE = new Map<string, string>();

function getSignAscii(sign: string, width = 52): string {
  const key = `${sign.toUpperCase()}-${width}`;
  if (!SIGN_ASCII_CACHE.has(key)) {
    SIGN_ASCII_CACHE.set(
      key,
      (() => {
        const base = renderFigletText(sign.toUpperCase(), {
          font: "ANSI Shadow",
          width,
        });
        return base ? `....\n${base}` : "";
      })(),
    );
  }
  return SIGN_ASCII_CACHE.get(key)!;
}

function getDateAscii(dates: string, width = 34): string {
  const key = `${dates}-${width}`;
  if (!DATE_ASCII_CACHE.has(key)) {
    DATE_ASCII_CACHE.set(
      key,
      renderFigletText(dates.toUpperCase(), {
        font: "Small",
        width,
      }),
    );
  }
  return DATE_ASCII_CACHE.get(key)!;
}

function getSignData(name: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((sign) => sign.name === name);
}

export default function ZodiacPicker({ onSignSelected }: ZodiacPickerProps) {
  const accentColor = useMemo(() => {
    const index = Math.floor(Math.random() * ACCENT_COLORS.length);
    return ACCENT_COLORS[index];
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
    ? getSignAscii(previewSign.name, 60)
    : IDLE_PREVIEW_ASCII;

  return (
    <div class="w-full min-h-[90dvh] flex items-center justify-center px-3 sm:px-6 py-12 md:py-16">
      <div
        class="w-full max-w-6xl border-[3px] sm:border-4 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden terminal-shell"
        style={`background: rgba(2, 4, 12, 0.95); border-color: ${accentColor}A6; box-shadow: 0 0 60px ${accentColor}2b;`}
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
            <div class="flex-1">
              <div class="mb-5">
                <pre
                  class="font-mono text-[9px] sm:text-[10px] md:text-xs leading-[1.1] whitespace-pre mb-2"
                  style={`color: ${accentColor}; text-shadow: 0 0 14px ${accentColor}88;`}
                >
                  {PICKER_TITLE_ASCII}
                </pre>
                <div class="flex flex-col sm:flex-row gap-1 sm:gap-3">
                  {PICKER_HINT_WORDS.map((word, idx) => (
                    <pre
                      key={idx}
                      class="font-mono text-[8px] sm:text-[9px] leading-[1.05] whitespace-pre flex-1"
                      style={`color: ${accentColor};`}
                    >
                      {word}
                    </pre>
                  ))}
                </div>
              </div>

              <p
                class="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase"
                style={`color: ${PRIMARY_TERMINAL_COLOR}CC;`}
              >
                &gt; Tap a sign or use keyboard focus to preview :: press enter to lock selection
              </p>

              <div
                class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3"
                role="listbox"
                aria-label="Select your zodiac sign"
              >
                {ZODIAC_SIGNS.map((zodiac, index) => {
                  const isSelected = selectedSign.value === zodiac.name;
                  const indexLabel = (index + 1).toString().padStart(2, "0");

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
                      class="group w-full text-left font-mono border-[3px] rounded-2xl px-4 py-3 transition-all duration-150"
                      style={`
                        border-color: ${PRIMARY_TERMINAL_COLOR}44;
                        background: ${isSelected ? "#102512" : "rgba(0,0,0,0.4)"};
                        color: ${PRIMARY_TERMINAL_COLOR};
                        box-shadow: ${isSelected
                        ? `0 0 25px ${PRIMARY_TERMINAL_COLOR}55`
                        : "0 8px 20px rgba(0,0,0,0.55)"};
                      `}
                    >
                      <div class="flex items-start gap-3">
                        <span
                          class="text-[10px] uppercase tracking-[0.4em]"
                          style={`color: ${PRIMARY_TERMINAL_COLOR}B3;`}
                        >
                          [{indexLabel}]
                        </span>
                        <pre
                          class="flex-1 font-mono text-[8px] sm:text-[9px] leading-[1.05] whitespace-pre uppercase"
                          style={`color: ${PRIMARY_TERMINAL_COLOR}; text-shadow: 0 0 6px ${PRIMARY_TERMINAL_COLOR}55;`}
                        >
                          {getSignAscii(zodiac.name)}
                        </pre>
                        <span
                          class="text-[11px] tracking-[0.2em]"
                          style={`color: ${PRIMARY_TERMINAL_COLOR}CC;`}
                        >
                          {isSelected ? "LOCKED" : "READY"}
                        </span>
                      </div>
                      <pre
                        class="mt-2 font-mono text-[8px] sm:text-[9px] leading-[1.05] whitespace-pre"
                        style={`color: ${PRIMARY_TERMINAL_COLOR}D9;`}
                      >
                        {getDateAscii(zodiac.dates)}
                      </pre>
                      <div
                        class="text-[10px] sm:text-xs uppercase tracking-[0.32em]"
                        style={`color: ${PRIMARY_TERMINAL_COLOR}99; border-top: 1px solid ${PRIMARY_TERMINAL_COLOR}33; padding-top: 6px;`}
                      >
                        {zodiac.element.toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Pane */}
            <div
              class="w-full lg:w-[320px] xl:w-[360px] border-[3px] rounded-3xl p-5 bg-black/35 text-[#00ff41]"
              style={`border-color: ${PRIMARY_TERMINAL_COLOR}5c; box-shadow: inset 0 0 32px ${PRIMARY_TERMINAL_COLOR}12;`}
            >
              <div class="text-xs uppercase tracking-[0.4em] text-[#00ff41]/80 mb-4">
                {previewSign ? "COSMIC DOSSIER" : "SIGNAL STANDBY"}
              </div>

              <pre
                class="font-mono text-[9px] leading-[1.05] whitespace-pre mb-3"
                style={`color: ${PRIMARY_TERMINAL_COLOR};`}
              >
                {previewAscii}
              </pre>

              <p
                class="font-mono text-sm leading-relaxed"
                style={`color: ${PRIMARY_TERMINAL_COLOR}BF;`}
              >
                {previewSign?.bio ||
                  "Hover or focus a sign to load its dossier. Tap to lock and fetch your reading."}
              </p>

              {previewSign && (
                <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.35em] text-[#00ff41]/80">
                  {previewSign.dates} • {previewSign.element.toUpperCase()}
                </p>
              )}

              {selectedSign.value && (
                <p class="mt-4 font-mono text-[11px] tracking-[0.25em] text-[#00ff41]/65 uppercase">
                  {`> LOCKED :: ${selectedSign.value.toUpperCase()}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
