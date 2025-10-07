// ===================================================================
// BACKGROUND EFFECTS - Animated mesh gradients & cosmic particles
// ===================================================================
// Theme-aware background animations with mesh gradients, floating orbs,
// and cursor effects. Each theme has unique visual characteristics.

import { useEffect, useRef } from "preact/hooks";

export default function BackgroundEffects() {
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  // Cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX}px`;
        cursorGlowRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Animated Mesh Gradients - Theme aware via CSS variables */}
      <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Main mesh gradient layers */}
        <div
          class="absolute w-[800px] h-[800px] -top-40 -left-40 rounded-full mesh-gradient-1"
          style={{
            background:
              "radial-gradient(circle, var(--mesh-1, #9333ea) 0%, var(--mesh-2, #ec4899) 50%, transparent 70%)",
            opacity: "0.25",
            filter: "blur(80px)",
            animation: "mesh-float-1 20s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
        <div
          class="absolute w-[600px] h-[600px] top-20 -right-20 rounded-full mesh-gradient-2"
          style={{
            background:
              "radial-gradient(circle, var(--mesh-2, #ec4899) 0%, var(--mesh-3, #f59e0b) 40%, transparent 70%)",
            opacity: "0.2",
            filter: "blur(70px)",
            animation: "mesh-float-2 25s ease-in-out infinite",
            animationDelay: "5s",
            willChange: "transform, opacity",
          }}
        />
        <div
          class="absolute w-[500px] h-[500px] bottom-20 left-1/4 rounded-full mesh-gradient-3"
          style={{
            background:
              "radial-gradient(circle, var(--mesh-3, #f59e0b) 0%, var(--mesh-1, #9333ea) 40%, transparent 70%)",
            opacity: "0.25",
            filter: "blur(60px)",
            animation: "mesh-float-3 18s ease-in-out infinite",
            animationDelay: "10s",
            willChange: "transform, opacity",
          }}
        />

        {/* Floating Orbs - Magic particles */}
        <div
          class="absolute w-32 h-32 orb orb-1"
          style={{
            top: "15%",
            left: "70%",
            background:
              "radial-gradient(circle, var(--color-accent, #c084fc) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(15px)",
            opacity: "0.4",
            animation: "orb-float 15s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
        <div
          class="absolute w-24 h-24 orb orb-2"
          style={{
            top: "60%",
            left: "15%",
            background:
              "radial-gradient(circle, var(--mesh-2, #ec4899) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(12px)",
            opacity: "0.35",
            animation: "orb-float 18s ease-in-out infinite",
            animationDelay: "5s",
            willChange: "transform, opacity",
          }}
        />
        <div
          class="absolute w-40 h-40 orb orb-3"
          style={{
            top: "40%",
            left: "85%",
            background:
              "radial-gradient(circle, var(--mesh-3, #f59e0b) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(18px)",
            opacity: "0.3",
            animation: "orb-float 20s ease-in-out infinite",
            animationDelay: "10s",
            willChange: "transform, opacity",
          }}
        />

        {/* Floating particles - subtle dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            class="absolute w-1 h-1 rounded-full particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: "var(--color-accent, #c084fc)",
              opacity: "0.3",
              animation: `particle-float ${15 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
              filter: "blur(1px)",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Cursor Glow Effect - Hidden on mobile */}
      <div
        ref={cursorGlowRef}
        class="cursor-glow hidden md:block"
        style={{
          position: "fixed",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, var(--color-accent, #c084fc) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: "screen",
          opacity: "0.15",
          transform: "translate(-100px, -100px)",
          filter: "blur(40px)",
          transition: "left 0.15s ease-out, top 0.15s ease-out",
          willChange: "transform",
        }}
      />

      {/* Animation Styles */}
      <style>
        {`
        /* Mesh gradient floating animations */
        @keyframes mesh-float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          25% {
            transform: translate(-30px, -20px) scale(1.05);
            opacity: 0.3;
          }
          50% {
            transform: translate(-15px, -40px) scale(0.95);
            opacity: 0.2;
          }
          75% {
            transform: translate(-40px, -10px) scale(1.02);
            opacity: 0.28;
          }
        }

        @keyframes mesh-float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.2;
          }
          33% {
            transform: translate(30px, 25px) scale(1.08) rotate(5deg);
            opacity: 0.15;
          }
          66% {
            transform: translate(-20px, 35px) scale(0.92) rotate(-5deg);
            opacity: 0.25;
          }
        }

        @keyframes mesh-float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          40% {
            transform: translate(25px, -30px) scale(0.9);
            opacity: 0.18;
          }
          80% {
            transform: translate(-25px, 15px) scale(1.1);
            opacity: 0.3;
          }
        }

        /* Floating orb animations */
        @keyframes orb-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(40px, -50px) scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translate(-30px, -70px) scale(0.9);
            opacity: 0.3;
          }
          75% {
            transform: translate(50px, -30px) scale(1.1);
            opacity: 0.5;
          }
        }

        /* Particle floating animation */
        @keyframes particle-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -20px) scale(1.5);
            opacity: 0.5;
          }
          50% {
            transform: translate(-20px, -40px) scale(0.8);
            opacity: 0.2;
          }
          75% {
            transform: translate(15px, -10px) scale(1.2);
            opacity: 0.4;
          }
        }

        /* Disable animations on mobile to save battery */
        @media (max-width: 768px) {
          .mesh-gradient-1,
          .mesh-gradient-2,
          .mesh-gradient-3 {
            animation-duration: 40s !important;
          }
          .orb {
            animation-duration: 30s !important;
          }
          .particle {
            display: none;
          }
          .cursor-glow {
            display: none !important;
          }
        }

        /* Respect user's motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .mesh-gradient-1,
          .mesh-gradient-2,
          .mesh-gradient-3,
          .orb,
          .particle,
          .cursor-glow {
            animation: none !important;
            opacity: 0.15 !important;
          }
        }
        `}
      </style>
    </>
  );
}
