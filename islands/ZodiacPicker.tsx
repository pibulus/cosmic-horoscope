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
                  const isHovered = hoveredSign.value === zodiac.name;
                  const indexLabel = (index + 1).toString().padStart(2, "0");
                  const cardTitle = getSignTitle(zodiac.name);
                  const elementLabel = zodiac.element.toUpperCase();
                  const borderColor = isSelected || isHovered
                    ? PRIMARY_TERMINAL_COLOR
                    : `${PRIMARY_TERMINAL_COLOR}44`;
                  const backgroundColor = isSelected
                    ? "rgba(0, 30, 8, 0.92)"
                    : isHovered
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(0, 0, 0, 0.45)";
                  const glow = isSelected
                    ? `0 0 32px ${PRIMARY_TERMINAL_COLOR}66`
                    : isHovered
                    ? `0 0 16px ${PRIMARY_TERMINAL_COLOR}33`
                    : "0 8px 20px rgba(0,0,0,0.55)";

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
                      <div class="flex items-start gap-3">
                        <span
                          class="text-[10px] uppercase tracking-[0.4em]"
                          style={`color: ${PRIMARY_TERMINAL_COLOR}B3;`}
                        >
                          [{indexLabel}]
                        </span>
                        <div class="flex-1">
                          <p
                            class="text-[11px] sm:text-sm uppercase tracking-[0.4em] whitespace-nowrap overflow-hidden text-ellipsis"
                            style="letter-spacing: 0.38em;"
                          >
                            {cardTitle}
                          </p>
                        </div>
                        <span
                          class="text-[11px] tracking-[0.2em]"
                          style={`color: ${PRIMARY_TERMINAL_COLOR}CC;`}
                        >
                          {isSelected ? "LOCKED" : "READY"}
                        </span>
                      </div>
                      <div
                        class="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#00ff41]/75"
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
              class="w-full lg:w-[320px] xl:w-[360px] border-[3px] rounded-3xl p-5 bg-black/35 text-[#00ff41]"
              style={`border-color: ${PRIMARY_TERMINAL_COLOR}5c; box-shadow: inset 0 0 32px ${PRIMARY_TERMINAL_COLOR}12;`}
            >
              <div class="text-xs uppercase tracking-[0.4em] text-[#00ff41]/80 mb-4">
                {previewSign ? "COSMIC DOSSIER" : "SIGNAL STANDBY"}
              </div>

              {previewSign
                ? (
                  <div class="space-y-4">
                    <div class="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[#00ff41]/80">
                      <span class="text-lg" aria-hidden="true">{previewSign.emoji}</span>
                      <span>{getSignTitle(previewSign.name)}</span>
                    </div>

                    <pre
                      class="font-mono text-[9px] leading-[1.05] whitespace-pre"
                      style={`color: ${accentColor};`}
                    >
                      {previewAscii}
                    </pre>

                    <p
                      class="font-mono text-sm leading-relaxed"
                      style={`color: ${PRIMARY_TERMINAL_COLOR}BF;`}
                    >
                      {previewSign.bio}
                    </p>

                    <div class="grid grid-cols-1 gap-3 text-[10px] uppercase tracking-[0.35em]">
                      {dossierMeta.map((item) => (
                        <div key={item.label} class="flex justify-between border-b border-[#00ff41]24 pb-1">
                          <span class="text-[#00ff41]/60">{item.label}</span>
                          <span class="text-[#00ff41]">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p class="text-[10px] uppercase tracking-[0.4em] text-[#00ff41]/70 mb-1">
                        Signature Move
                      </p>
                      <p class="font-mono text-sm leading-relaxed text-[#00ff41]/90">
                        {previewSign.signatureMove}
                      </p>
                    </div>

                    <div>
                      <p class="text-[10px] uppercase tracking-[0.4em] text-[#00ff41]/70 mb-1">
                        Recharge Protocol
                      </p>
                      <p class="font-mono text-sm leading-relaxed text-[#00ff41]/85">
                        {previewSign.recharge}
                      </p>
                    </div>

                    <div>
                      <p class="text-[10px] uppercase tracking-[0.4em] text-[#00ff41]/70 mb-1">
                        Keywords
                      </p>
                      <div class="flex flex-wrap gap-2">
                        {previewSign.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            class="border border-[#00ff41]36 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-[#00ff41]/85"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p class="text-[10px] uppercase tracking-[0.4em] text-[#00ff41]/70 mb-1">
                        Motto
                      </p>
                      <p class="font-mono text-sm italic text-[#00ff41]/85">
                        “{previewSign.motto}”
                      </p>
                    </div>

                    {selectedSign.value && (
                      <p class="pt-2 font-mono text-[11px] tracking-[0.25em] text-[#00ff41]/70 uppercase border-t border-[#00ff41]1f">
                        {`> LOCKED :: ${selectedSign.value.toUpperCase()}`}
                      </p>
                    )}
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
                      style={`color: ${PRIMARY_TERMINAL_COLOR}BF;`}
                    >
                      Hover a sign to load intel. Tap to lock your signal and fetch the horoscope stream.
                    </p>
                    <p class="font-mono text-[11px] uppercase tracking-[0.35em] text-[#00ff41]/80">
                      No sign selected
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
