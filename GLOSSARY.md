# Glossary - Cosmic Horoscope

## Islands (Interactive Components)

- `ZodiacPicker` - Interactive zodiac sign selector grid
  (islands/ZodiacPicker.tsx)
- `HoroscopeDisplay` - Horoscope display with gradients + export
  (islands/HoroscopeDisplay.tsx)
- `ThemeIsland` - Floating theme switcher button (islands/ThemeIsland.tsx)
- `TabSwitcher` - Period selector (daily/weekly/monthly)
  (islands/TabSwitcher.tsx)
- `AboutModal` - About/info modal dialog (islands/AboutModal.tsx)
- `KofiModal` - Ko-fi donation modal (islands/KofiModal.tsx)
- `WelcomeChecker` - First-visit detection (islands/WelcomeChecker.tsx)
- `WelcomeModal` - Welcome message modal (islands/WelcomeModal.tsx)

## Components (Shared UI)

- `MagicDropdown` - Animated dropdown selector for gradients
  (components/MagicDropdown.tsx)
- `StructuredData` - JSON-LD schema for SEO (components/StructuredData.tsx)

## API Routes

- `GET /api/horoscope?sign=libra&period=daily` - Horoscope proxy with timezone
  handling (routes/api/horoscope.ts)

## Key Functions

- `openAboutModal()` - Show about modal (islands/AboutModal.tsx)
- `closeAboutModal()` - Hide about modal (islands/AboutModal.tsx)
- `openKofiModal()` - Show Ko-fi modal (islands/KofiModal.tsx)
- `closeKofiModal()` - Hide Ko-fi modal (islands/KofiModal.tsx)
- `checkWelcomeStatus()` - Check if user has seen welcome
  (islands/WelcomeModal.tsx)
- `markWelcomeSeen()` - Mark welcome as viewed with animation
  (islands/WelcomeModal.tsx)
- `saveZodiacSign(sign)` - Save sign to localStorage (utils/zodiac.ts)
- `getSavedZodiacSign()` - Load sign from localStorage (utils/zodiac.ts)
- `downloadPNG(selector, filename)` - Export element as PNG
  (utils/exportUtils.ts)
- `applyColorToArt(text, effect)` - Apply gradient to text
  (utils/colorEffects.ts)

## Theme System

- `ThemeSystem` - Universal theme engine with 60/30/10 rule (utils/themes.ts)
- `asciifierThemes[]` - 11 cosmic themes (Turquoise, Coral, Purple, etc.)
- `applyTheme(theme)` - Apply theme CSS variables (utils/themes.ts)
- `loadTheme()` - Load saved theme from localStorage (utils/themes.ts)
- `cycleTheme()` - Switch to next theme (utils/themes.ts)
- `getRandomTheme()` - Get random theme (utils/themes.ts)

## Color Effects

- `COLOR_EFFECTS` - Gradient definitions (Unicorn, Fire, Cyberpunk, Vaporwave,
  Sunset, Ocean)
- `generateGradient(text, effect)` - Create HSL gradients
  (utils/colorEffects.ts)

## Analytics

- `analytics.init()` - Initialize PostHog (utils/analytics.ts)
- `analytics.trackEvent(name, props)` - Track custom event (utils/analytics.ts)
- `analytics.trackThemeChange(theme)` - Track theme switch (utils/analytics.ts)
- `analytics.trackExport(format)` - Track PNG export (utils/analytics.ts)

## Core Concepts

- **Islands Architecture** - Fresh framework pattern for selective hydration
- **60/30/10 Theme Rule** - 60% base, 30% secondary, 10% accent colors
- **Timezone Handling** - Melbourne is 15-16hrs ahead of US, API uses "tomorrow"
  before 6pm
- **localStorage Persistence** - Sign + theme saved locally, no accounts needed
- **PWA Support** - Manifest + service worker for installability
- **Accessibility First** - WCAG compliant with aria-labels, keyboard nav,
  skip-to-content
- **SEO Optimized** - Open Graph, Twitter Cards, JSON-LD structured data
