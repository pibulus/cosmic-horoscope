// ===================================================================
// ZODIAC PICKER ISLAND - Interactive zodiac sign selector
// ===================================================================

import { signal } from "@preact/signals";
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

const selectedSign = signal<string | null>(null);
const hoveredSign = signal<string | null>(null);

const PICKER_TITLE_ASCII = renderFigletText("STARGRAM", {
  font: "ANSI Shadow",
  width: 52,
});
const PICKER_SUBTITLE_ASCII = renderFigletText("CHOOSE YOUR SIGN", {
  font: "Small Slant",
  width: 48,
});
const PICKER_HINT_ASCII = renderFigletText("COSMIC ACCESS PANEL", {
  font: "Mini",
  width: 44,
});
const IDLE_PREVIEW_ASCII = renderFigletText("AWAITING INPUT", {
  font: "Small Slant",
  width: 30,
});

const SIGN_PREVIEW_CACHE = new Map<string, string>();

function getSignPreview(sign: string): string {
  const key = sign.toUpperCase();
  if (!SIGN_PREVIEW_CACHE.has(key)) {
    SIGN_PREVIEW_CACHE.set(
      key,
      renderFigletText(key, { font: "Small Slant", width: 34 }),
    );
  }
  return SIGN_PREVIEW_CACHE.get(key)!;
}

function getSignData(name: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((sign) => sign.name === name);
}

export default function ZodiacPicker({ onSignSelected }: ZodiacPickerProps) {
  const handleSignClick = (sign: string) => {
    selectedSign.value = sign;
    saveZodiacSign(sign);
    sounds.success();
    onSignSelected(sign);
  };

  const previewTarget = hoveredSign.value || selectedSign.value;
  const previewSign = previewTarget ? getSignData(previewTarget) : undefined;
  const previewAscii = previewTarget
    ? getSignPreview(previewTarget)
    : IDLE_PREVIEW_ASCII;

  return (
    <div class="w-full h-full flex items-center justify-center px-3 sm:px-6 py-10 md:py-14">
      <div
        class="w-full max-w-6xl border-[3px] sm:border-4 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden terminal-shell"
        style="background: rgba(2, 4, 12, 0.95); border-color: rgba(0, 255, 65, 0.65);"
      >
        {/* Terminal title bar */}
        <div
          class="flex items-center gap-3 px-5 sm:px-8 py-3 border-b-[3px] sm:border-b-4"
          style="border-color: rgba(0, 255, 65, 0.25); background: rgba(0, 0, 0, 0.7);"
        >
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span class="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div class="text-xs sm:text-sm font-mono tracking-[0.18em] uppercase text-[#00ff41]">
            ~/cosmic/bin/zodiac.sh
          </div>
        </div>

        <div class="p-5 sm:p-8 lg:p-12">
          <div class="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <div class="flex-1">
              <div class="mb-5 text-[#00ff41]">
                <pre class="font-mono text-[9px] sm:text-[10px] md:text-xs leading-[1.1] whitespace-pre mb-2">
                  {PICKER_TITLE_ASCII}
                </pre>
                <pre class="font-mono text-[9px] sm:text-[10px] md:text-xs leading-[1.1] whitespace-pre mb-2">
                  {PICKER_SUBTITLE_ASCII}
                </pre>
                <pre class="font-mono text-[9px] sm:text-[10px] md:text-xs leading-[1.1] whitespace-pre text-[#00ff41]/70">
                  {PICKER_HINT_ASCII}
                </pre>
              </div>

              <p class="font-mono text-xs sm:text-sm text-[#00ff41]/80 tracking-[0.2em] uppercase">
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
                      class={`group w-full text-left font-mono border-[3px] rounded-2xl px-4 py-3 transition-all duration-150 ${
                        isSelected
                          ? "bg-[#00ff41]/15 border-[#00ff41] text-[#00ff41]"
                          : "bg-black/30 border-[#00ff41]/25 text-[#c8ffdd]"
                      }`}
                      style={`
                        box-shadow: ${
                        isSelected
                          ? "0 0 25px rgba(0, 255, 65, 0.35)"
                          : "0 8px 20px rgba(0, 0, 0, 0.55)"
                      };
                      `}
                    >
                      <div class="flex items-center gap-3">
                        <span class="text-[10px] uppercase tracking-[0.4em] text-[#00ff41]/70">
                          [{indexLabel}]
                        </span>
                        <span class="text-3xl">{zodiac.emoji}</span>
                        <span class="text-base sm:text-lg font-black uppercase tracking-[0.35em] flex-1">
                          {zodiac.name}
                        </span>
                        <span
                          class={`text-[11px] tracking-[0.2em] ${
                            isSelected
                              ? "text-[#00ff41]"
                              : "text-[#00ff41]/60"
                          }`}
                        >
                          {isSelected ? "LOCKED" : "READY"}
                        </span>
                      </div>
                      <div class="mt-2 text-[11px] sm:text-xs uppercase tracking-[0.32em] text-[#00ff41]/70">
                        {zodiac.dates} • {zodiac.element.toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Pane */}
            <div
              class="w-full lg:w-[320px] xl:w-[360px] border-[3px] rounded-3xl p-5 bg-black/40 text-[#00ff41]"
              style="border-color: rgba(0, 255, 65, 0.35); box-shadow: inset 0 0 40px rgba(0, 255, 65, 0.08);"
            >
              <div class="text-xs uppercase tracking-[0.4em] text-[#00ff41]/80 mb-4">
                Live Preview
              </div>

              <div class="flex items-center gap-3 mb-4">
                <div class="text-4xl">
                  {previewSign?.emoji || "✨"}
                </div>
                <div class="font-mono text-sm uppercase tracking-[0.5em]">
                  {previewSign?.name || "awaiting"}
                </div>
              </div>

              <pre class="font-mono text-[10px] sm:text-xs whitespace-pre leading-[1.05] border border-[#00ff41]/30 rounded-2xl p-4 bg-black/50">
                {previewAscii}
              </pre>

              <p class="mt-4 font-mono text-[11px] tracking-[0.25em] text-[#00ff41]/65 uppercase">
                {selectedSign.value
                  ? `> Selected :: ${selectedSign.value.toUpperCase()}`
                  : "> Input required :: choose a sign"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
