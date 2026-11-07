import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Prizes from './Prizes';
import Teams from './Teams';

export default function PrizesAndTeamsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth parallax scroll across the combined height of Prize Pool & Featured Squads
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-transparent"
      style={{ isolation: 'isolate' }}
    >
      {/* Single Continuous Cinematic Background for STATE PRIZE POOL & FEATURED SQUADS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.img
          src="/assets/bg_prizes_temple_pond.jpg"
          alt="Temple Pond Warriors Arena Background"
          style={{ y: bgY, scale: bgScale }}
          className="absolute left-0 top-[-8%] w-full h-[116%] object-cover object-center opacity-95 brightness-[0.84] contrast-[1.12] saturate-[1.2] will-change-transform"
        />
        {/* Soft top gradient transition from Timeline */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505] via-[#050505]/40 to-transparent" />
        {/* Soft bottom gradient transition to Sponsors */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        {/* Subtle lateral vignette for reading comfort */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50" />
        {/* Amber battle burst ambient radiance */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_40%,rgba(255,170,0,0.06),transparent)]" />
      </div>

      {/* State Prize Pool Section */}
      <Prizes />

      {/* Divider or seamless continuation into Featured Squads */}
      <div className="relative z-[2] max-w-5xl mx-auto px-4">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FFAA00]/40 to-transparent" />
      </div>

      {/* Featured Squads Section */}
      <Teams />
    </div>
  );
}
