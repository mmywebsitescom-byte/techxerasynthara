import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Swords, ChevronLeft, ChevronRight, CheckSquare, Shield, Zap, Brain, Globe, Cpu, Leaf, ArrowRight, Star, Lock, Eye, Trophy } from 'lucide-react';
import { Challenge } from '../types';
import { useSiteContent } from '../context/ContentContext';
import ChallengeModal from './ChallengeModal';

interface BattlegroundsPageProps {
  onBack: () => void;
  onOpenRegister: (challenge?: Challenge) => void;
  isLocked?: boolean;
  lockedMessage?: string;
}

const TRACK_ICONS: Record<string, React.ReactNode> = {
  'ai-ml': <Brain className="w-7 h-7" />,
  'web-app': <Globe className="w-7 h-7" />,
  'cyber-security': <Shield className="w-7 h-7" />,
  'iot-robotics': <Cpu className="w-7 h-7" />,
  'green-tech': <Leaf className="w-7 h-7" />,
  'open-innovation': <Zap className="w-7 h-7" />,
};

const DIFFICULTY_COLOR: Record<string, string> = {
  'Advanced': 'text-[#FF4655] border-[#FF4655]/60 bg-[#FF4655]/10',
  'Intermediate': 'text-[#F5D061] border-[#F5D061]/60 bg-[#F5D061]/10',
  'All Levels': 'text-[#55FF55] border-[#55FF55]/60 bg-[#55FF55]/10',
};

export default function BattlegroundsPage({ onBack, onOpenRegister, isLocked, lockedMessage }: BattlegroundsPageProps) {
  const { content } = useSiteContent();
  const [activeModalChallenge, setActiveModalChallenge] = useState<Challenge | null>(null);

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
        recommendedTech: parseArray(c.recommendedTech, []),
        judgingCriteria: parseArray(c.judgingCriteria, []),
        expectedOutput: (c.expectedOutput as string) || '',
        prizePool: (c.prizePool as string) || '',
        firstPrize: (c.firstPrize as string) || '',
        secondPrize: (c.secondPrize as string) || ''
      }))
    : [];

  const bgConfig = (content as any)?.battlegrounds || {};
  const bgTitle = bgConfig.title || 'Battlegrounds';
  const bgSubtitle = bgConfig.subtitle && bgConfig.subtitle !== "HACKVERSE '26" ? bgConfig.subtitle : "SYNTHARA2.0";
  const bgDesc = bgConfig.description || `${allChallenges.length} elite combat domains. Choose your battleground wisely — each track tests a different dimension of engineering mastery. Only the most prepared squads will claim the bounty.`;
  const statTracks = bgConfig.tracksCount || String(allChallenges.length);
  const statPrize = content?.prizes?.poolTotal || bgConfig.prizePool || content?.stats?.prizePool || '₹10,000+';
  const statDuration = bgConfig.duration || '24 HOURS';
  const statTeamSize = bgConfig.teamSize || '2-4 WARRIORS';
  const ctaText = bgConfig.bottomCtaText || "CANT DECIDE? REGISTER AND PICK YOUR TRACK ON ARRIVAL.";
  const ctaButton = bgConfig.bottomCtaButton || "JOIN THE BATTLE - ITS FREE";

  if (isLocked) {
    return (
      <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] flex flex-col items-center justify-center overflow-x-hidden">
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#FF4655]/8 blur-[160px]" />
          <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[180px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl w-full mx-auto px-6 text-center flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-full bg-[#FF4655]/10 border-2 border-[#FF4655]/50 flex items-center justify-center shadow-[0_0_50px_rgba(255,70,85,0.3)] mb-2">
            <Lock className="w-10 h-10 text-[#FF4655]" />
          </div>
          <div className="space-y-1">
            <p className="font-rajdhani text-[#FF4655] text-xs tracking-[0.3em] uppercase font-bold">CLASSIFICATION: RESTRICTED</p>
            <h1 className="sf-gothic-title text-4xl sm:text-5xl sf-text-gold">Battlegrounds</h1>
            <p className="font-rajdhani text-xs tracking-[0.2em] text-[#D4AF37]/70 uppercase font-bold">ACCESS DENIED</p>
          </div>
          <div className="p-6 border border-[#FF4655]/30 bg-[#FF4655]/5 sf-clip-angled-sm max-w-md w-full">
            <p className="font-rajdhani text-neutral-300 text-sm leading-relaxed">
              {lockedMessage || 'BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.'}
            </p>
          </div>
          <button
            id="battlegrounds-back-locked-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#F5D061] font-rajdhani font-bold text-xs tracking-[0.2em] uppercase transition-colors group mt-2"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            RETURN TO MAIN ARENA
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] overflow-x-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#D4AF37]/6 blur-[160px]" />
        <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] rounded-full bg-[#FF4655]/5 blur-[180px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/4 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <button
            id="battlegrounds-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#F5D061] font-rajdhani font-bold text-xs tracking-[0.2em] uppercase mb-8 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO MAIN ARENA
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 border border-[#D4AF37]/50 sf-clip-angled-sm flex items-center justify-center bg-[#D4AF37]/10">
              <Swords className="w-5 h-5 text-[#F5D061]" />
            </div>
            <p className="font-rajdhani text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold">{bgSubtitle}</p>
          </div>

          <h1 className="sf-gothic-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl sf-text-gold mb-4">
            {bgTitle}
          </h1>
          <p className="font-rajdhani text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            {bgDesc}
          </p>

          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { label: 'COMBAT TRACKS', value: statTracks },
              { label: 'PRIZE POOL', value: statPrize },
              { label: 'DURATION', value: statDuration },
              { label: 'TEAM SIZE', value: statTeamSize },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="sf-gothic-title text-2xl sm:text-3xl text-[#F5D061]">{stat.value}</span>
                <span className="font-rajdhani text-[10px] text-neutral-500 tracking-[0.2em] uppercase font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-12" />

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {allChallenges.map((challenge, idx) => (
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
                  <span className="bg-[#707070] text-white font-mono font-bold text-[10px] px-2.5 py-0.5 border border-black">
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
                  id={`battleground-specs-${challenge.id}-btn`}
                  onClick={() => setActiveModalChallenge(challenge)}
                  className="flex-1 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] py-2.5 shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>VIEW SPECS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  id={`battleground-claim-${challenge.id}-btn`}
                  onClick={() => onOpenRegister(challenge)}
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="font-rajdhani text-neutral-500 text-sm mb-5 tracking-wider">
            {ctaText}
          </p>
          <button
            id="battlegrounds-join-battle-btn"
            onClick={() => onOpenRegister()}
            className="h-14 px-12 sf-btn-gold sf-clip-angled text-sm font-cinzel tracking-[0.18em] inline-flex items-center gap-3"
          >
            <Swords className="w-5 h-5" />
            {ctaButton}
          </button>
        </motion.div>
      </div>

      {/* Challenge Specs Modal — Rendered via React Portal at body level */}
      {activeModalChallenge && createPortal(
        <ChallengeModal
          challenge={activeModalChallenge}
          isOpen={!!activeModalChallenge}
          onClose={() => setActiveModalChallenge(null)}
          onSelectForRegister={(challenge) => {
            setActiveModalChallenge(null);
            onOpenRegister(challenge);
          }}
        />,
        document.body
      )}
    </div>
  );
}
