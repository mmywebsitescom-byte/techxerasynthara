import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { useAudio } from '../context/AudioContext';
import SkeletonImage from './SkeletonImage';

interface LoadingScreenProps {
  onComplete: () => void;
}

const PHASES = [
  { threshold: 0,  text: 'ESTABLISHING SECURE LINK...' },
  { threshold: 25, text: 'LOADING COMBAT PROTOCOLS...' },
  { threshold: 55, text: 'SUMMONING WARRIOR DATABASE...' },
  { threshold: 80, text: 'ARENA SYSTEMS ONLINE...' },
  { threshold: 95, text: 'SYSTEM READY // ENTER THE ARENA' },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { content } = useSiteContent();
  const { isPlaying, isMuted, toggleSound } = useAudio();
  const ls = content?.loadingScreen || {};
  const isEnabled = ls.enabled !== false;
  const totalDuration = typeof ls.durationMs === 'number' && ls.durationMs >= 500 ? ls.durationMs : 4600;

  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'fadeout'>('loading');
  const [statusText, setStatusText] = useState(PHASES[0].text);
  const [isReady, setIsReady] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
    }))
  );
  const doneRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) {
      onComplete();
      return;
    }

    const intervalMs = 20;
    const start = performance.now();

    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      const raw = Math.min(100, (elapsed / totalDuration) * 100);
      setPercent(raw);

      // Update status text
      for (let i = PHASES.length - 1; i >= 0; i--) {
        if (raw >= PHASES[i].threshold) {
          setStatusText(PHASES[i].text);
          break;
        }
      }

      if (raw >= 95) setIsReady(true);

      if (elapsed >= totalDuration && !doneRef.current) {
        doneRef.current = true;
        clearInterval(timer);
        setPercent(100);
        setPhase('fadeout');
        setTimeout(() => onComplete(), 550);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete, totalDuration, isEnabled]);

  const handleSkip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase('fadeout');
    setTimeout(() => onComplete(), 400);
  };

  const displayPercent = String(Math.floor(percent)).padStart(2, '0');

  return (
    <AnimatePresence>
      {phase !== 'fadeout' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ background: '#040608', isolation: 'isolate' }}
        >
          {/* Cinematic Warrior Mountain Arena Background — Enhanced & Highly Visible */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <motion.img
              src="/assets/bg_pathway_mountain_village.jpg"
              alt="Warrior Battle Arena"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: Math.max(3, totalDuration / 1000), ease: 'easeOut' }}
              className="w-full h-full object-cover object-center opacity-100 brightness-[0.92] contrast-[1.1] saturate-[1.15]"
            />
            {/* Subtle cinematic ambient wash — keeps warriors clear while ensuring typography contrast */}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#040608]/80 via-[#040608]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#040608]/85 via-[#040608]/40 to-transparent" />
            {/* Golden battle glow accent in center matching the spark clash */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgba(255,170,0,0.08),transparent)]" />
          </div>

          {/* Ambient deep gold glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, transparent 65%)' }}
          />

          {/* Film grain */}
          <div className="absolute inset-0 cinema-grain pointer-events-none opacity-60" />

          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(212,175,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.6) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.id % 3 === 0 ? '#D4AF37' : p.id % 3 === 1 ? '#FF4655' : '#ffffff',
                opacity: 0.15,
              }}
              animate={{ y: [0, -18, 0], opacity: [0.1, 0.35, 0.1] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Corner accent lines */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]/30 pointer-events-none" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]/30 pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37]/30 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]/30 pointer-events-none" />

          {/* Sound Toggle (Top Right) */}
          <div className="absolute top-6 right-6 z-20">
            <button
              id="loading-sound-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSound();
              }}
              aria-label={isPlaying && !isMuted ? 'Mute background sound' : 'Play background sound'}
              className={`flex items-center gap-2 px-3 py-1.5 sf-clip-angled-sm border transition-all cursor-pointer text-xs font-mono backdrop-blur-md ${
                isPlaying && !isMuted
                  ? 'bg-[#0f1712]/90 border-[#55FF55]/60 text-[#55FF55] shadow-[0_0_12px_rgba(85,255,85,0.3)]'
                  : 'bg-black/60 border-[#D4AF37]/40 text-[#F5D061] hover:border-[#D4AF37]'
              }`}
            >
              {isPlaying && !isMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#55FF55] animate-pulse" />
                  <span className="tracking-wider">SOUND: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="tracking-wider text-neutral-400">SOUND: OFF</span>
                </>
              )}
            </button>
          </div>

          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-full">
            {/* Org badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-6"
            >
              <span className="block w-6 h-[1px] bg-[#D4AF37]/50" />
              <span className="font-space text-[10px] tracking-[0.5em] text-[#D4AF37]/80 uppercase font-bold">
                {ls.presentsText || 'TECHXERA PRESENTS'}
              </span>
              <span className="block w-6 h-[1px] bg-[#D4AF37]/50" />
            </motion.div>

            {/* Logo icon */}
            {(ls.showLogo !== false) && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 180 }}
                className="relative mb-6"
              >
                {(ls.logoUrl && String(ls.logoUrl).trim()) ? (
                  <SkeletonImage
                    src={String(ls.logoUrl)}
                    alt="SYNTHARA2.0 Logo"
                    className="w-28 h-28 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                    containerClassName="w-28 h-28 flex items-center justify-center"
                  />
                ) : (content?.navbar?.siteLogoUrl && !ls.logoUrlDeleted) ? (
                  <SkeletonImage
                    src={String(content.navbar.siteLogoUrl)}
                    alt="SYNTHARA2.0 Logo"
                    className="w-28 h-28 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                    containerClassName="w-28 h-28 flex items-center justify-center"
                  />
                ) : (
                  <span
                    className="font-cinzel font-black text-5xl leading-none"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #F5D061, #D4AF37)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    HV
                  </span>
                )}
                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: '1px solid rgba(212,175,55,0.2)' }}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            )}

            {/* Main Monospace Title */}
            <div className="mb-1 w-full flex justify-center">
              <motion.h1
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="sf-script-title sf-gothic-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #C8A826 0%, #F5D061 40%, #D4AF37 70%, #9A7A1A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))',
                }}
              >
                {ls.titleGothic || content?.hero?.titleGothic || content?.eventInfo?.titleGothic || '𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0'}
              </motion.h1>
            </div>

            {/* Year / Accent */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="sf-script-title sf-gothic-title text-3xl sm:text-5xl leading-none mb-2"
              style={{
                background: 'linear-gradient(135deg, #DC2626, #FF4655, #DC2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {ls.titleAccent || content?.hero?.titleAccent || content?.eventInfo?.titleAccent || "2026"}
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="font-space text-[10px] sm:text-xs tracking-[0.4em] text-[#A1A1A1] uppercase mt-1 font-medium"
            >
              {ls.tagline || content?.eventInfo?.tagline || 'BUILD THE FUTURE • ENTER THE ARENA'}
            </motion.p>

            {/* Live Status text */}
            <motion.div
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 font-space text-[11px] tracking-[0.3em] uppercase font-bold"
              style={{ color: isReady ? '#55FF55' : '#D4AF37' }}
            >
              {isReady && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#55FF55] mr-2 animate-pulse align-middle" />
              )}
              {statusText}
            </motion.div>
          </div>

          {/* Bottom progress section */}
          <div className="absolute bottom-10 sm:bottom-14 w-72 sm:w-[420px] flex flex-col items-center z-10 px-4">
            {/* Progress bar label */}
            <div className="w-full flex items-center justify-between mb-2.5 font-space text-[11px] tracking-wider">
              <span className="text-[#A1A1A1] uppercase">ARENA ACCESS</span>
              <span className="font-bold tabular-nums" style={{ color: '#D4AF37' }}>
                {displayPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-[3px] bg-white/8 rounded-full overflow-hidden relative">
              {/* Track */}
              <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full" />
              {/* Fill */}
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${percent}%`,
                  background: isReady
                    ? 'linear-gradient(90deg, #22c55e, #55FF55)'
                    : 'linear-gradient(90deg, #7F5F00, #D4AF37, #F5D061)',
                  boxShadow: isReady
                    ? '0 0 12px rgba(85,255,85,0.6)'
                    : '0 0 12px rgba(212,175,55,0.7)',
                  transition: 'background 0.5s, box-shadow 0.5s',
                }}
              />
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-y-0 w-10 pointer-events-none"
                style={{
                  left: `${Math.max(0, percent - 8)}%`,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
              />
            </div>

            {/* Skip & Sound Controls */}
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                id="skip-loading-btn"
                onClick={handleSkip}
                className="font-space text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 cursor-pointer"
                style={{ color: 'rgba(161,161,161,0.6)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(161,161,161,0.6)')}
              >
                [ SKIP — ENTER NOW ]
              </button>
              <span className="text-[#D4AF37]/30 text-[10px]">|</span>
              <button
                id="loading-bottom-sound-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSound();
                }}
                className="font-space text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                style={{ color: isPlaying && !isMuted ? '#55FF55' : 'rgba(161,161,161,0.6)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isPlaying && !isMuted ? '#55FF55' : '#D4AF37')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isPlaying && !isMuted ? '#55FF55' : 'rgba(161,161,161,0.6)')}
              >
                {isPlaying && !isMuted ? (
                  <>
                    <Volume2 className="w-3 h-3 text-[#55FF55] animate-pulse" />
                    <span>SOUND: ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3 text-neutral-500" />
                    <span>SOUND: OFF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
