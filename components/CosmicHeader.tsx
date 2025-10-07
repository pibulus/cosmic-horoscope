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
    <div class="w-full text-center" style="margin-bottom: 32px;">
      {/* Icon - clean, no effects */}
      <div style="
          font-size: 100px;
          line-height: 1;
          margin-bottom: 16px;
        ">
        {emoji}
      </div>

      {/* Sign Name - clean brutalist */}
      <h1
        class="font-black font-mono capitalize uppercase"
        style="
          font-size: 48px;
          line-height: 1;
          margin-bottom: 8px;
          color: var(--color-text, #faf9f6);
          letter-spacing: 0.05em;
        "
      >
        {sign}
      </h1>

      {/* Dates - minimal */}
      {dates && (
        <div
          class="font-mono opacity-60"
          style="
            font-size: 14px;
            color: var(--color-text, #faf9f6);
          "
        >
          {dates}
        </div>
      )}
    </div>
  );
}
