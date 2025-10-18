// ===================================================================
// BACKGROUND CANVAS - Swirl effect with simplex noise
// ===================================================================
// Based on ambient webpage backgrounds by Jack Rugile

import { useEffect, useRef } from "preact/hooks";
import { createNoise2D } from "simplex-noise";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Create simplex noise generator
    const simplex = createNoise2D();

    let animationId: number;
    let time = 0;

    // Offscreen canvas for blur effect
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
    };

    resize();
    window.addEventListener("resize", resize);

    // Swirl particles configuration
    const particleCount = 300;
    const tau = Math.PI * 2;
    const noiseSteps = 8; // Creates the "banding" effect

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
    }> = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 2,
        hue: 200 + Math.random() * 60, // Cyan to blue range
      });
    }

    const animate = () => {
      time += 0.005;

      // Clear offscreen canvas
      offscreenCtx.fillStyle = "rgb(10, 10, 26)";
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        // Get noise value at particle position
        const noiseValue = simplex(p.x * 0.003, p.y * 0.003 + time);

        // Convert noise to angle with stepped banding
        const angle = noiseValue * tau * noiseSteps;

        // Apply angle to velocity
        const speed = 1.5;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        offscreenCtx.fillStyle = `hsla(${p.hue}, 70%, 60%, 0.8)`;
        offscreenCtx.beginPath();
        offscreenCtx.arc(p.x, p.y, p.size, 0, tau);
        offscreenCtx.fill();
      });

      // Apply blur for glow effect
      ctx.filter = "blur(12px)";
      ctx.drawImage(offscreenCanvas, 0, 0);

      // Draw again without blur and composite
      ctx.filter = "none";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(offscreenCanvas, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      class="fixed inset-0 pointer-events-none"
      style="z-index: 1; opacity: 0.4;"
    />
  );
}
