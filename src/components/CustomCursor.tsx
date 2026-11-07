import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for magnetic trailing feel
  const springX = useSpring(mouseX, { stiffness: 450, damping: 32 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 32 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor');
        setCursorText(text);
        setIsHovered(true);
        return;
      }

      const interactive = target.closest('button, a, input, select, textarea, [role="button"]');
      if (interactive) {
        setIsHovered(true);
        setCursorText(null);
      } else {
        setIsHovered(false);
        setCursorText(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Precision inner center red laser dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full bg-[#FF5500] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#DC2626]"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer Shadow Reticle Ring */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 ${
          cursorText
            ? 'bg-[#DC2626] text-white font-space font-bold tracking-widest text-[10px] shadow-[0_0_20px_#DC2626]'
            : isHovered
            ? 'border-2 border-[#DC2626] bg-[#DC2626]/10 backdrop-blur-[2px] shadow-[0_0_15px_rgba(220,38,38,0.6)]'
            : 'border border-[#DC2626]/40 bg-black/20'
        }`}
        style={{
          x: springX,
          y: springY,
        }}
        animate={{
          width: cursorText ? 80 : isHovered ? 52 : 30,
          height: cursorText ? 80 : isHovered ? 52 : 30,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {/* Reticle ticks when hovered */}
        {isHovered && !cursorText && (
          <>
            <div className="absolute top-0 w-1 h-1 bg-[#FF5500] -translate-y-1" />
            <div className="absolute bottom-0 w-1 h-1 bg-[#FF5500] translate-y-1" />
            <div className="absolute left-0 w-1 h-1 bg-[#FF5500] -translate-x-1" />
            <div className="absolute right-0 w-1 h-1 bg-[#FF5500] translate-x-1" />
          </>
        )}

        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="select-none tracking-widest uppercase font-space text-[10px]"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
