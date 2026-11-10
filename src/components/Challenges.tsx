import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, Swords, ChevronRight, CheckSquare, Sparkles, Lock, Trophy, RotateCw, RotateCcw, Image, Award, Gift } from 'lucide-react';
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
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  // Strictly display challenges from Supabase database with live battle prizes merged
  const configuredBattlePrizes: any[] = Array.isArray(content?.prizes?.battlePrizes)
    ? content.prizes.battlePrizes
    : [];

  const allChallenges: Challenge[] = (content.challenges && Array.isArray(content.challenges))
    ? content.challenges.map((c, i) => {
        const bp = configuredBattlePrizes.find((p: any) => p.challengeId === c.id);
        const rawSecond = bp?.secondPrize ?? c.secondPrize ?? '';
        const secondPrize = rawSecond && rawSecond !== '₹0' ? rawSecond : (c.secondPrize && c.secondPrize !== '₹0' ? c.secondPrize : '');
        const perks = bp?.perks || (c.bountyNotes as string) || (c.perks as string) || '';

        return {
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
          rulesPdfUrl: (c.rulesPdfUrl as string) || '',
          recommendedTech: parseArray(c.recommendedTech, []),
          judgingCriteria: parseArray(c.judgingCriteria, []),
          expectedOutput: (c.expectedOutput as string) || '',
          prizePool: bp?.prizeAmount || (c.prizePool as string) || '',
          firstPrize: bp?.firstPrize || (c.firstPrize as string) || '',
          secondPrize: secondPrize,
          bountyNotes: perks,
          perks: perks,
        };
      })
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

        {/* HackVerse Cards Grid with 3D Card Flip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredChallenges.map((challenge, idx) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="perspective-1200 min-h-[460px] sm:min-h-[490px] h-full"
            >
              <div
                onClick={() => toggleFlip(challenge.id)}
                className={`relative w-full h-full transform-style-3d transition-transform duration-700 ease-out cursor-pointer select-none ${
                  flippedCards[challenge.id] ? 'rotate-y-180' : ''
                }`}
                title="Click anywhere to flip and see battle artwork"
              >
                {/* FRONT FACE */}
                <div className="backface-hidden w-full h-full bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-4 sm:p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all duration-150 flex flex-col justify-between group">
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
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#707070] text-white font-mono font-bold text-[10px] px-2 py-0.5 border border-black">
                          {challenge.difficulty}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 font-mono text-[9px] text-[#FFDF78] bg-[#141414] px-1.5 py-0.5 border border-[#FFAA00]/50 group-hover:border-[#FFAA00] transition-colors"
                          title="Click card to flip"
                        >
                          <RotateCw className="w-2.5 h-2.5 text-[#55FF55]" />
                          <span>FLIP</span>
                        </span>
                      </div>
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

                    {/* 1st Place & Runner Up / Goodies Breakdown */}
                    {(challenge.firstPrize || (challenge.secondPrize && challenge.secondPrize !== '₹0') || challenge.bountyNotes) && (
                      <div className="mt-2 p-2 bg-[#1b1b1b] border border-[#383838] space-y-1 font-mono text-[10px]">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          {challenge.firstPrize && challenge.firstPrize !== '₹0' && (
                            <span className="text-[#FFAA00] font-bold flex items-center gap-1">
                              <Award className="w-3 h-3 text-[#FFAA00]" />
                              1ST: <span className="text-white font-bold">{challenge.firstPrize}</span>
                            </span>
                          )}
                          {challenge.secondPrize && challenge.secondPrize !== '₹0' && (
                            <span className="text-[#55FF55] font-bold flex items-center gap-1">
                              <Gift className="w-3 h-3 text-[#55FF55]" />
                              RUNNER UP: <span className="text-white font-bold">{challenge.secondPrize}</span>
                            </span>
                          )}
                        </div>
                        {challenge.bountyNotes && (
                          <div className="pt-0.5 text-[9px] text-[#FFDF78] flex items-center gap-1 truncate">
                            <Sparkles className="w-2.5 h-2.5 text-[#FFAA00] shrink-0" />
                            <span className="truncate"><strong className="text-[#55FF55]">GOODIES:</strong> {challenge.bountyNotes}</span>
                          </div>
                        )}
                      </div>
                    )}

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

                  {/* Card Action Buttons (Front Face) — e.stopPropagation() ensures click does NOT flip */}
                  <div className="mt-6 pt-3 border-t-2 border-[#383838] flex items-center gap-2">
                    <button
                      type="button"
                      id={`view-specs-${challenge.id}-btn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalChallenge(challenge);
                      }}
                      className="flex-1 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] py-2.5 shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>VIEW SPECS</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      id={`claim-quest-${challenge.id}-btn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectChallengeForRegister(challenge);
                      }}
                      className="bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] active:border-t-[#555555] active:border-l-[#555555] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] px-3.5 py-2.5 shadow-[3px_3px_0px_#000] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Claim this quest for your squad"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-black" />
                      <span>CLAIM</span>
                    </button>
                  </div>
                </div>

                {/* BACK FACE (BATTLE IMAGE ARTWORK) */}
                <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full bg-[#181818] border-4 border-t-[#FFAA00] border-l-[#FFAA00] border-r-[#7F5000] border-b-[#7F5000] shadow-[6px_6px_0px_#000] flex flex-col justify-between overflow-hidden">
                  {/* Top Header on Back Face */}
                  <div className="p-3 bg-[#111111]/90 border-b-2 border-[#FFAA00]/40 flex items-center justify-between shrink-0 z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="bg-[#FFAA00] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]">
                        TRK-{challenge.number}
                      </span>
                      <span className="font-mono text-xs font-bold text-white truncate [text-shadow:_1px_1px_0_#000]">
                        {challenge.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(challenge.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#222] hover:bg-[#333] text-[#FFDF78] border border-[#FFAA00]/50 font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-[2px_2px_0_#000]"
                      title="Flip back to challenge details"
                    >
                      <RotateCcw className="w-3 h-3 text-[#55FF55]" />
                      <span>FLIP BACK</span>
                    </button>
                  </div>

                  {/* Battle Artwork Centerpiece */}
                  <div className="relative flex-1 w-full bg-[#080808] overflow-hidden flex items-center justify-center group/artwork">
                    <img
                      src={challenge.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
                      alt={`${challenge.title} Battle Artwork`}
                      className="w-full h-full object-cover object-center group-hover/artwork:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                    {/* Center overlay badge with artwork label */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2 py-1 bg-black/80 border border-[#55FF55]/60 font-mono text-[10px] font-bold text-[#55FF55] uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5 shadow-[2px_2px_0_#000]">
                        <Image className="w-3 h-3 text-[#55FF55]" />
                        BATTLE ARENA ARTWORK
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-xs font-black text-[#FFDF78] bg-black/85 px-2 py-0.5 border border-[#FFAA00]/60 shadow-[2px_2px_0_#000]">
                          {challenge.prizePool || '₹5,000'}
                        </span>
                        {challenge.secondPrize && challenge.secondPrize !== '₹0' && (
                          <span className="font-mono text-[9px] font-bold text-[#55FF55] bg-black/90 px-1.5 py-0.5 border border-[#55FF55]/60 shadow-[1px_1px_0_#000]">
                            RUNNER UP: {challenge.secondPrize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons (Back Face) */}
                  <div className="p-3 bg-[#111111]/95 border-t-2 border-[#383838] flex items-center gap-2 shrink-0 z-10">
                    <button
                      type="button"
                      id={`view-specs-back-${challenge.id}-btn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalChallenge(challenge);
                      }}
                      className="flex-1 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] py-2.5 shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>VIEW SPECS</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      id={`claim-quest-back-${challenge.id}-btn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectChallengeForRegister(challenge);
                      }}
                      className="bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] active:border-t-[#555555] active:border-l-[#555555] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] px-3.5 py-2.5 shadow-[3px_3px_0px_#000] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Claim this quest for your squad"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-black" />
                      <span>CLAIM</span>
                    </button>
                  </div>
                </div>
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
