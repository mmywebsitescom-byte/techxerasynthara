import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Users, ExternalLink } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

export default function Mission() {
  const { content } = useSiteContent();
  const mission = content?.mission || {};
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.05, 1.12]);

  const features = [
    {
      title: mission.pillar1Title || 'STATEWIDE ELITE COMPETITION',
      desc: mission.pillar1Desc || 'Top 50 shortlisted squads assemble offline at Government College of Engineering Kalahandi for high-stakes building.',
      badge: 'OFFLINE SPRINT',
    },
    {
      title: mission.pillar2Title || 'CLASSIFIED HARDWARE & AI TRACKS',
      desc: mission.pillar2Desc || 'Tackle real-world industry benchmarks across AI, rural healthcare, renewable grids, crowd telemetry, and disaster response.',
      badge: 'MULTI-TRACK',
    },
    {
      title: mission.pillar3Title || 'INDUSTRY MENTORS & VENTURE BACKING',
      desc: mission.pillar3Desc || 'Direct interaction with senior architects from Fortune 500 tech companies and venture funds for post-hackathon incubation.',
      badge: 'DIRECT MENTORSHIP',
    },
    {
      title: 'VERIFIED STATE CREDENTIALS',
      desc: `Earn state-recognized engineering accolades, ${content?.prizes?.poolTotal || '₹1,50,000+'} prize pool, fast-track interview referrals, and exclusive swags.`,
      badge: 'STATE RECOGNITION',
    },
  ];

  return (
    <section
      id="mission"
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* Cinematic Bamboo Ninja Background with Parallax Scroll */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <motion.img
          src="/assets/bg_shadow_fight_bamboo.jpg"
          alt="Bamboo Ninja Duel Background"
          style={{ y: bgY, scale: bgScale }}
          className="w-full h-[124%] -top-[12%] absolute inset-0 object-cover object-center opacity-90 brightness-[0.75] contrast-[1.1] saturate-[1.2] will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090c]/60 via-transparent to-[#07090c]/60" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HackVerse Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Users className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>{mission.badge || "ABOUT // CODEBREAKERS GCEK"}</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              {mission.title || <>CODEBREAKERS <span className="text-[#55FF55]">// GCEK</span></>}
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed [text-shadow:_1px_1px_0_#000]">
            {mission.description || "Fostering technical excellence, open-source innovation, and competitive hackathon culture across Odisha and Eastern India."}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title + idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 sm:p-6 shadow-[4px_4px_0px_#000]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#FFAA00] text-black font-mono font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  {feat.badge}
                </span>
                <span className="text-[#55FF55] font-mono text-xs font-black">
                  [0{idx + 1}]
                </span>
              </div>

              <h3 className="font-mono font-black text-lg text-white uppercase [text-shadow:_1px_1px_0_#000]">
                {feat.title}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Action Banner — OFFICIAL COMMUNITY PORTAL */}
        <div className="bg-[#101010] border-4 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] p-6 sm:p-8 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-xs font-bold text-[#FFAA00] uppercase tracking-wider mb-1">
              {mission.communityBadge || "OFFICIAL COMMUNITY PORTAL"}
            </div>
            <h4 className="font-mono font-black text-xl sm:text-2xl text-white uppercase [text-shadow:_1px_1px_0_#000]">
              {mission.communityTitle || "JOIN THE CODEBREAKERS GUILD"}
            </h4>
            <p className="font-mono text-xs text-neutral-300 mt-1 max-w-xl">
              {mission.communityDesc ||
                "Connect with 1,500+ student developers, alumni mentors, open-source contributors, and competitive hackathon warriors."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={String(mission.communityUrl || "https://codebreakersgcek.tech")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{String(mission.communityBtnLabel || "CLUB WEBSITE")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={String(mission.communityScheduleUrl || "#timeline")}
              className="w-full sm:w-auto px-5 py-3 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{String(mission.communityScheduleBtnLabel || "VIEW SCHEDULE")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
