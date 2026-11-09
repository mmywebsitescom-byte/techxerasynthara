import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, Swords, ChevronRight, CheckSquare, Sparkles, Lock, Trophy } from 'lucide-react';
import { Challenge } from '../types';
import ChallengeModal from './ChallengeModal';
import { useSiteContent } from '../context/ContentContext';

interface ChallengesProps {
  onSelectChallengeForRegister: (challenge: Challenge) => void;
}

export default function Challenges({ onSelectChallengeForRegister }: ChallengesProps) {
  const { content } = useSiteContent();
  const [activeModalChallenge, setActiveModalChallenge] = useState<Challenge | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const sectionRef = useRef<HTMLElement>(null);

  const isLocked = content?.eventControl?.battlegroundsLocked === true;
  const lockedMsg = content?.eventControl?.battlegroundsLockedMessage || 'BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.05, 1.12]);

  const parseArray = (val: unknown, fallback: string[] = []): string[] => {
    if (Array.isArray(val) && val.length > 0) return val.map(String).filter(Boolean);
    if (typeof val === 'string' && val.trim()) {
      return val.includes('\n')
        ? val.split('\n').map((s) => s.trim().replace(/^[-*•\d.]+\s*/, '')).filter(Boolean)
        : val.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return fallback;
  };

  // Strictly display challenges from Supabase database
  const allChallenges: Challenge[] = (content.challenges && Array.isArray(content.challenges))
    ? content.challenges.map((c, i) => ({
        id: c.id || `c-${i}`,
        number: c.number || String(i + 1).padStart(2, '0'),
        title: c.title || 'CHALLENGE',
        category: c.category || 'ARENA TRACK',
        difficulty: (c.difficulty as any) || 'All Levels',
        shortDescription: c.shortDescription || '',
        skills: parseArray(c.skills, []),
        image: (c.image as string) || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        problemStatement: c.problemStatement || c.shortDescription || '',
        requirements: parseArray(c.requirements, []),
        rules: parseArray(c.rules, []),
        recommendedTech: parseArray(c.recommendedTech, []),
        judgingCriteria: parseArray(c.judgingCriteria, []),
        expectedOutput: (c.expectedOutput as string) || '',
        prizePool: (c.prizePool as string) || '',
        firstPrize: (c.firstPrize as string) || '',
        secondPrize: (c.secondPrize as string) || ''
      }))
    : [];

  const categories = [
    'ALL',
    ...Array.from(new Set(allChallenges.map((c) => c.category?.trim().toUpperCase()).filter(Boolean)))
  ];

  const filteredChallenges = selectedCategory === 'ALL'
    ? allChallenges
    : allChallenges.filter(c => c.category?.trim().toUpperCase() === selectedCategory);

  return (
    <section
      id="challenges"
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* Cinematic Temple Pond Duel Background with Parallax Scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <motion.img
          src="/assets/bg_shadow_fight_temple.jpg"
          alt="Temple Pond Duel Background"
          style={{ y: bgY, scale: bgScale }}
          className="w-full h-[124%] -top-[12%] absolute inset-0 object-cover object-center opacity-90 brightness-[0.75] contrast-[1.1] saturate-[1.2] will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090c]/60 via-transparent to-[#07090c]/60" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header in HackVerse Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Terminal className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>QUEST SELECTION // PROBLEM STATEMENTS</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              CHOOSE YOUR <span className="text-[#55FF55]">BATTLEGROUND</span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed [text-shadow:_1px_1px_0_#000]">
            Browse classified state hackathon problem statements. Select your quest, inspect the technical blueprints, and build your solution.
          </p>
        </div>

        {/* Restricted Classification Banner when locked */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 border-2 border-[#FF4655]/50 bg-[#0c1017] sf-clip-angled-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_30px_rgba(255,70,85,0.15)]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#FF4655]/20 border border-[#FF4655] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,70,85,0.3)]">
                <Lock className="w-6 h-6 text-[#FF4655]" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-[#FF4655] uppercase tracking-widest">
                  CLASSIFICATION: RESTRICTED // BATTLEGROUNDS LOCKED
                </p>
                <p className="font-mono text-xs text-neutral-200 mt-1">
                  {lockedMsg}
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-[#FF4655]/20 border border-[#FF4655] font-mono text-[10px] text-[#FF4655] font-black uppercase tracking-wider shrink-0">
              LOCKED BY COMMAND
            </span>
          </motion.div>
        )}

        {/* Category Filter Pills (HackVerse Neo Style) */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-10 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-3 ${
                selectedCategory === cat
                  ? 'bg-[#5B8731] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]'
                  : 'bg-[#2B2B2B] text-neutral-300 hover:text-white border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] shadow-[2px_2px_0px_#000]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* HackVerse Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredChallenges.map((challenge, idx) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-4 sm:p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#FFAA00] text-black font-mono font-black text-[10px] sm:text-[11px] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                      CB-TRK-{challenge.number}
                    </span>
                    <span className="bg-[#1B1B1B] text-[#55FF55] font-mono font-bold text-[10px] px-2 py-0.5 border border-black">
                      {challenge.category}
                    </span>
                  </div>
                  <span className="bg-[#707070] text-white font-mono font-bold text-[10px] px-2 py-0.5 border border-black">
                    {challenge.difficulty}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="font-mono font-black text-base sm:text-lg text-white leading-snug uppercase [text-shadow:_1px_1px_0_#000] group-hover:text-[#55FF55] transition-colors mt-2">
                  {challenge.title}
                </h3>

                {/* Track Bounty Banner */}
                <div className="mt-2.5 py-1.5 px-2.5 bg-[#172013] border border-[#55FF55]/40 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#FFDF78] font-bold uppercase flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-[#FFAA00]" />
                    TRACK BOUNTY:
                  </span>
                  <span className="font-mono text-xs font-black text-[#55FF55]">
                    {challenge.prizePool || '₹5,000'}
                  </span>
                </div>

                {/* Short Description */}
                <p className="font-mono text-xs text-neutral-300 leading-relaxed mt-2.5 line-clamp-3">
                  {challenge.shortDescription}
                </p>

                {/* Tech Skills Chips */}
                <div className="mt-4 pt-3 border-t-2 border-[#383838]">
                  <div className="text-[10px] font-mono font-bold text-[#FFDF78] uppercase tracking-wider mb-2 [text-shadow:_1px_1px_0_#000]">
                    REQUIRED TECH STACK:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-[#1B1B1B] text-neutral-200 border border-[#444] font-mono text-[10px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="mt-6 pt-3 border-t-2 border-[#383838] flex items-center gap-2">
                <button
                  id={`view-specs-${challenge.id}-btn`}
                  onClick={() => setActiveModalChallenge(challenge)}
                  className="flex-1 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] py-2.5 shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>VIEW SPECS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  id={`claim-quest-${challenge.id}-btn`}
                  onClick={() => onSelectChallengeForRegister(challenge)}
                  className="bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] active:border-t-[#555555] active:border-l-[#555555] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] px-3.5 py-2.5 shadow-[3px_3px_0px_#000] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Claim this quest for your squad"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-black" />
                  <span>CLAIM</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Challenge Specs Modal — rendered via Portal at document.body to escape isolation stacking context */}
      {activeModalChallenge && createPortal(
        <ChallengeModal
          challenge={activeModalChallenge}
          isOpen={!!activeModalChallenge}
          onClose={() => setActiveModalChallenge(null)}
          onSelectForRegister={(challenge) => {
            setActiveModalChallenge(null);
            onSelectChallengeForRegister(challenge);
          }}
        />,
        document.body
      )}
    </section>
  );
}
