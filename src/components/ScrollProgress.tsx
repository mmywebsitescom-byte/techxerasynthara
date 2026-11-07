import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Compass, ArrowUp } from 'lucide-react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const p = Math.round(latest * 100);
      setPercent(p);
      setIsVisible(latest > 0.05);
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top 3px progress bar with dual glowing gradient */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-white/5 pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-[#55FF55] via-[#FFAA00] to-[#FF4655] origin-left shadow-[0_0_12px_#FFAA00]"
          style={{ scaleX }}
        />
      </div>

      {/* Floating Tactical Scroll HUD Widget (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 pointer-events-auto"
      >
        <button
          onClick={scrollToTop}
          title="Scroll back to top"
          className="group flex items-center gap-2 px-3 py-1.5 bg-[#101010]/90 backdrop-blur-md border-2 border-[#555555] hover:border-[#FFAA00] text-neutral-300 hover:text-white font-mono text-[11px] font-bold shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-[#55FF55] group-hover:rotate-45 transition-transform" />
          <span className="text-[#FFDF78]">{percent}%</span>
          <ArrowUp className="w-3 h-3 text-[#FFAA00] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </motion.div>
    </>
  );
}

