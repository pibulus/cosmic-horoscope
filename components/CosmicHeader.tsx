// ===================================================================
// COSMIC HEADER - Simple header (sign now in site header)
// ===================================================================

interface CosmicHeaderProps {
  sign: string;
  emoji: string;
}

export function CosmicHeader({ sign, emoji }: CosmicHeaderProps) {
  return (
    <div
      class="w-full flex items-center justify-center gap-4"
      style="margin-bottom: 24px;"
    >
      {/* Icon - smaller, inline */}
      <div style="
          font-size: 48px;
          line-height: 1;
          text-shadow: var(--shadow-glow, none);
        ">
        {emoji}
      </div>

      {/* Sign Name - smaller, inline brutalist */}
      <h1
        class="font-black font-mono capitalize uppercase"
        style="
          font-size: 32px;
          line-height: 1;
          color: var(--color-text, #faf9f6);
          letter-spacing: 0.05em;
          text-shadow: var(--shadow-glow, none);
        "
      >
        {sign}
      </h1>
    </div>
  );
}
