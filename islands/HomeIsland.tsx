// ===================================================================
// HOME ISLAND - Main interactive container for sign selection
// ===================================================================

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ZodiacPicker from "./ZodiacPicker.tsx";
import HoroscopeDisplay from "./HoroscopeDisplay.tsx";
import { KofiButton } from "./KofiModal.tsx";
import { AboutLink } from "./AboutModal.tsx";
import { getSavedZodiacSign, getZodiacEmoji } from "../utils/zodiac.ts";

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
      {/* Header - Solid dark background */}
      <header
        class="border-b-4 relative flex-shrink-0"
        style="border-color: var(--color-border, #a855f7); background-color: #0a0a0a;"
      >
        <div class="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 sm:gap-4">
              <h1
                onClick={selectedSign.value ? handleChangeSign : undefined}
                class={`text-base sm:text-2xl md:text-3xl font-black font-mono tracking-tight transition-all ${
                  selectedSign.value
                    ? "cursor-pointer hover:scale-105 active:scale-95 hover:opacity-80"
                    : ""
                }`}
                style="color: var(--color-text, #faf9f6)"
                role={selectedSign.value ? "button" : undefined}
                tabIndex={selectedSign.value ? 0 : undefined}
                aria-label={selectedSign.value
                  ? "Return to sign selection"
                  : undefined}
              >
                STARGRAM
              </h1>
              {selectedSign.value && (
                <>
                  <div
                    style="font-size: 32px; line-height: 1;"
                    class="sm:text-5xl"
                  >
                    {getZodiacEmoji(selectedSign.value)}
                  </div>
                  <div
                    class="font-black font-mono uppercase"
                    style="
                      font-size: 20px;
                      color: var(--color-text, #faf9f6);
                      letter-spacing: 0.08em;
                      text-shadow: var(--shadow-glow, none);
                    "
                    class="sm:text-3xl"
                  >
                    {selectedSign.value}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        class="flex-1 w-full px-2 sm:px-4 py-2 sm:py-6 md:py-8 flex items-center justify-center overflow-auto"
      >
        <div class="max-w-5xl w-full">
          {selectedSign.value
            ? (
              <HoroscopeDisplay
                sign={selectedSign.value}
                onChangeSign={handleChangeSign}
              />
            )
            : <ZodiacPicker onSignSelected={handleSignSelected} />}
        </div>
      </main>

      {/* Footer - Floating at bottom */}
      <footer
        class="fixed bottom-0 left-0 right-0 py-2 sm:py-3 z-40 border-t-4"
        style="
          background-color: #0a0a0a;
          border-color: var(--color-border, #a855f7);
        "
      >
        <div class="max-w-4xl mx-auto px-3 sm:px-4">
          <div class="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <AboutLink label="Made by Pablo 🎸" />
            <KofiButton size="sm" label="☕ Support" />
          </div>
        </div>
      </footer>
    </>
  );
}
