import { useEffect, useRef, useState } from "preact/hooks";
import { createThemeSystem, type Theme } from "../theme-system/mod.ts";
import {
  cosmicThemeConfig,
  cosmicThemes,
} from "../theme-system/cosmic-themes.ts";
import { sounds } from "../utils/sounds.ts";
import { analytics } from "../utils/analytics.ts";

export default function ThemeIsland() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(cosmicThemes[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [themeSystem] = useState(() => createThemeSystem(cosmicThemeConfig));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize theme system and load saved theme
    const theme = themeSystem.init();
    setCurrentTheme(theme);

    // Subscribe to theme changes
    const unsubscribe = themeSystem.subscribe((theme) => {
      setCurrentTheme(theme);
    });

    // Initialize sounds
    sounds.init();

    return unsubscribe;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showPicker]);

  const handleThemeChange = (theme: Theme) => {
    sounds.click();
    analytics.trackThemeChanged(currentTheme.name, theme.name);
    themeSystem.setTheme(theme.name);
    setShowPicker(false);
  };

  const cycleTheme = () => {
    sounds.click();
    const currentIndex = cosmicThemes.findIndex((t) =>
      t.name === currentTheme.name
    );
    const nextIndex = (currentIndex + 1) % cosmicThemes.length;
    const nextTheme = cosmicThemes[nextIndex];
    themeSystem.setTheme(nextTheme.name);
    analytics.trackThemeChanged(currentTheme.name, nextTheme.name);
  };

  return (
    <div class="relative" ref={dropdownRef}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        onMouseEnter={() => sounds.hover()}
        class="group relative px-4 py-2 rounded-lg font-mono text-xs font-bold shadow-brutal hover:shadow-brutal-lg hover:animate-pop transition-all active:scale-95"
        style="background-color: var(--color-accent, #FF69B4); color: var(--color-base, #FAF9F6); border: 2px solid var(--color-border, #0A0A0A)"
        title="Change theme"
      >
        <span class="mr-2">🎨</span>
        {currentTheme.name.split(" ")[0]}
        <span class="ml-2 opacity-60 text-xs">↓</span>
      </button>

      {/* Theme Picker Dropdown */}
      {showPicker && (
        <div
          class="absolute top-full right-0 mt-2 w-56 rounded-xl shadow-brutal overflow-hidden animate-slide-up z-50"
          style="background-color: var(--color-base, #FAF9F6); border: 3px solid var(--color-border, #0A0A0A)"
        >
          <div class="p-4 font-mono">
            {/* Cosmic themes */}
            <div class="space-y-2">
              {cosmicThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme)}
                  onMouseEnter={() => sounds.hover()}
                  class="w-full text-center px-4 py-3 rounded-xl text-sm font-mono hover:scale-[1.02] transition-all"
                  style={`
                    background: ${theme.secondary};
                    color: ${theme.text};
                    border: 3px solid ${theme.border};
                    ${
                    currentTheme.name === theme.name
                      ? `box-shadow: 0 0 0 3px ${theme.accent} inset, 0 0 20px ${theme.accent}80;`
                      : ""
                  }
                  `}
                >
                  <div class="flex items-center justify-between">
                    <span class="font-black tracking-wider uppercase text-xs">
                      {theme.name}
                    </span>
                    {currentTheme.name === theme.name && (
                      <span class="text-lg">✓</span>
                    )}
                  </div>
                  <div class="text-xs opacity-60 mt-1 font-normal">
                    {theme.vibe}
                  </div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div
              class="my-3 border-t-2 opacity-20"
              style="border-color: var(--color-border, #a78bfa)"
            />

            {/* Cycle button */}
            <button
              onClick={cycleTheme}
              class="w-full px-3 py-2 rounded-xl text-sm font-mono hover:scale-[1.02] transition-all font-bold"
              style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: #ffffff; border: 3px solid var(--color-border, #a78bfa);"
            >
              <span class="flex items-center justify-center gap-2">
                <span>🌙</span>
                <span class="uppercase tracking-wide">Next Vibe</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
