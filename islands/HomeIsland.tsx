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
      {/* Header - Simplified & Smaller */}
      <header
        class="border-b-2 relative flex-shrink-0"
        style="border-color: var(--color-border, #a78bfa); background-color: var(--color-secondary, #1a1f3a)"
      >
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div class="flex items-center justify-between">
            <a href="/" class="group flex items-baseline gap-3">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                COSMIC HOROSCOPE
              </h1>
              <span
                class="hidden sm:inline text-xs font-mono opacity-60"
                style="color: var(--color-text-secondary, #f0abfc)"
              >
                shareable art
              </span>
            </a>
            {/* Theme switcher stays in routes/index.tsx as floating button */}
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
