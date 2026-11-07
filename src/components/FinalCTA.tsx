import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Terminal } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

interface FinalCTAProps {
  onOpenRegister: () => void;
}

export default function FinalCTA({ onOpenRegister }: FinalCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { content } = useSiteContent();
  const cta = content?.finalCta || {};

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.05, 1.12]);

  const scrollToBattlegrounds = () => {
    const el = document.getElementById('challenges');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const badge = cta.badge || 'OFFLINE REGISTRATION WINDOW IS LIVE';
  const title = cta.title || 'READY TO ENTER';
  const titleAccent = cta.titleAccent && cta.titleAccent !== 'THE HACKVERSE?' ? cta.titleAccent : 'SYNTHARA2.0?';
  const description = cta.description || 'October 16, 2026 at Government College of Engineering Kalahandi. 24 hours of non-stop building, classified quests, and ₹1,50,000+ in rewards.';
  const registerLabel = cta.registerLabel || 'REGISTER YOUR TEAM NOW';
  const browseLabel = cta.browseLabel || 'BROWSE PROBLEM STATEMENTS';

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-24 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden text-center select-none"
      style={{ isolation: 'isolate' }}
    >
      {/* Cinematic Bridge Battle Final CTA Background with Parallax Scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <motion.img
          src="/assets/bg_shadow_fight_bridge.jpg"
          alt="Mountain Bridge Final Battle Background"
          style={{ y: bgY, scale: bgScale }}
          className="w-full h-[124%] -top-[12%] absolute inset-0 object-cover object-center opacity-90 brightness-[0.75] contrast-[1.1] saturate-[1.2] will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090c]/65 via-transparent to-[#07090c]/70" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101010] border-2 border-[#FFAA00] font-mono text-xs text-[#FFDF78] font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
          <span className="w-2 h-2 rounded-none bg-[#55FF55] inline-block shadow-[1px_1px_0_#000] animate-pulse" />
          <span>{badge}</span>
        </div>

        <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
          {title} <br />
          <span className="text-[#55FF55]">{titleAccent}</span>
        </h2>

        <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed [text-shadow:_1px_1px_0_#000]">
          {description}
        </p>

        {/* HackVerse Minecraft Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            id="final-cta-register-btn"
            onClick={onOpenRegister}
            className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-sm sm:text-base uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>{registerLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="final-cta-browse-btn"
            onClick={scrollToBattlegrounds}
            className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-[#707070] hover:bg-[#808080] text-white font-mono font-black text-sm sm:text-base uppercase tracking-wider border-4 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#9E9E9E] active:border-b-[#9E9E9E] shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Terminal className="w-4 h-4 text-[#55FF55]" />
            <span>{browseLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
