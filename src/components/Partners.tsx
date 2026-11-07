import { useState, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Shield, X, ExternalLink, Sparkles, Lock } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { Partner } from '../types';

export default function Partners() {
  const { content } = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.04, 1.1]);

  const isLocked = content?.eventControl?.partnersLocked === true || content?.eventControl?.sponsorsLocked === true;
  const lockedMsg = String(content?.eventControl?.partnersLockedMessage || content?.eventControl?.sponsorsLockedMessage || "PARTNER ALLIANCES ARE CURRENTLY CLASSIFIED. OFFICIAL PARTNERS WILL BE UNVEILED CLOSER TO LAUNCH.");

  // Only display partners from Supabase database (no mock data fallback)
  const rawPartners: any[] = Array.isArray(content.partners) && content.partners.length > 0
    ? content.partners
    : (Array.isArray(content.sponsors) && content.sponsors.length > 0 ? content.sponsors : []);

  const allPartners: Partner[] = rawPartners.map((s, idx) => ({
    id: s.id || `pt-${idx}`,
    name: s.name,
    tier: s.tier || 'Gold',
    category: s.category || s.perk || 'Developer Ecosystem & Grants',
    perk: s.perk || 'Official Arena Combat Partner',
    logoUrl: s.logoUrl || s.logo || '',
    logoText: s.name ? s.name.split(' ').map((w: string) => w[0]).join('').slice(0, 4) : 'HV',
    websiteUrl: s.websiteUrl || '',
  }));

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail || !partnerOrg) return;
    setPartnerSubmitted(true);
    setTimeout(() => {
      setPartnerModalOpen(false);
      setPartnerSubmitted(false);
      setPartnerEmail('');
      setPartnerOrg('');
    }, 1800);
  };

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* Bamboo Forest Duel Background with Parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.img
          src="/assets/bg_sponsors_bamboo_duel.jpg"
          alt="Bamboo Forest Duel Background"
          style={{ y: bgY, scale: bgScale }}
          className="absolute left-0 top-[-8%] w-full h-[116%] object-cover object-center opacity-95 brightness-[0.84] contrast-[1.12] saturate-[1.2] will-change-transform"
        />
        {/* Soft top gradient transition */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505] via-[#050505]/40 to-transparent" />
        {/* Soft bottom gradient transition */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        {/* Edge vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50" />
        {/* Subtle green glow matching the bamboo/teal palette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_50%,rgba(80,220,100,0.06),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-[2]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              OFFICIAL <span className="text-[#55FF55]">PARTNERS</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl [text-shadow:_1px_1px_0_#000]">
              Backed by leading venture networks, cloud infrastructure providers, and engineering ecosystems.
            </p>
          </div>
          <button
            onClick={() => setPartnerModalOpen(true)}
            className="self-start md:self-end px-6 py-3 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[3px_3px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>BECOME A PARTNER</span>
          </button>
        </div>

        {isLocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-14 border-2 border-[#FF4655]/40 bg-[#0c1017] sf-clip-angled-sm text-center flex flex-col items-center justify-center gap-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF4655]/15 border-2 border-[#FF4655]/60 flex items-center justify-center shadow-[0_0_30px_rgba(255,70,85,0.3)]">
              <Lock className="w-8 h-8 text-[#FF4655]" />
            </div>
            <div className="space-y-1">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#FF4655]">
                CLASSIFICATION: RESTRICTED // PARTNER ROSTER CLASSIFIED
              </p>
              <h3 className="font-mono font-black text-2xl sm:text-3xl text-white uppercase">
                ALLIANCES LOCKED BY COMMAND
              </h3>
            </div>
            <p className="font-rajdhani text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {lockedMsg}
            </p>
            <button
              onClick={() => setPartnerModalOpen(true)}
              className="mt-2 px-6 py-3 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-widest uppercase cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>REQUEST PARTNERSHIP DOSSIER</span>
            </button>
          </motion.div>
        ) : allPartners.length === 0 ? (
          <div className="p-8 border-2 border-[#FFAA00]/40 bg-[#101010]/80 text-center font-mono">
            <p className="text-[#FFDF78] text-sm uppercase">Official partner roster is updating.</p>
            <button
              onClick={() => setPartnerModalOpen(true)}
              className="mt-4 px-5 py-2.5 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono text-xs font-bold uppercase"
            >
              Partner with Us
            </button>
          </div>
        ) : (
          /* Uniform Partners Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPartners.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-[#141418]/85 backdrop-blur-md border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
              >
                <div>
                  {/* Partner Site Link */}
                  {partner.websiteUrl && (
                    <div className="flex justify-end mb-2">
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#55FF55] hover:text-white transition-colors p-1"
                        title="Visit Partner Site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Logo Box */}
                  <div className="w-full h-24 bg-white border-2 border-gray-200 p-3 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.12)] my-3 rounded-sm">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-16 max-w-[85%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                      />
                    ) : (
                      <span className="font-mono font-black text-xl text-[#55FF55] tracking-wider uppercase [text-shadow:_1px_1px_0_#000]">
                        {partner.logoText}
                      </span>
                    )}
                  </div>

                  {/* Large Title */}
                  <div className="font-mono font-black text-2xl sm:text-3xl text-white tracking-wide mt-2 uppercase [text-shadow:_2px_2px_0_#000]">
                    {partner.name}
                  </div>

                  {/* Description Paragraph */}
                  <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed [text-shadow:_1px_1px_0_#000]">
                    {partner.category}
                  </p>

                  {/* Star Bullet List */}
                  <ul className="mt-4 space-y-2 font-mono text-xs text-neutral-200">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFAA00] shrink-0">★</span>
                      <span>{partner.perk || "Official Ecosystem Partner"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFAA00] shrink-0">★</span>
                      <span>Direct Outreach & Incubation</span>
                    </li>
                    {partner.websiteUrl && (
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFAA00] shrink-0">★</span>
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#55FF55] hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Official Partner Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Partner Inquiry Modal */}
      <AnimatePresence>
        {partnerModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPartnerModalOpen(false)}
              className="fixed inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-md bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] z-10"
            >
              <div className="bg-[#2A2A2A] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#555555]">
                <span className="font-mono text-xs font-bold uppercase">
                  PARTNERSHIP ENLISTMENT PROTOCOL
                </span>
                <button
                  onClick={() => setPartnerModalOpen(false)}
                  className="w-6 h-6 bg-[#DBDBDB] text-black font-black flex items-center justify-center border border-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 sm:p-5">
                {partnerSubmitted ? (
                  <div className="text-center py-4 font-mono">
                    <div className="text-[#55FF55] font-black text-sm uppercase mb-1">
                      INQUIRY TRANSMITTED!
                    </div>
                    <p className="text-xs text-neutral-800">
                      Our partnership coordinators will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePartnerSubmit} className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-black font-bold uppercase mb-1">
                        Organization / Enterprise Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerOrg}
                        onChange={(e) => setPartnerOrg(e.target.value)}
                        placeholder="e.g. Google Cloud, GitHub, Supabase"
                        className="w-full bg-[#101010] border-3 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] text-[#55FF55] p-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-black font-bold uppercase mb-1">
                        Corporate Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="partner@enterprise.com"
                        className="w-full bg-[#101010] border-3 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] text-[#55FF55] p-2 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] cursor-pointer"
                    >
                      SUBMIT PARTNERSHIP INTEREST
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}