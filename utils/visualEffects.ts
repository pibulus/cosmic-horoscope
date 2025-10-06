// ===================================================================
// VISUAL EFFECTS - CSS filter combinations for horoscope display
// ===================================================================
// Makes horoscopes look LUSH and shareable

/**
 * Get CSS filter string for a visual effect
 */
export function getVisualEffectCSS(effect: string): string {
  switch (effect) {
    case "neon":
      return "drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor) brightness(1.2)";

    case "glitch":
      return "contrast(1.2) saturate(1.5) hue-rotate(5deg)";

    case "thermal":
      return "contrast(1.3) saturate(2) hue-rotate(30deg) brightness(1.1)";

    case "hologram":
      return "drop-shadow(2px 0 0 rgba(255, 0, 255, 0.5)) drop-shadow(-2px 0 0 rgba(0, 255, 255, 0.5)) opacity(0.95)";

    case "retro":
      return "sepia(0.3) contrast(1.2) saturate(1.3)";

    case "cyberpunk":
      return "drop-shadow(0 0 15px rgba(255, 0, 255, 0.6)) drop-shadow(0 0 25px rgba(0, 255, 255, 0.4)) saturate(1.4)";

    default: // "none"
      return "none";
  }
}

/**
 * Get animation class for a visual effect (if any)
 */
export function getVisualEffectAnimation(effect: string): string {
  switch (effect) {
    case "glitch":
      return "glitch-animation";
    case "hologram":
      return "hologram-flicker";
    default:
      return "";
  }
}
