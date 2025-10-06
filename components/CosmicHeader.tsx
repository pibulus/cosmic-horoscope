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
    <div class="relative w-full">
      {/* Animated mesh gradient background layers */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div
          class="absolute w-[700px] h-[700px] -top-60 left-1/4 rounded-full"
          style="background: radial-gradient(circle, #ff00ff 0%, #a855f7 40%, transparent 70%); filter: blur(120px); animation: mesh-float-1 18s ease-in-out infinite;"
        />
        <div
          class="absolute w-[600px] h-[600px] top-1/3 right-1/4 rounded-full"
          style="background: radial-gradient(circle, #00ffff 0%, #ec4899 40%, transparent 70%); filter: blur(100px); animation: mesh-float-2 22s ease-in-out infinite;"
        />
        <div
          class="absolute w-[500px] h-[500px] top-1/2 left-1/2 rounded-full"
          style="background: radial-gradient(circle, #f59e0b 0%, #7c3aed 40%, transparent 70%); filter: blur(90px); animation: mesh-float-3 16s ease-in-out infinite;"
        />
      </div>

      {/* Main header content */}
      <div class="relative z-10 text-center py-12 px-4">
        {/* Floating emoji with glow and particles */}
        <div class="relative inline-block mb-6">
          {/* Emoji */}
          <div
            class="text-8xl md:text-9xl inline-block"
            style="
              animation: subtle-float 4s ease-in-out infinite, glow-pulse 3s ease-in-out infinite;
              filter: drop-shadow(0 0 30px rgba(255, 0, 255, 0.6)) drop-shadow(0 0 60px rgba(0, 255, 255, 0.4));
            "
          >
            {emoji}
          </div>

          {/* Floating particles around emoji (CSS-only) */}
          <div
            class="absolute w-2 h-2 bg-pink-400 rounded-full"
            style="top: 20%; left: -10%; animation: particle-float 6s ease-in-out infinite; animation-delay: 0s;"
          />
          <div
            class="absolute w-3 h-3 bg-purple-400 rounded-full"
            style="top: 10%; right: -5%; animation: particle-float 5s ease-in-out infinite; animation-delay: 0.5s;"
          />
          <div
            class="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style="bottom: 25%; left: -5%; animation: particle-float 7s ease-in-out infinite; animation-delay: 1s;"
          />
          <div
            class="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style="bottom: 15%; right: -10%; animation: particle-float 6.5s ease-in-out infinite; animation-delay: 1.5s;"
          />
        </div>

        {/* Sign name with glitch effect */}
        <h1
          class="text-6xl md:text-7xl lg:text-8xl font-black capitalize mb-4 spring-bounce glitch-title"
          style="
            background: linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ff00ff 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 40px rgba(255, 0, 255, 0.8)) drop-shadow(0 0 80px rgba(0, 255, 255, 0.6));
            animation-delay: 0.1s;
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

        {/* Date range with terminal aesthetic */}
        {dates && (
          <div class="relative inline-block">
            <div
              class="text-lg md:text-xl font-mono px-6 py-2 rounded-lg border-2 spring-bounce"
              style="
                background: rgba(0, 0, 0, 0.7);
                border-color: rgba(255, 0, 255, 0.4);
                color: #00ff41;
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1);
                animation-delay: 0.2s;
              "
            >
              <span class="scanlines">{dates}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
