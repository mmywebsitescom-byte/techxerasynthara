import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Terminal, Cpu, Award, ShieldAlert } from 'lucide-react';
import { Challenge } from '../types';

interface ChallengeModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForRegister: (challenge: Challenge) => void;
}

export default function ChallengeModal({
  challenge,
  isOpen,
  onClose,
  onSelectForRegister,
}: ChallengeModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // When a new challenge is opened, scroll the modal body back to top
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isOpen, challenge?.id]);

  if (!isOpen || !challenge) return null;

  const parseArray = (val: unknown): string[] => {
    if (Array.isArray(val) && val.length > 0) return val.map(String).filter(Boolean);
    if (typeof val === 'string' && val.trim()) {
      return val.includes('\n')
        ? val.split('\n').map((s) => s.trim().replace(/^[-*•\d.]+\s*/, '')).filter(Boolean)
        : val.split(',').map((s) => s.trim().replace(/^[-*•\d.]+\s*/, '')).filter(Boolean);
    }
    return [];
  };

  const requirements = parseArray(challenge.requirements);
  const judgingCriteria = parseArray(challenge.judgingCriteria);
  const skills = parseArray(challenge.skills);
  const rules = parseArray((challenge as any).rules);

  return (
    <AnimatePresence>
      {/* Full-screen portal root — sits above everything including navbar (z-50) */}
      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6"
      >
        {/* Backdrop — fully opaque dark overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
          style={{ zIndex: 0 }}
        />

        {/* HackVerse Retro Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] overflow-hidden"
          style={{ zIndex: 1 }}
        >
          {/* Windows 95 / Retro Arcade Window Title Bar (STICKY TOP) */}
          <div className="shrink-0 bg-[#2A2A2A] text-white px-3 sm:px-4 py-2 flex items-center justify-between border-b-2 border-[#555555] select-none shadow-[inset_0_-1px_0_#000]">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider min-w-0 mr-2">
              <span className="w-2.5 h-2.5 bg-[#55FF55] inline-block shrink-0 shadow-[1px_1px_0_#000]" />
              <span className="truncate">QUEST DOSSIER // CB-TRK-{challenge.number}: {challenge.title}</span>
            </div>
            <button
              id="close-challenge-modal-btn"
              onClick={onClose}
              className="w-7 h-7 bg-[#DBDBDB] hover:bg-[#EAEAEA] active:bg-[#BFBFBF] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] text-black font-black flex items-center justify-center active:translate-y-0.5 cursor-pointer shrink-0 transition-transform"
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 retro-modal-scrollbar"
            style={{ overscrollBehavior: 'contain' }}
          >
            {/* Top Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#101010] border-4 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#FFAA00] text-black font-mono font-black text-xs px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  TRACK {challenge.number}
                </span>
                <span className="text-[#55FF55] font-mono font-bold text-xs">
                  {challenge.category}
                </span>
                <span className="text-[#F5D061] bg-[#1a1505] font-mono font-bold text-xs px-2 py-0.5 border border-[#FFAA00]/50">
                  BOUNTY: {challenge.prizePool || '₹5,000'}
                </span>
              </div>
              <span className="text-white bg-[#555555] font-mono font-bold text-xs px-2 py-0.5 border border-black">
                DIFFICULTY: {challenge.difficulty}
              </span>
            </div>

            {/* Problem Statement Box */}
            <div className="p-4 sm:p-5 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]">
              <div className="text-[11px] font-mono font-bold text-[#FFDF78] uppercase tracking-wider mb-2 flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                <Terminal className="w-3.5 h-3.5 text-[#55FF55]" />
                <span>PROBLEM SPECIFICATION & OBJECTIVE</span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                {challenge.problemStatement}
              </p>
            </div>

            {/* Two Column Grid: Objectives & Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Objectives */}
              <div className="p-4 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444]">
                <h4 className="font-mono text-xs font-black text-[#55FF55] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>CORE REQUIREMENTS ({requirements.length})</span>
                </h4>
                {requirements.length > 0 ? (
                  <ul className="space-y-2 font-mono text-xs text-neutral-300">
                    {requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#FFAA00] font-bold shrink-0">{idx + 1}.</span>
                        <span className="leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-mono text-xs text-neutral-400 italic">No specific requirements listed.</p>
                )}
              </div>

              {/* Evaluation Criteria */}
              <div className="p-4 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444]">
                <h4 className="font-mono text-xs font-black text-[#FFDF78] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>EVALUATION BENCHMARKS ({judgingCriteria.length})</span>
                </h4>
                {judgingCriteria.length > 0 ? (
                  <ul className="space-y-2 font-mono text-xs text-neutral-300">
                    {judgingCriteria.map((crit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#55FF55] font-bold shrink-0">•</span>
                        <span className="leading-relaxed">{crit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-mono text-xs text-neutral-400 italic">No specific benchmarks listed.</p>
                )}
              </div>
            </div>

            {/* Rules & Protocols Section */}
            <div className="p-4 sm:p-5 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10 flex-wrap">
                <h4 className="font-mono text-xs font-black text-[#FF4655] tracking-wider uppercase flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                  <ShieldAlert className="w-4 h-4 text-[#FF4655]" />
                  <span>RULES & PROTOCOLS {rules.length > 0 ? `(${rules.length})` : ''}</span>
                </h4>
                <span className="font-mono text-[10px] text-[#FFAA00] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FFAA00]/10 border border-[#FFAA00]/30 shadow-[1px_1px_0_#000]">
                  COMPLIANCE MANDATORY
                </span>
              </div>

              {rules.length > 0 ? (
                <ul className="space-y-2 font-mono text-xs text-neutral-300">
                  {rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-[#12151B] p-2.5 border-l-2 border-[#FF4655]">
                      <span className="text-[#FF4655] font-black text-xs shrink-0 select-none">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <span className="leading-relaxed text-neutral-200">{rule}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-1.5 font-mono text-xs text-neutral-400 bg-[#12151B]/80 p-3 border-l-2 border-[#FFAA00]/60">
                  <p className="text-neutral-300 font-bold flex items-center gap-1.5">
                    <span className="text-[#FFAA00]">▸</span> GENERAL ARENA PROTOCOLS:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400 pl-1">
                    <li>All code must be authored during the active 24-hour hackathon timeframe.</li>
                    <li>Pre-built full templates or cloned turnkey projects are strictly prohibited.</li>
                    <li>AI assistants and external libraries are permitted with full attribution during demo.</li>
                    <li>Every team member must be ready to explain architectural choices to judges.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Tech Stack Chips */}
            {skills.length > 0 && (
              <div className="p-3 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444]">
                <span className="font-mono text-[10px] font-bold text-[#FFAA00] uppercase block mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-[#FFAA00]" />
                  <span>RECOMMENDED TOOLING & TECH STACK:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-[#2B2B2B] text-neutral-200 border border-[#555] font-mono text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions Bar (STICKY FOOTER) */}
          <div className="shrink-0 bg-[#C6C6C6] p-3 sm:p-4 border-t-2 border-[#555555] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_-2px_6px_rgba(0,0,0,0.15)]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] active:bg-[#BFBFBF] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] cursor-pointer transition-transform active:translate-y-0.5"
            >
              RETURN TO LIST
            </button>

            <button
              type="button"
              onClick={() => onSelectForRegister(challenge)}
              className="w-full sm:w-auto px-7 py-3 bg-[#5B8731] hover:bg-[#689B37] active:bg-[#4C7129] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span>CLAIM THIS QUEST // ENLIST SQUAD</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
