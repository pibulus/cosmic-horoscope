// 🌙 Cosmic Horoscope - Theme Configuration
// Four mystical themes for shareable horoscope art

import type { Theme, ThemeSystemConfig } from "./mod.ts";

// ===================================================================
// COSMIC PURPLE - Default mystical midnight theme (MORE VIBRANT)
// ===================================================================
export const cosmicPurple: Theme = {
  name: "COSMIC PURPLE",
  vibe: "mystical midnight",
  base: "linear-gradient(180deg, #0a0020 0%, #1a0b2e 100%)",
  secondary: "#1a1f3a",
  accent: "#c084fc", // Brighter electric purple
  text: "#ffffff",
  textSecondary: "#f3e8ff", // Lighter purple
  border: "#c084fc", // Brighter purple glow
  cssVars: {
    "--color-base-solid": "#0a0020",
    "--shadow-glow": "0 0 50px rgba(192, 132, 252, 0.6)",
    "--mesh-1": "#9333ea",
    "--mesh-2": "#ec4899",
    "--mesh-3": "#f59e0b",
    "--particle-count": "8",
    "--orb-count": "3",
  },
};

// ===================================================================
// SUNSET MAGIC - Warm golden hour sorcery (MORE VIBRANT)
// ===================================================================
export const sunsetMagic: Theme = {
  name: "SUNSET MAGIC",
  vibe: "golden hour sorcery",
  base: "linear-gradient(180deg, #3d1b5e 0%, #2a0a2f 100%)",
  secondary: "#3a1a3e",
  accent: "#f472b6", // Brighter hot pink
  text: "#fef08a", // Bright gold
  textSecondary: "#fbbf24", // Saturated orange
  border: "#fb923c", // Bright orange glow
  cssVars: {
    "--color-base-solid": "#3d1b5e",
    "--shadow-glow": "0 0 50px rgba(244, 114, 182, 0.6)",
    "--mesh-1": "#fb923c",
    "--mesh-2": "#f472b6",
    "--mesh-3": "#ff6b6b",
    "--particle-count": "10",
    "--orb-count": "4",
  },
};

// ===================================================================
// NEON ORACLE - Digital prophecy in matrix green (ULTRA BRIGHT)
// ===================================================================
export const neonOracle: Theme = {
  name: "NEON ORACLE",
  vibe: "digital prophecy",
  base: "#000000",
  secondary: "#0a1f1f",
  accent: "#00ffff", // Bright cyan
  text: "#00ff41", // Matrix green (kept bright)
  textSecondary: "#39ff14", // Neon green
  border: "#00ff41", // Neon green glow
  cssVars: {
    "--color-base-solid": "#000000",
    "--shadow-glow": "0 0 60px rgba(0, 255, 65, 0.8)", // Stronger glow
    "--mesh-1": "#00ff41",
    "--mesh-2": "#00ffff",
    "--mesh-3": "#7c3aed",
    "--particle-count": "12",
    "--orb-count": "3",
  },
};

// ===================================================================
// PINK MOON - Lunar punk vibes (MORE VIBRANT)
// ===================================================================
export const pinkMoon: Theme = {
  name: "PINK MOON",
  vibe: "lunar punk",
  base: "linear-gradient(180deg, #1a0a1f 0%, #2d1b4e 100%)",
  secondary: "#2a1a2e",
  accent: "#ff1493", // Deep pink
  text: "#ffc0e5", // Brighter soft pink
  textSecondary: "#ff69b4", // Hot pink
  border: "#ff1493", // Brighter deep pink glow
  cssVars: {
    "--color-base-solid": "#1a0a1f",
    "--shadow-glow": "0 0 50px rgba(255, 20, 147, 0.7)", // Stronger glow
    "--mesh-1": "#ff1493",
    "--mesh-2": "#ec4899",
    "--mesh-3": "#a855f7",
    "--particle-count": "8",
    "--orb-count": "5",
  },
};

// ===================================================================
// Theme System Configuration
// ===================================================================
export const cosmicThemeConfig: ThemeSystemConfig = {
  themes: [cosmicPurple, sunsetMagic, neonOracle, pinkMoon],
  defaultTheme: "COSMIC PURPLE",
  storageKey: "cosmic-horoscope-theme",
};

// Export all themes
export const cosmicThemes = [cosmicPurple, sunsetMagic, neonOracle, pinkMoon];
