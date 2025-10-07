import { type PageProps } from "$fresh/server.ts";
import { KofiModal } from "../islands/KofiModal.tsx";
import { AboutModal } from "../islands/AboutModal.tsx";
import { StructuredData } from "../components/StructuredData.tsx";

export default function App({ Component }: PageProps) {
  // Pass env vars to client for analytics (only public keys)
  const analyticsEnv = {
    POSTHOG_KEY: Deno.env.get("POSTHOG_KEY"),
    POSTHOG_HOST: Deno.env.get("POSTHOG_HOST"),
  };

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <title>
          Cosmic Horoscope • Horoscopes That Look As Good As They Read
        </title>
        <meta
          name="description"
          content="Get your daily, weekly, or monthly horoscope styled as shareable cosmic art. Pick your sign, apply gradients, export as beautiful images."
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://cosmic-horoscope.deno.dev" />

        {/* PWA & iOS App Meta Tags */}
        <meta name="application-name" content="Cosmic Horoscope" />
        <meta name="apple-mobile-web-app-title" content="Cosmic Horoscope" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#a78bfa" />

        {/* Open Graph */}
        <meta property="og:site_name" content="Cosmic Horoscope" />
        <meta
          property="og:title"
          content="Cosmic Horoscope • Your Horoscope as Art"
        />
        <meta
          property="og:description"
          content="Daily horoscopes styled as shareable cosmic art. Pick your sign, apply gradients, export."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cosmic-horoscope.deno.dev" />
        <meta
          property="og:image"
          content="https://cosmic-horoscope.deno.dev/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Cosmic Horoscope - Your horoscope as shareable art"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Cosmic Horoscope • Your Horoscope as Art"
        />
        <meta
          name="twitter:description"
          content="Daily horoscopes styled as shareable cosmic art. Pick your sign, apply gradients, export."
        />
        <meta
          name="twitter:image"
          content="https://cosmic-horoscope.deno.dev/og-image.jpg"
        />
        <meta
          name="twitter:image:alt"
          content="Cosmic Horoscope - Your horoscope as shareable art"
        />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS Icon Support */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Favicon */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>"
        />

        {/* Fonts - JetBrains Mono for better terminal experience */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Styles */}
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/cosmic-animations.css" />

        {/* Global animation and interaction styles */}
        <style>
          {`
          /* Spring physics for buttons */
          button {
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          /* Better font rendering */}
          body, .font-mono {
            font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Courier New', monospace;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          /* Smooth scrolling */}
          html {
            scroll-behavior: smooth;
          }

          /* Custom scrollbar theming */}
          ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
          }

          ::-webkit-scrollbar-track {
            background: var(--color-base-solid, #0a0a0a);
          }

          ::-webkit-scrollbar-thumb {
            background: var(--color-accent, #c084fc);
            border-radius: 6px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: var(--color-border, #a855f7);
          }

          /* Spring bounce animation for interactive elements */}
          @keyframes spring-in {
            0% {
              transform: scale(0.9);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          /* Glow pulse for important elements */}
          @keyframes glow-pulse {
            0%, 100% {
              filter: drop-shadow(0 0 10px var(--color-accent));
              opacity: 0.9;
            }
            50% {
              filter: drop-shadow(0 0 20px var(--color-accent)) drop-shadow(0 0 30px var(--color-border));
              opacity: 1;
            }
          }

          /* Magnetic button hover effect */
          button:hover {
            filter: drop-shadow(0 0 8px var(--color-accent));
          }

          /* Respect reduced motion preferences */}
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          `}
        </style>

        {/* Analytics env vars */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(analyticsEnv)};`,
          }}
        />

        {/* Structured Data for SEO */}
        <StructuredData />
      </head>
      <body>
        {/* Skip to content link for keyboard users */}
        <a
          href="#main-content"
          class="sr-only focus:not-sr-only"
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 99999,
            padding: "0.5rem 1rem",
            backgroundColor: "var(--color-accent)",
            color: "var(--color-text)",
            borderRadius: "0.5rem",
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "bold",
          }}
        >
          Skip to content
        </a>

        {/* Real grain texture using noise image */}
        <div
          id="grain-layer"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.08,
            // Using a base64 noise pattern for true random grain
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='9' numOctaves='4' seed='5'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />

        {/* Optional: Subtle scanlines on top (much lighter) */}
        <div
          id="scan-layer"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 10000,
            opacity: 0.03,
            background: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0.2) 3px,
              transparent 3px,
              transparent 6px
            )`,
          }}
        />
        <Component />

        {/* Ko-fi donation modal */}
        <KofiModal
          kofiUsername="madebypablo"
          title="Support Free Cosmic Readings ☕"
          description="Your support keeps this tool free, ad-free, and open for everyone!"
        />

        {/* About modal */}
        <AboutModal />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('🔮 SW registered:', registration.scope))
                    .catch(error => console.log('SW registration failed:', error));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
