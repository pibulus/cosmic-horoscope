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

  // Get element color for borders
  const getElementColor = (element: string): string => {
    switch (element.toLowerCase()) {
      case "fire":
        return "#ff6b35"; // Orange-red
      case "earth":
        return "#66bb6a"; // Green
      case "air":
        return "#42a5f5"; // Blue
      case "water":
        return "#26c6da"; // Cyan
      default:
        return "#a855f7"; // Purple fallback
    }
  };

  return (
    <div class="w-full h-screen relative px-3 py-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Cosmic background mesh gradients - more vibrant */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div
          class="absolute w-[800px] h-[800px] -top-60 left-1/4 rounded-full"
          style="background: radial-gradient(circle, #ff00ff 0%, #00ffff 50%, transparent 70%); filter: blur(100px); animation: mesh-float-1 15s ease-in-out infinite;"
        />
        <div
          class="absolute w-[600px] h-[600px] top-1/3 right-1/4 rounded-full"
          style="background: radial-gradient(circle, #a855f7 0%, #ec4899 50%, transparent 70%); filter: blur(90px); animation: mesh-float-2 20s ease-in-out infinite;"
        />
      </div>

      {/* Compact Header */}
      <div class="text-center mb-8 relative z-10 stagger-item max-w-2xl">
        <h1
          class="text-3xl md:text-4xl lg:text-5xl font-black mb-3"
          style="background: linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #a855f7 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.6));"
        >
          What's your sign?
        </h1>
        <p class="text-sm md:text-base text-purple-200/80">
          Pick one. See what the cosmos has to say.
        </p>
      </div>

      {/* Zodiac Grid - Compact 4x3 grid that fits in viewport */}
      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3 md:gap-4 max-w-6xl w-full relative z-10 mb-6"
        role="group"
        aria-label="Select your zodiac sign"
      >
        {ZODIAC_SIGNS.map((zodiac, index) => {
          const elementColor = getElementColor(zodiac.element);
          const isSelected = selectedSign.value === zodiac.name;

          return (
            <button
              key={zodiac.name}
              onClick={() => handleSignClick(zodiac.name)}
              aria-label={`Select ${zodiac.name} (${zodiac.dates})`}
              aria-pressed={isSelected}
              class="stagger-item group relative p-3 md:p-4 bg-black/80 backdrop-blur rounded-xl border-3 transition-all duration-200 hover:-translate-y-1 hover:scale-105 active:translate-y-0"
              style={`
                border-color: ${elementColor};
                box-shadow: 3px 3px 0 ${elementColor}${isSelected ? ", 0 0 30px " + elementColor + "90" : ""};
                animation-delay: ${index * 0.03}s;
              `}
            >
              {/* Emoji - Medium size with glow */}
              <div
                class="text-4xl md:text-5xl mb-2 transition-all group-hover:scale-110 group-hover:rotate-12"
                style={`filter: drop-shadow(0 0 ${isSelected ? "20" : "10"}px ${elementColor});`}
              >
                {zodiac.emoji}
              </div>

              {/* Name - Bold gradient */}
              <div
                class="text-xs md:text-sm font-black capitalize mb-1"
                style={`background: linear-gradient(135deg, ${elementColor} 0%, #ffffff 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`}
              >
                {zodiac.name}
              </div>

              {/* Dates - smaller */}
              <div class="text-[10px] md:text-xs font-mono opacity-70" style={`color: ${elementColor};`}>
                {zodiac.dates}
              </div>

              {/* Selection glow ring */}
              {isSelected && (
                <div
                  class="absolute inset-0 rounded-xl pointer-events-none animate-pulse"
                  style={`box-shadow: inset 0 0 20px ${elementColor}60;`}
                />
              )}

              {/* Selection checkmark - smaller */}
              {isSelected && (
                <div
                  class="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black font-bold text-sm animate-bounce"
                  style={`background-color: ${elementColor}; color: #000000;`}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Helper text - compact */}
      <div class="text-center mt-4 text-xs text-purple-300/50 relative z-10">
        <p>We'll remember your sign ✨</p>
      </div>

      {/* Animations - faster, more dynamic */}
      <style>{`
        @keyframes mesh-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -30px) scale(1.1); }
        }

        @keyframes mesh-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(0.9); }
        }

        .stagger-item {
          opacity: 0;
          animation: fadeInUp 0.4s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
