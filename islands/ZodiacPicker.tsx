// ===================================================================
// ZODIAC PICKER ISLAND - Interactive zodiac sign selector
// ===================================================================

import { signal } from "@preact/signals";
import { ZODIAC_SIGNS, saveZodiacSign } from "../utils/zodiac.ts";
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
    <div class="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          ✨ What's Your Sign? ✨
        </h1>
        <p class="text-lg md:text-xl text-gray-300">
          Choose your zodiac sign to reveal your cosmic reading
        </p>
      </div>

      {/* Zodiac Grid */}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {ZODIAC_SIGNS.map((zodiac) => (
          <button
            key={zodiac.name}
            onClick={() => handleSignClick(zodiac.name)}
            class={`
              group relative p-6 rounded-2xl border-4 border-black
              bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-purple-900/40
              hover:from-purple-800/60 hover:via-pink-800/60 hover:to-purple-800/60
              transition-all duration-200
              hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50
              active:scale-95
              ${selectedSign.value === zodiac.name ? 'ring-4 ring-purple-400' : ''}
            `}
          >
            {/* Emoji */}
            <div class="text-6xl mb-3 filter drop-shadow-lg">
              {zodiac.emoji}
            </div>

            {/* Name */}
            <div class="text-xl font-bold capitalize text-white mb-1">
              {zodiac.name}
            </div>

            {/* Dates */}
            <div class="text-sm text-purple-200">
              {zodiac.dates}
            </div>

            {/* Element badge */}
            <div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold bg-black/40 text-white">
              {zodiac.element}
            </div>

            {/* Selection indicator */}
            {selectedSign.value === zodiac.name && (
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center border-2 border-black animate-bounce">
                <span class="text-lg">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Helper text */}
      <div class="text-center mt-8 text-sm text-gray-400">
        <p>✨ Your sign will be saved for your next visit</p>
      </div>
    </div>
  );
}
