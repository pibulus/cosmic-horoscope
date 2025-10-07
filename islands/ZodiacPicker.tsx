// ===================================================================
// ZODIAC PICKER ISLAND - Interactive zodiac sign selector
// ===================================================================

import { signal } from "@preact/signals";
import { saveZodiacSign, ZODIAC_SIGNS } from "../utils/zodiac.ts";
import { sounds } from "../utils/sounds.ts";

interface ZodiacPickerProps {
  onSignSelected: (sign: string) => void;
}

const selectedSign = signal<string | null>(null);

export default function ZodiacPicker({ onSignSelected }: ZodiacPickerProps) {
  const handleSignClick = (sign: string) => {
    selectedSign.value = sign;
    saveZodiacSign(sign);
    sounds.success();

    // Notify parent component
    onSignSelected(sign);
  };

  return (
    <div class="w-full relative px-4 py-12 md:py-16">
      {/* Clean Header - Neo-brutalist */}
      <div class="text-center mb-12 max-w-4xl mx-auto">
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-black mb-4 font-mono tracking-tight"
          style="color: var(--color-text, #faf9f6);"
        >
          PICK YOUR SIGN
        </h1>
        <p
          class="text-sm md:text-base font-mono opacity-70"
          style="color: var(--color-text, #faf9f6);"
        >
          See what the cosmos has to say
        </p>
      </div>

      {/* Zodiac Grid - Brutalist & Clean */}
      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-5 max-w-6xl w-full mx-auto mb-8"
        role="group"
        aria-label="Select your zodiac sign"
      >
        {ZODIAC_SIGNS.map((zodiac, index) => {
          const isSelected = selectedSign.value === zodiac.name;

          return (
            <button
              key={zodiac.name}
              onClick={() => handleSignClick(zodiac.name)}
              aria-label={`Select ${zodiac.name} (${zodiac.dates})`}
              aria-pressed={isSelected}
              class="group relative p-4 md:p-5 transition-all duration-150 rounded-lg border-4 font-mono"
              style={`
                background-color: ${
                isSelected
                  ? "var(--color-accent, #a855f7)"
                  : "var(--color-secondary, #1a1f3a)"
              };
                border-color: ${
                isSelected
                  ? "var(--color-text, #faf9f6)"
                  : "var(--color-border, #a855f7)"
              };
                box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
                color: var(--color-text, #faf9f6);
              `}
            >
              {/* Emoji - Clean, no effects */}
              <div class="text-4xl md:text-5xl mb-2 transition-transform group-hover:scale-110">
                {zodiac.emoji}
              </div>

              {/* Name - Bold mono */}
              <div class="text-xs md:text-sm font-black uppercase tracking-wide mb-1">
                {zodiac.name}
              </div>

              {/* Dates */}
              <div class="text-[10px] md:text-xs opacity-60">
                {zodiac.dates}
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div
                  class="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center border-3 font-bold text-base bg-black"
                  style="border-color: var(--color-text, #faf9f6); color: var(--color-accent, #a855f7);"
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <div
        class="text-center mt-6 font-mono"
        style="color: var(--color-text, #faf9f6); opacity: 0.5;"
      >
        <p class="text-xs md:text-sm">We'll remember your sign ✨</p>
      </div>
    </div>
  );
}
