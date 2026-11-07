import { useEffect, useRef } from 'react';

export default function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 30 : 65;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      alpha: number;
      color: string;
      maxAlpha: number;
      pulseSpeed: number;
      glow: boolean;
    }

    const colors = [
      'rgba(255, 215, 0, ',    // Bright golden weapon spark
      'rgba(255, 170, 0, ',    // Fiery amber ember
      'rgba(85, 255, 85, ',    // Bamboo green glint
      'rgba(255, 255, 255, ',  // White spark flash
      'rgba(255, 100, 30, ',   // Orange clash spark
    ];

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isEmber = Math.random() > 0.4;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isEmber ? Math.random() * 2 + 0.8 : Math.random() * 1.2 + 0.4,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.65 - 0.15, // Floating upward like embers
        alpha: Math.random() * 0.6,
        maxAlpha: isEmber ? Math.random() * 0.7 + 0.2 : Math.random() * 0.35 + 0.1,
        color: isEmber
          ? colors[Math.floor(Math.random() * 3)]
          : colors[3],
        pulseSpeed: Math.random() * 0.02 + 0.005,
        glow: isEmber,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.pulseSpeed;

        if (p.alpha > p.maxAlpha || p.alpha < 0.08) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        // Loop boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.glow) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 170, 0, 0.75)';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0a0a0a]">
      {/* Shadow Fight Bamboo Duel Arena Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/shadow_arena_bg.jpg"
          alt="Shadow Fight Bamboo Battle Arena"
          className="w-full h-full object-cover object-center opacity-70 brightness-[0.92] contrast-[1.12] animate-bg-pan-lr"
        />
        {/* Soft atmospheric ambient vignette to ensure retro monospace cards remain ultra-sharp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]/60" />
        <div className="absolute inset-0 bg-[#0a0a0a]/20" />
      </div>

      {/* Arena Grid Matrix tactical texture */}
      <div className="absolute inset-0 arena-grid-pattern opacity-25 z-10" />

      {/* Atmospheric amber/lime ambient glow accents */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full bg-[#FFAA00]/12 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#55FF55]/8 blur-[160px] pointer-events-none" />
      <div className="absolute top-[70%] -right-[10%] w-[650px] h-[650px] rounded-full bg-[#FFAA00]/10 blur-[160px] pointer-events-none" />

      {/* Subtle particles and floating embers */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />

      {/* Film grain for retro/cinematic texture */}
      <div className="absolute inset-0 cinema-grain pointer-events-none opacity-30 z-30" />
    </div>
  );
}
