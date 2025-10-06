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
    <div class="w-full text-center" style="margin-bottom: 48px;">
      {/* Icon - 120px, no background */}
      <div
        class="spring-bounce"
        style="
          font-size: 120px;
          line-height: 1;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.6));
          animation: subtle-float 4s ease-in-out infinite;
          animation-delay: 0.1s;
        "
      >
        {emoji}
      </div>

      {/* Sign Name - 72px, huge, bold, hard shadow */}
      <h1
        class="font-black capitalize spring-bounce"
        style="
          font-size: 72px;
          line-height: 1;
          margin-bottom: 8px;
          color: #ffffff;
          text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
          letter-spacing: -0.02em;
          animation-delay: 0.2s;
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

      {/* Dates - 16px, green, no border, just text */}
      {dates && (
        <div
          class="font-mono spring-bounce"
          style="
            font-size: 16px;
            color: #22c55e;
            animation-delay: 0.3s;
          "
        >
          {dates}
        </div>
      )}
    </div>
  );
}
