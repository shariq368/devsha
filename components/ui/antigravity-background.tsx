import React, { useEffect, useRef } from 'react';

// Color palette inspired by antigravity.google, adapted to brand
const PARTICLE_COLORS = [
  { r: 34, g: 197, b: 94 },   // Brand green (#22C55E)
  { r: 6, g: 182, b: 212 },   // Cyan (#06B6D4)
  { r: 236, g: 72, b: 153 },  // Pink (#EC4899)
  { r: 234, g: 179, b: 8 },   // Yellow (#EAB308)
  { r: 249, g: 115, b: 22 },  // Orange (#F97316)
  { r: 255, g: 255, b: 255 }, // White
];

/*
 * Keeping the particle count bounded matters more than it looks: the
 * connection pass is O(n²), so an uncapped density-based count (which reached
 * ~600 particles on a 1440p display) burned the whole frame budget on the main
 * thread and made scrolling stutter across the entire site.
 */
const MAX_PARTICLES_DESKTOP = 100;
const MAX_PARTICLES_MOBILE = 35;
const AREA_PER_PARTICLE = 14000;

const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 3;
const CONNECTION_DISTANCE = 110;
const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

// Glow sprites are pre-rendered once per color. Drawing a cached bitmap is far
// cheaper than ctx.shadowBlur, which was being reconfigured for every particle.
const SPRITE_RADIUS = 32;

interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colorIndex: number;
  opacity: number;
  baseOpacity: number;
  phase: number;       // for sine-wave sway
}

function createParticle(width: number, height: number): ParticleData {
  const baseOpacity = Math.random() * 0.5 + 0.15;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.08),  // Anti-gravity: float upward
    size: Math.random() * 3 + 1,
    colorIndex: Math.floor(Math.random() * PARTICLE_COLORS.length),
    opacity: baseOpacity,
    baseOpacity,
    phase: Math.random() * Math.PI * 2,
  };
}

function buildGlowSprites(): HTMLCanvasElement[] {
  return PARTICLE_COLORS.map(({ r, g, b }) => {
    const sprite = document.createElement('canvas');
    sprite.width = SPRITE_RADIUS * 2;
    sprite.height = SPRITE_RADIUS * 2;

    const sctx = sprite.getContext('2d');
    if (!sctx) return sprite;

    const gradient = sctx.createRadialGradient(
      SPRITE_RADIUS, SPRITE_RADIUS, 0,
      SPRITE_RADIUS, SPRITE_RADIUS, SPRITE_RADIUS
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(0.18, `rgba(${r}, ${g}, ${b}, 0.85)`);
    gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.28)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, SPRITE_RADIUS * 2, SPRITE_RADIUS * 2);
    return sprite;
  });
}

export const AntigravityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sprites = buildGlowSprites();
    const mouse = { x: -9999, y: -9999 };
    let particles: ParticleData[] = [];
    let width = 0;
    let height = 0;
    let animFrameId = 0;
    let running = false;
    let isIntersecting = true;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const resize = () => {
      /*
       * Measure the parent, not the window. A <canvas> is a replaced element,
       * so `absolute inset-0` does not stretch it — its layout size comes from
       * its own width/height. Sizing it from the parent makes it cover the full
       * hero (which is taller than the viewport) and stops mobile URL-bar
       * show/hide from resizing it on every scroll.
       */
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);
      if (nextWidth === 0 || nextHeight === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const isFirstLayout = particles.length === 0;
      // Ignore small height-only jitter (mobile browser chrome) so particles
      // aren't destroyed and recreated while the user scrolls.
      const changedMeaningfully =
        nextWidth !== width || Math.abs(nextHeight - height) > 120;

      width = nextWidth;
      height = nextHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (isFirstLayout || changedMeaningfully) {
        const maxLimit = width < 768 ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
        const count = Math.min(
          maxLimit,
          Math.floor((width * height) / AREA_PER_PARTICLE)
        );
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push(createParticle(width, height));
        }
      }
    };

    const draw = () => {
      // clearRect keeps the canvas genuinely transparent. The previous
      // semi-opaque fill accumulated to solid #0A0A0A within half a second,
      // which silently hid the hero's gradient layers underneath.
      ctx.clearRect(0, 0, width, height);

      // --- Connections ---
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= CONNECTION_DISTANCE_SQ) continue;

          // sqrt only for the pairs that actually get drawn.
          const lineOpacity = (1 - Math.sqrt(distSq) / CONNECTION_DISTANCE) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
          ctx.stroke();
        }
      }

      // --- Particles ---
      for (const p of particles) {
        const glowRadius = p.size * 4;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.drawImage(
          sprites[p.colorIndex],
          p.x - glowRadius,
          p.y - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const p of particles) {
        // Sine-wave sway
        p.phase += 0.008;
        p.x += p.vx + Math.sin(p.phase) * 0.15;
        p.y += p.vy;

        // Opacity pulse
        p.opacity = p.baseOpacity + Math.sin(p.phase * 2) * 0.1;

        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < MOUSE_RADIUS * MOUSE_RADIUS && mDistSq > 0) {
          const mDist = Math.sqrt(mDistSq);
          const force = (1 - mDist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }

        // Wrap edges
        if (p.y + p.size < 0) {
          p.y = height + p.size;
          p.x = Math.random() * width;
        } else if (p.y > height + p.size) {
          p.y = -p.size;
          p.x = Math.random() * width;
        }
        if (p.x < -p.size) p.x = width + p.size;
        else if (p.x > width + p.size) p.x = -p.size;
      }
    };

    const animate = () => {
      step();
      draw();
      animFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running || prefersReducedMotion) return;
      running = true;
      animFrameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(animFrameId);
    };

    // Only animate while the hero is actually on screen and the tab is visible.
    const syncRunState = () => {
      if (isIntersecting && document.visibilityState === 'visible') start();
      else stop();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    const handlePointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (!running) draw();
      }, 150);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncRunState();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // The hero grows/shrinks with its content, not just with the window.
    let resizeObserver: ResizeObserver | undefined;
    if (canvas.parentElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('visibilitychange', syncRunState);

    resize();
    if (prefersReducedMotion) {
      draw(); // one static frame
    } else {
      syncRunState();
    }

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', syncRunState);
      clearTimeout(resizeTimer);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 bg-transparent pointer-events-none"
    />
  );
};

export default AntigravityBackground;
