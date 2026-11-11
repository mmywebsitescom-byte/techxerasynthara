import { Crown, Sparkles, ExternalLink, Lock } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { Sponsor } from '../types';
import SkeletonImage from './SkeletonImage';

export default function Sponsors() {
  const { content } = useSiteContent();

  const isLocked = content?.sponsorsLocked === true || content?.eventControl?.sponsorsLocked === true;
  const lockedMsg = String(
    content?.sponsorsLockedMessage ||
    content?.eventControl?.sponsorsLockedMessage ||
    "SPONSOR ALLIANCES ARE CURRENTLY CLASSIFIED. OFFICIAL PARTNERS WILL BE UNVEILED CLOSER TO LAUNCH."
  );

  // Strictly display sponsors from content.sponsors (distinct from partners)
  const displaySponsors: Sponsor[] = (content?.sponsors && Array.isArray(content.sponsors))
    ? (content.sponsors as Sponsor[])
    : [];

  // Repeat sponsors to ensure an infinite seamless scrolling marquee from right to left
  const baseSponsors = displaySponsors.length > 0 ? displaySponsors : [];
  const repeatCount = Math.max(4, Math.ceil(12 / (baseSponsors.length || 1)));
  const repeatedSegment = Array.from({ length: repeatCount }, () => baseSponsors).flat();
  const marqueeSponsors = [...repeatedSegment, ...repeatedSegment];

  const getTierColor = (tier?: string) => {
    const t = (tier || '').toLowerCase();
    if (t.includes('title')) return 'text-[#FFAA00] border-[#FFAA00]/50 bg-[#FFAA00]/10';
    if (t.includes('platinum')) return 'text-[#4ECDC4] border-[#4ECDC4]/50 bg-[#4ECDC4]/10';
    if (t.includes('gold')) return 'text-[#F5D061] border-[#F5D061]/50 bg-[#F5D061]/10';
    if (t.includes('silver')) return 'text-neutral-300 border-neutral-400/50 bg-neutral-400/10';
    return 'text-[#55FF55] border-[#55FF55]/50 bg-[#55FF55]/10';
  };

  return (
    <section
      id="sponsors"
      className="py-16 sm:py-24 bg-transparent relative z-[2] overflow-hidden"
    >
      <div className="w-full relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#D4AF37]/40 bg-[#D4AF37]/8 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Crown className="w-3.5 h-3.5 text-[#FFAA00]" />
            <span>SPONSORS // STRATEGIC ALLIANCES</span>
          </div>
          <h2 className="sf-gothic-title text-4xl sm:text-5xl md:text-6xl sf-text-gold mb-3">
            Official Sponsors
          </h2>
          <p className="font-rajdhani text-neutral-400 text-sm max-w-lg mx-auto">
            The visionary enterprises, tech giants, and venture networks empowering the warriors of SYNTHARA2.0.
          </p>
        </div>

        {/* Lock State */}
        {isLocked ? (
          <div className="max-w-lg mx-auto text-center p-8 border-2 border-[#FF4655]/50 bg-[#0c1017]/90 sf-clip-angled-sm shadow-[0_0_30px_rgba(255,70,85,0.2)] space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FF4655]/15 border border-[#FF4655] flex items-center justify-center text-[#FF4655]">
              <Lock className="w-6 h-6" />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#FF4655]">
              CLASSIFICATION: RESTRICTED // SPONSORS EMBARGO
            </p>
            <h3 className="font-cinzel text-lg font-bold text-white uppercase">
              Alliances Locked by Command
            </h3>
            <p className="font-rajdhani text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {lockedMsg}
            </p>
          </div>
        ) : baseSponsors.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-6 border border-[#D4AF37]/20 bg-[#0d1117]/80 sf-clip-angled-sm">
            <p className="font-mono text-xs text-[#F5D061] uppercase tracking-wider">
              Official sponsor roster is currently being finalized by tournament command.
            </p>
          </div>
        ) : (
          /* Infinite Horizontal Scrolling Marquee Track for Sponsor Logos */
          <div className="relative w-full overflow-hidden py-4 select-none">
            {/* Soft Lateral Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505]/95 via-[#050505]/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505]/95 via-[#050505]/60 to-transparent z-10 pointer-events-none" />

            {/* Marquee Row */}
            <div className="animate-sponsor-marquee flex items-center gap-4 sm:gap-6">
              {marqueeSponsors.map((sponsor, idx) => {
                const cardContent = (
                  <div
                    key={`${sponsor.id || sponsor.name}-${idx}`}
                    className="w-[260px] sm:w-[300px] shrink-0 relative group p-4 sm:p-5 border border-[#D4AF37]/30 hover:border-[#FFAA00] bg-[#0d1117]/95 hover:bg-[#D4AF37]/10 transition-all duration-300 sf-clip-angled-sm backdrop-blur-md shadow-[0_6px_25px_rgba(0,0,0,0.6)] cursor-pointer"
                  >
                    {/* Top Tier Badge & Beacon */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-mono text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border ${getTierColor(
                          sponsor.tier
                        )}`}
                      >
                        {sponsor.tier || 'Official Sponsor'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#55FF55] animate-pulse" />
                    </div>

                    {/* Logo Box (High Contrast White / Translucent) */}
                    <div className="w-full h-20 bg-white/95 rounded-sm p-2.5 flex items-center justify-center my-2.5 border border-neutral-300 shadow-sm group-hover:scale-[1.02] transition-transform">
                      {sponsor.logoUrl ? (
                        <SkeletonImage
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="max-h-14 max-w-[85%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
                          containerClassName="h-14 w-full flex items-center justify-center"
                        />
                      ) : (
                        <span className="font-mono font-black text-lg text-neutral-800 tracking-wider uppercase">
                          {sponsor.logoText || sponsor.name}
                        </span>
                      )}
                    </div>

                    {/* Sponsor Name */}
                    <span className="block font-cinzel font-black text-base sm:text-lg text-white group-hover:text-[#FFAA00] transition-colors uppercase leading-tight truncate">
                      {sponsor.name}
                    </span>

                    {/* Category & Action Link */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-rajdhani">
                      <span className="text-neutral-400 truncate max-w-[170px]">
                        {sponsor.category || sponsor.perk || 'STRATEGIC PARTNER'}
                      </span>
                      {sponsor.websiteUrl ? (
                        <span className="text-[#FFAA00] group-hover:text-white font-mono text-[10px] font-bold tracking-wider flex items-center gap-1">
                          <span>VISIT</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="text-[#55FF55] font-mono text-[10px] font-bold tracking-wider">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Golden Tactical Corner Accents */}
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/50 group-hover:border-[#FFAA00] transition-colors" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/30 group-hover:border-[#FFAA00] transition-colors" />
                  </div>
                );

                return sponsor.websiteUrl ? (
                  <a
                    key={`${sponsor.id || sponsor.name}-${idx}`}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    title={`Visit ${sponsor.name}`}
                  >
                    {cardContent}
                  </a>
                ) : (
                  cardContent
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
