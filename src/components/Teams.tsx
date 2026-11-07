import { Users, Shield } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

export default function Teams() {
  const { content } = useSiteContent();
  // Strictly display teams from Supabase database
  const displayTeams = (content?.teams && Array.isArray(content.teams)) ? content.teams : [];

  // Repeat teams to ensure an infinite seamless loop from right to left
  const baseTeams = displayTeams.length > 0 ? displayTeams : [];
  const repeatCount = Math.max(4, Math.ceil(12 / (baseTeams.length || 1)));
  const repeatedSegment = Array.from({ length: repeatCount }, () => baseTeams).flat();
  const marqueeSquads = [...repeatedSegment, ...repeatedSegment];

  return (
    <section
      id="teams"
      className="py-16 sm:py-24 bg-transparent relative z-[2] overflow-hidden"
    >
      <div className="w-full relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#D4AF37]/40 bg-[#D4AF37]/8 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Users className="w-3.5 h-3.5 text-[#55FF55]" />
            <span>ROSTER // SHORTLISTED SQUADS</span>
          </div>
          <h2 className="sf-gothic-title text-4xl sm:text-5xl md:text-6xl sf-text-gold mb-3">
            Featured Squads
          </h2>
          <p className="font-rajdhani text-neutral-400 text-sm max-w-lg mx-auto">
            The shortlisted engineering squads deployed in the battleground.
          </p>
        </div>

        {/* Right-to-Left Infinite Marquee Track */}
        {baseTeams.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-6 border border-[#D4AF37]/20 bg-[#0d1117]/80 sf-clip-angled-sm">
            <p className="font-mono text-xs text-[#F5D061] uppercase tracking-wider">
              Squad roster is currently being finalized by tournament command.
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden py-4 select-none">
            {/* Soft Lateral Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505]/95 via-[#050505]/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505]/95 via-[#050505]/60 to-transparent z-10 pointer-events-none" />

            {/* Marquee Row */}
            <div className="animate-squad-marquee flex items-center gap-4 sm:gap-6">
              {marqueeSquads.map((team, idx) => (
                <div
                  key={`${team.id || team.name}-${idx}`}
                  className="w-[250px] sm:w-[290px] shrink-0 relative group p-4 sm:p-5 border border-[#D4AF37]/25 hover:border-[#D4AF37] bg-[#0d1117]/90 hover:bg-[#D4AF37]/10 transition-all duration-300 sf-clip-angled-sm backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
                >
                  {/* Top Status & Squad Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-rajdhani text-[11px] text-[#D4AF37] tracking-[0.25em] uppercase font-bold flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-[#55FF55]" />
                      SQUAD {team.number || String((idx % baseTeams.length) + 1).padStart(2, '0')}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#55FF55] animate-pulse" />
                  </div>

                  {/* Team Name */}
                  <span className="block font-cinzel font-black text-base sm:text-lg text-white group-hover:text-[#F5D061] transition-colors uppercase leading-tight truncate">
                    {team.name}
                  </span>

                  {/* Category & Status */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-rajdhani">
                    <span className="text-neutral-400 truncate max-w-[170px]">
                      {team.category || 'COMBAT DOMAIN'}
                    </span>
                    <span className="text-[#55FF55] font-mono text-[10px] font-bold tracking-wider">
                      DEPLOYED
                    </span>
                  </div>

                  {/* Golden Tactical Corner Accents */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] transition-colors" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/30 group-hover:border-[#D4AF37]/80 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
