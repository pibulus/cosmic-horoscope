// ===================================================================
// HOME ISLAND - Main interactive container for sign selection
// ===================================================================

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ZodiacPicker from "./ZodiacPicker.tsx";
import HoroscopeDisplay from "./HoroscopeDisplay.tsx";
import { KofiButton } from "./KofiModal.tsx";
import { AboutLink } from "./AboutModal.tsx";
import { getSavedZodiacSign } from "../utils/zodiac.ts";

export default function HomeIsland() {
  const selectedSign = useSignal<string | null>(null);

  // Load saved sign on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = getSavedZodiacSign();
      if (saved) {
        selectedSign.value = saved;
      }
    }
  }, []);

  const handleSignSelected = (sign: string) => {
    selectedSign.value = sign;
  };

  const handleChangeSign = () => {
    selectedSign.value = null;
  };

  return (
    <>
      {/* Header */}
      <header
        class="border-b-4 relative flex-shrink-0"
        style="border-color: var(--color-border, #a78bfa); background-color: var(--color-secondary, #1a1f3a)"
      >
        <div class="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/" class="group text-center">
              <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                COSMIC HOROSCOPE
              </h1>
              <p
                class="mt-2 text-sm sm:text-base md:text-lg font-mono font-bold"
                style="color: var(--color-accent, #f0abfc)"
              >
                Horoscopes as shareable art
              </p>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" class="flex-1 w-full px-4 py-6 md:py-8 flex items-center justify-center overflow-auto">
        <div class="max-w-5xl w-full">
          {selectedSign.value ? (
            <HoroscopeDisplay
              sign={selectedSign.value}
              onChangeSign={handleChangeSign}
            />
          ) : (
            <ZodiacPicker onSignSelected={handleSignSelected} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        class="border-t-4 py-6 flex-shrink-0"
        style="border-color: var(--color-border, #a78bfa); background-color: var(--color-secondary, #1a1f3a)"
      >
        <div class="max-w-4xl mx-auto px-4">
          <div class="flex items-center justify-center gap-4">
            <AboutLink label="Made by Pablo 🎸" />
            <KofiButton size="sm" label="☕ Support" />
          </div>
        </div>
      </footer>
    </>
  );
}
