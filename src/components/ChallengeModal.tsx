import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Terminal, Cpu, Award } from 'lucide-react';
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

  return (
    <AnimatePresence>
      {/* Full-screen portal root — sits above everything including navbar (z-50) */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop — fully opaque dark overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm"
          style={{ zIndex: 0 }}
        />

        {/* HackVerse Retro Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000]"
          style={{ zIndex: 1 }}
        >
          {/* Windows 95 / Retro Arcade Window Title Bar */}
          <div className="bg-[#2A2A2A] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#555555]">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-[#55FF55] inline-block shadow-[1px_1px_0_#000]" />
              <span>QUEST DOSSIER // CB-TRK-{challenge.number}: {challenge.title}</span>
            </div>
            <button
              id="close-challenge-modal-btn"
              onClick={onClose}
              className="w-7 h-7 bg-[#DBDBDB] hover:bg-[#EAEAEA] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] text-black font-black flex items-center justify-center active:translate-y-0.5 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Inner Window Body */}
          <div className="p-3 sm:p-5 space-y-4">
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
              <p className="font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {challenge.problemStatement}
              </p>
            </div>

            {/* Two Column Grid: Objectives & Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Objectives */}
              <div className="p-4 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444]">
                <h4 className="font-mono text-xs font-black text-[#55FF55] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>CORE REQUIREMENTS</span>
                </h4>
                <ul className="space-y-2 font-mono text-xs text-neutral-300">
                  {requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#FFAA00] font-bold shrink-0">{idx + 1}.</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evaluation Criteria */}
              <div className="p-4 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444]">
                <h4 className="font-mono text-xs font-black text-[#FFDF78] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>EVALUATION BENCHMARKS</span>
                </h4>
                <ul className="space-y-2 font-mono text-xs text-neutral-300">
                  {judgingCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#55FF55] font-bold shrink-0">•</span>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="p-3 bg-[#1B1B1B] border-4 border-t-[#111111] border-l-[#111111] border-r-[#444444] border-b-[#444444]">
              <span className="font-mono text-[10px] font-bold text-[#FFAA00] uppercase block mb-2">
                RECOMMENDED TOOLING & PROTOCOLS:
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

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                RETURN TO LIST
              </button>

              <button
                onClick={() => onSelectForRegister(challenge)}
                className="w-full sm:w-auto px-7 py-3 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>CLAIM THIS QUEST // ENLIST SQUAD</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
