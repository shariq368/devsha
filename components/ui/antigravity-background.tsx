import React, { useEffect, useRef } from 'react';

// Color palette inspired by antigravity.google, adapted to brand
const PARTICLE_COLORS = [
  { r: 34, g: 197, b: 94 },   // Brand green (#22C55E)
  { r: 74, g: 222, b: 128 },  // Light green (#4ADE80)
  { r: 16, g: 185, b: 129 },  // Emerald (#10B981)
  { r: 6, g: 182, b: 212 },   // Cyan (#06B6D4)
  { r: 255, g: 255, b: 255 }, // White
  { r: 59, g: 130, b: 246 },  // Blue (#3B82F6)
];

interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: { r: number; g: number; b: number };
  opacity: number;
  baseOpacity: number;
  phase: number;       // for sine-wave sway
  pulseSpeed: number;  // opacity pulsing
}

function createParticle(width: number, height: number): ParticleData {
  const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  const baseOpacity = Math.random() * 0.5 + 0.15;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.08),  // Anti-gravity: float upward
    size: Math.random() * 3 + 1,
    color,
    opacity: baseOpacity,
    baseOpacity,
    phase: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.01 + 0.005,
  };
}

export const AntigravityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<ParticleData[]>([]);
  const animFrameRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const MOUSE_RADIUS = 120;
    const MOUSE_FORCE = 3;
    const CONNECTION_DISTANCE = 110;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimensionsRef.current = { width: w, height: h };
      canvas.width = w;
      canvas.height = h;

      // Density: ~1 particle per 6000px² for a rich but performant look
      const count = Math.floor((w * h) / 6000);
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(w, h));
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const animate = () => {
      const { width, height } = dimensionsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // --- Draw connections ---
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const lineOpacity = (1 - dist / CONNECTION_DISTANCE) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // --- Update & draw particles ---
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
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > 0) {
          const force = (1 - mDist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }

        // Wrap edges
        if (p.y + p.size < 0) {
          p.y = height + p.size;
          p.x = Math.random() * width;
        }
        if (p.y > height + p.size) {
          p.y = -p.size;
          p.x = Math.random() * width;
        }
        if (p.x < -p.size) p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;

        // Draw glow
        const { r, g, b } = p.color;
        ctx.save();
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.8})`;
        ctx.shadowBlur = p.size * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    resize();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 bg-transparent"
      style={{ touchAction: 'none' }}
    />
  );
};