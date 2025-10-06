// ===================================================================
// COSMIC HEADER - Juicy animated header with glitch effects
// ===================================================================

interface CosmicHeaderProps {
  sign: string;
  emoji: string;
  dates?: string;
}

export function CosmicHeader({ sign, emoji, dates }: CosmicHeaderProps) {
  return (
    <div class="w-full mb-12">
      {/* Unified hero card with neo-brutal border */}
      <div
        class="relative mx-auto max-w-2xl p-8 md:p-10 text-center spring-bounce"
        style="
          background: rgba(10, 0, 32, 0.85);
          backdrop-filter: blur(10px);
          border: 4px solid;
          border-color: var(--color-accent, #c084fc);
          border-radius: 24px;
          box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.8), 0 0 40px rgba(192, 132, 252, 0.4);
        "
      >
        {/* Floating particles in background */}
        <div class="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-30">
          <div
            class="absolute w-2 h-2 bg-pink-400 rounded-full"
            style="top: 15%; left: 10%; animation: particle-float 6s ease-in-out infinite;"
          />
          <div
            class="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style="top: 25%; right: 15%; animation: particle-float 7s ease-in-out infinite; animation-delay: 1s;"
          />
          <div
            class="absolute w-2 h-2 bg-purple-400 rounded-full"
            style="bottom: 20%; left: 20%; animation: particle-float 8s ease-in-out infinite; animation-delay: 2s;"
          />
        </div>

        {/* Content */}
        <div class="relative z-10">
          {/* Emoji + Sign Name unified */}
          <div class="flex flex-col items-center gap-4 mb-4">
            {/* Emoji - smaller */}
            <div
              class="text-6xl md:text-7xl"
              style="
                filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.5));
                animation: subtle-float 4s ease-in-out infinite;
              "
            >
              {emoji}
            </div>

            {/* Sign name with glitch on hover */}
            <h1
              class="text-5xl md:text-6xl lg:text-7xl font-black capitalize glitch-title"
              style="
                background: linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ff00ff 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 0 30px rgba(255, 0, 255, 0.7));
              "
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.animation = 'chromatic-aberration 0.3s linear infinite, glitch-jitter 0.5s ease-in-out infinite';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.animation = '';
              }}
            >
              {sign}
            </h1>
          </div>

          {/* Date badge integrated inline */}
          {dates && (
            <div
              class="inline-block px-5 py-2 font-mono text-sm md:text-base font-bold rounded-lg"
              style="
                background: rgba(0, 255, 65, 0.1);
                color: #00ff41;
                border: 2px solid rgba(0, 255, 65, 0.3);
                box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
              "
            >
              {dates}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
