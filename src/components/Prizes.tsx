import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Gift, Sparkles, Swords, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

export default function Prizes() {
  const { content } = useSiteContent();
  const prizes = content?.prizes || {};
  const challenges = Array.isArray(content?.challenges) ? content.challenges : [];
  
  // Extract battle prizes or derive from challenges
  const rawBattlePrizes = Array.isArray(prizes.battlePrizes) && prizes.battlePrizes.length > 0
    ? prizes.battlePrizes
    : challenges
        .filter((ch) => ch.prizePool)
        .map((ch) => ({
          challengeId: ch.id,
          challengeTitle: ch.title,
          challengeNumber: ch.number,
          prizeAmount: ch.prizePool || '₹5,000',
          firstPrize: ch.firstPrize || '',
          secondPrize: ch.secondPrize || '',
          perks: ch.bountyNotes || '',
        }));

  // If still empty, construct initial track prize cards from available challenges
  const battlePrizes = rawBattlePrizes.length > 0
    ? rawBattlePrizes
    : challenges.map((ch, idx) => ({
        challengeId: ch.id,
        challengeTitle: ch.title,
        challengeNumber: ch.number || String(idx + 1).padStart(2, '0'),
        prizeAmount: ch.prizePool || '₹5,000',
        firstPrize: ch.firstPrize || '₹3,500',
        secondPrize: ch.secondPrize || '₹1,500',
        perks: ch.bountyNotes || 'Winner trophy, cloud credits, certificate',
      }));

  const totalPrizePool = prizes.poolTotal || content?.stats?.prizePool || '₹10,000+';

  // Dynamic Aggregate Banner Customization
  const bannerBadge = String(prizes.bannerBadge || 'AGGREGATE STATE CHAMPION POOL');
  const bonusTag = String(prizes.bonusTag || '+ VC INCUBATION');
  const descCandidate = String(prizes.description || prizes.bannerDesc || '');
  const bannerDesc = descCandidate && !descCandidate.includes("HackVerse '26")
    ? descCandidate
    : "The grand bounty of SYNTHARA2.0. Sum of all individual track combat pools with direct cash wires, official SYNTHARA2.0 champion trophies, compute grants, and direct investor screening.";

  const perk1 = String(prizes.perk1 || `${totalPrizePool} Cumulative Bounty Pool`);
  const perk2 = String(prizes.perk2 || 'Cloud Compute Clusters & Grant Wire');
  const perk3 = String(prizes.perk3 || 'Direct VC Term-Sheet Screening');
  const perk4 = String(prizes.perk4 || 'Official Gold Trophies & Custom Badges');

  const trophyBoxTitle = String(prizes.trophyBoxTitle || 'GRAND TOTAL');
  const trophyBoxSubtitle = String(
    prizes.trophyBoxSubtitle || `${battlePrizes.length || challenges.length || 1} BATTLE TRACKS`
  );

  const [selectedTrackId, setSelectedTrackId] = useState<string>('ALL');

  const displayedPrizes = selectedTrackId === 'ALL'
    ? battlePrizes
    : battlePrizes.filter(bp => bp.challengeId === selectedTrackId);

  return (
    <section
      id="prizes"
      className="py-20 sm:py-24 px-4 sm:px-6 md:px-12 bg-transparent relative z-[2]"
    >
      <div className="max-w-7xl mx-auto relative z-[2]">
        {/* HackVerse Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Trophy className="w-3.5 h-3.5 text-[#FFAA00]" />
              <span>REWARDS MATRIX // BATTLEGROUND BOUNTIES & STATE POOL</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              STATE <span className="text-[#FFAA00]">PRIZE POOL</span>
            </h2>
          </div>
          <div className="text-left md:text-right">
            <div className="font-mono text-2xl sm:text-3xl font-black text-[#55FF55] [text-shadow:0_0_12px_rgba(85,255,85,0.4)]">
              {totalPrizePool}
            </div>
            <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed mt-1 [text-shadow:_1px_1px_0_#000]">
              Aggregated across all battleground tracks, cash wires, cloud compute credits, and fast-track seed investment.
            </p>
          </div>
        </div>

        {/* Grand State Total Prize Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 bg-[#141418]/90 backdrop-blur-md border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] p-6 sm:p-8 shadow-[6px_6px_0px_#000] relative overflow-hidden"
        >
          {/* Subtle amber ambient radiance */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFAA00]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFAA00] text-black font-mono font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] border border-black">
                <Trophy className="w-4 h-4 text-black" />
                <span>{bannerBadge}</span>
              </div>

              <h3 className="font-mono font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none [text-shadow:_2px_2px_0_#000]">
                {totalPrizePool} <span className="text-[#55FF55] text-2xl sm:text-3xl">{bonusTag}</span>
              </h3>

              <p className="font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {bannerDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {[perk1, perk2, perk3, perk4].map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-mono text-xs text-[#FFDF78]">
                    <Sparkles className="w-3.5 h-3.5 text-[#55FF55] shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gold Pixel Trophy Box */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#101010] border-4 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center p-3 text-center shrink-0">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-[#FFAA00] [filter:drop-shadow(0_0_10px_#FFAA00)]" />
              <span className="font-mono font-black text-sm sm:text-base text-white mt-2 [text-shadow:_1px_1px_0_#000]">
                {trophyBoxTitle}
              </span>
              <span className="font-mono text-[9px] text-[#55FF55] font-bold">
                {trophyBoxSubtitle}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Track Filter Tabs */}
        {battlePrizes.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            <span className="font-mono text-xs text-neutral-400 font-bold uppercase shrink-0 mr-2 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-[#FFAA00]" />
              FILTER BATTLE:
            </span>
            <button
              onClick={() => setSelectedTrackId('ALL')}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-all shrink-0 border-2 cursor-pointer ${
                selectedTrackId === 'ALL'
                  ? 'bg-[#FFAA00] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#181818] text-neutral-300 border-[#333] hover:border-[#666]'
              }`}
            >
              ALL BATTLES ({battlePrizes.length})
            </button>
            {battlePrizes.map((bp) => (
              <button
                key={bp.challengeId}
                onClick={() => setSelectedTrackId(bp.challengeId)}
                className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-all shrink-0 border-2 cursor-pointer ${
                  selectedTrackId === bp.challengeId
                    ? 'bg-[#55FF55] text-black border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#181818] text-neutral-300 border-[#333] hover:border-[#666]'
                }`}
              >
                CB-TRK-{bp.challengeNumber || '01'}: {bp.challengeTitle}
              </button>
            ))}
          </div>
        )}

        {/* Battle-Specific Prize Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPrizes.map((bp, idx) => (
            <motion.div
              key={bp.challengeId || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-[#141418]/90 backdrop-blur-md border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#FFAA00] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                    BATTLE TRK-{bp.challengeNumber || '01'}
                  </span>
                  <div className="flex items-center gap-1 text-[#55FF55] font-mono text-xs font-bold">
                    <Swords className="w-3.5 h-3.5" />
                    <span>TRACK BOUNTY</span>
                  </div>
                </div>

                {/* Challenge Title */}
                <h4 className="font-mono font-black text-lg sm:text-xl text-white tracking-wide uppercase mt-1 [text-shadow:_1px_1px_0_#000] leading-snug">
                  {bp.challengeTitle}
                </h4>

                {/* Individual Battle Prize Pool Amount */}
                <div className="font-mono font-black text-3xl sm:text-4xl text-[#55FF55] tracking-wide mt-3 [text-shadow:_2px_2px_0_#000]">
                  {bp.prizeAmount}
                </div>

                {/* Breakdown List */}
                <div className="mt-4 pt-3 border-t-2 border-[#2b2b2b] space-y-2 font-mono text-xs">
                  {bp.firstPrize && (
                    <div className="flex items-center justify-between bg-[#1b1b1b] p-2 border border-[#333]">
                      <span className="text-[#FFAA00] font-bold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        1ST PLACE:
                      </span>
                      <span className="text-white font-black">{bp.firstPrize}</span>
                    </div>
                  )}

                  {bp.secondPrize && (
                    <div className="flex items-center justify-between bg-[#1b1b1b] p-2 border border-[#333]">
                      <span className="text-[#DBDBDB] font-bold flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5" />
                        RUNNER UP:
                      </span>
                      <span className="text-white font-black">{bp.secondPrize}</span>
                    </div>
                  )}

                  {bp.perks && (
                    <div className="pt-1 text-neutral-300 text-[11px] leading-relaxed flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#55FF55] shrink-0 mt-0.5" />
                      <span>{bp.perks}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-3 border-t-2 border-[#2b2b2b]">
                <a
                  href="#challenges"
                  className="w-full py-2 bg-[#2b2b2b] hover:bg-[#383838] text-neutral-200 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#444] transition-colors"
                >
                  <span>INSPECT BATTLE SPECS</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
