import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  alphaChange: number;
  color: string;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
}

const STAR_COLORS = ['#F7F4EC', '#FFECC7', '#E29FB4', '#9AA3B8'];
const ORB_COLORS = [
  'rgba(226, 159, 180, 0.07)',
  'rgba(232, 196, 124, 0.06)',
  'rgba(116, 124, 146, 0.08)',
];

export const BackgroundStars: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let stars: Star[] = [];
    let orbs: Orb[] = [];
    let shootingStars: ShootingStar[] = [];

    const buildScene = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Batasi jumlah bintang agar animasi tetap ringan di layar besar.
      const starCount = Math.min(180, Math.floor((width * height) / 6000));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random(),
        alphaChange: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));

      orbs = Array.from({ length: 5 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 170 + 90,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: ORB_COLORS[Math.floor(Math.random() * ORB_COLORS.length)],
      }));

      shootingStars = [];
    };

    const drawOrbs = (move: boolean) => {
      orbs.forEach((orb) => {
        if (move) {
          orb.x += orb.vx;
          orb.y += orb.vy;

          if (orb.x < -orb.radius) orb.x = width + orb.radius;
          if (orb.x > width + orb.radius) orb.x = -orb.radius;
          if (orb.y < -orb.radius) orb.y = height + orb.radius;
          if (orb.y > height + orb.radius) orb.y = -orb.radius;
        }

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawStars = (twinkle: boolean) => {
      stars.forEach((star) => {
        if (twinkle) {
          star.alpha += star.alphaChange;
          if (star.alpha <= 0.1) {
            star.alpha = 0.1;
            star.alphaChange = Math.abs(star.alphaChange);
          } else if (star.alpha >= 0.95) {
            star.alpha = 0.95;
            star.alphaChange = -Math.abs(star.alphaChange);
          }
        }

        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const drawShootingStars = () => {
      if (shootingStars.length < 2 && Math.random() < 0.03) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 1,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.015;

        if (star.opacity <= 0 || star.x > width || star.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = star.opacity;
        ctx.strokeStyle = '#FFECC7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      drawOrbs(false);
      drawStars(false);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawOrbs(true);
      drawStars(true);
      drawShootingStars();
      animationFrameId = requestAnimationFrame(render);
    };

    const start = () => {
      cancelAnimationFrame(animationFrameId);
      if (reduceMotionQuery.matches) {
        renderStatic();
      } else {
        render();
      }
    };

    const handleResize = () => {
      buildScene();
      start();
    };

    const handleVisibility = () => {
      cancelAnimationFrame(animationFrameId);
      if (!document.hidden) start();
    };

    buildScene();
    start();

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.9 }}
    />
  );
};
