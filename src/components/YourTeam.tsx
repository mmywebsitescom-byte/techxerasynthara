import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronLeft, Shield, Award, Linkedin, Instagram, Github, ExternalLink, Sparkles, UserCheck, Lock } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { YourTeamMember } from '../types';
import SkeletonImage from './SkeletonImage';

interface YourTeamPageProps {
  onBack: () => void;
  isLocked?: boolean;
  lockedMessage?: string;
}

export default function YourTeamPage({ onBack, isLocked, lockedMessage }: YourTeamPageProps) {
  const { content } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (isLocked) {
    return (
      <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] flex flex-col items-center justify-center p-4 select-none">
        <div className="max-w-md w-full bg-[#0c1017] border border-[#FF4655]/50 sf-clip-angled p-8 text-center space-y-4 shadow-[0_0_30px_rgba(255,70,85,0.2)]">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FF4655]/15 border border-[#FF4655] flex items-center justify-center text-[#FF4655]">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-cinzel text-xl font-bold text-white uppercase tracking-wider">
            ROSTER CLASSIFIED
          </h2>
          <p className="font-rajdhani text-sm text-neutral-300">
            {lockedMessage || 'TEAM INTEL AND ROSTER ACCESS IS CURRENTLY RESTRICTED BY ARENA COMMAND.'}
          </p>
          <div className="pt-2">
            <button
              onClick={onBack}
              className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-widest uppercase cursor-pointer"
            >
              ← RETURN TO ARENA
            </button>
          </div>
        </div>
      </div>
    );
  }

  const teamList: YourTeamMember[] = Array.isArray(content?.yourTeam) && content.yourTeam.length > 0
    ? content.yourTeam
    : [];

  // Dynamic categories: ALL + admin configured categories + any categories defined on team members
  const configuredCategories = Array.isArray(content?.yourTeamCategories) && content.yourTeamCategories.length > 0
    ? content.yourTeamCategories
    : ['LEADERSHIP', 'CORE CREW', 'TECHNICAL', 'OPERATIONS', 'CREATIVE & DESIGN'];

  const memberCategories = teamList.map((m) => (m.category || '').trim()).filter(Boolean);
  const uniqueCategories = Array.from(new Set([...configuredCategories, ...memberCategories]));
  const categories = ['ALL', ...uniqueCategories];

  const filteredMembers = selectedCategory === 'ALL'
    ? teamList
    : teamList.filter((m) => {
        const memberCat = (m.category || '').trim().toUpperCase();
        const targetCat = selectedCategory.trim().toUpperCase();
        return memberCat === targetCat;
      });

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Ambient Cyber Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-[#D4AF37]/6 blur-[170px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-[#4ECDC4]/5 blur-[180px]" />
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] rounded-full bg-[#FF4655]/4 blur-[190px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Navigation & Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            id="team-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#D4AF37]/80 hover:text-[#F5D061] font-rajdhani font-bold text-xs tracking-[0.2em] uppercase transition-colors group cursor-pointer bg-[#0c1017]/80 px-4 py-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] sf-clip-angled-sm shadow-[0_0_12px_rgba(212,175,55,0.1)]"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO MAIN ARENA
          </button>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-[0.25em] mb-4 sf-clip-angled-sm">
            <Users className="w-3.5 h-3.5 text-[#55FF55]" />
            <span>TECHXERA // ORGANIZING COMMAND</span>
          </div>

          <h1 className="sf-gothic-title text-4xl sm:text-5xl md:text-6xl sf-text-gold mb-4 leading-tight">
            YOUR TEAM
          </h1>

          <p className="font-rajdhani text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Meet the architects, engineers, coordinators, and visionaries powering <span className="text-[#F5D061] font-bold">TECHXERA</span> and curating <span className="text-[#55FF55] font-bold">SYNTHARA 2.0</span>.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-mono text-[#D4AF37]/70">
            <Sparkles className="w-3 h-3 text-[#55FF55]" />
            <span>COMMAND FORCE: {teamList.length} DEPLOYED OPERATIVES</span>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10 select-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 font-rajdhani text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 sf-clip-angled-sm cursor-pointer ${
                  isSelected
                    ? 'sf-btn-gold text-black shadow-[0_0_14px_rgba(212,175,55,0.4)]'
                    : 'bg-[#0c1017] text-neutral-400 border border-[#D4AF37]/25 hover:border-[#D4AF37]/70 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Team Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 border border-[#D4AF37]/30 bg-[#0c1017]/90 sf-clip-angled-sm shadow-xl">
            <UserCheck className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
            <h3 className="font-cinzel text-lg font-bold text-white mb-2">TEAM ROSTER INITIALIZING</h3>
            <p className="font-rajdhani text-xs text-neutral-400">
              No team members found under <span className="text-[#F5D061] font-mono">"{selectedCategory}"</span>.
              Admin can add and update members anytime in the <span className="text-white font-mono">/admin</span> portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, index) => {
                const initials = (member.name || 'Member')
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <motion.div
                    key={member.id || `member-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    className="group relative bg-[#0c1017]/90 border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 sf-clip-angled-sm transition-all duration-300 flex flex-col justify-between shadow-[0_6px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.18)] hover:-translate-y-1"
                  >
                    {/* Golden Tactical Corner Accents */}
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] transition-colors" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/30 group-hover:border-[#D4AF37]/80 transition-colors" />

                    <div>
                      {/* Image / Avatar Container */}
                      <div className="w-full aspect-[4/4.5] border border-[#D4AF37]/35 bg-[#141a24] sf-clip-angled-sm overflow-hidden relative mb-4 flex items-center justify-center group-hover:border-[#D4AF37] transition-colors">
                        {member.image && member.image.trim() ? (
                          <SkeletonImage
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            containerClassName="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#141b26] to-[#0c1017] p-4 text-center">
                            <div className="w-16 h-16 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center text-xl font-cinzel font-bold text-[#F5D061] mb-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                              {initials}
                            </div>
                            <span className="font-rajdhani text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                              TECHXERA WARRIOR
                            </span>
                          </div>
                        )}

                        {/* Top Category Tag */}
                        <div className="absolute top-2.5 left-2.5 bg-[#0c1017]/90 border border-[#D4AF37]/50 px-2 py-0.5 text-[9px] font-mono font-bold text-[#F5D061] tracking-wider uppercase sf-clip-angled-sm backdrop-blur-sm">
                          {member.category || 'CORE ORGANIZER'}
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="font-cinzel font-black text-lg text-white group-hover:text-[#F5D061] transition-colors leading-tight mb-3">
                        {member.name}
                      </h3>

                      {/* Dual Role Badges: TECHXERA & SYNTHARA 2.0 */}
                      <div className="space-y-2 mb-4">
                        {/* 1. Designation in TECHXERA */}
                        <div className="p-2 border border-[#4ECDC4]/30 bg-[#4ECDC4]/5 sf-clip-angled-sm">
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#4ECDC4] font-bold uppercase tracking-widest">
                            <Shield className="w-3 h-3 text-[#4ECDC4]" />
                            <span>DESIGNATION IN TECHXERA</span>
                          </div>
                          <p className="font-rajdhani text-xs font-bold text-white mt-0.5 leading-snug">
                            {member.designationTechxera || 'Core Member'}
                          </p>
                        </div>

                        {/* 2. Designation in SYNTHARA 2.0 */}
                        <div className="p-2 border border-[#D4AF37]/40 bg-[#D4AF37]/8 sf-clip-angled-sm">
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#F5D061] font-bold uppercase tracking-widest">
                            <Award className="w-3 h-3 text-[#F5D061]" />
                            <span>DESIGNATION IN SYNTHARA2.0</span>
                          </div>
                          <p className="font-rajdhani text-xs font-bold text-[#F5D061] mt-0.5 leading-snug">
                            {member.designationSynthara || 'Organizing Committee'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Social Connect Icons */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                        DISPATCH LINK
                      </span>
                      <div className="flex items-center gap-2">
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl.startsWith('http') ? member.linkedinUrl : `https://${member.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 bg-[#141b26] border border-white/10 hover:border-[#0077b5] hover:text-[#0077b5] text-neutral-300 flex items-center justify-center transition-colors sf-clip-angled-sm"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {member.instagramUrl && (
                          <a
                            href={member.instagramUrl.startsWith('http') ? member.instagramUrl : `https://${member.instagramUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 bg-[#141b26] border border-white/10 hover:border-[#E1306C] hover:text-[#E1306C] text-neutral-300 flex items-center justify-center transition-colors sf-clip-angled-sm"
                            title="Instagram Profile"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {member.githubUrl && (
                          <a
                            href={member.githubUrl.startsWith('http') ? member.githubUrl : `https://${member.githubUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 bg-[#141b26] border border-white/10 hover:border-[#55FF55] hover:text-[#55FF55] text-neutral-300 flex items-center justify-center transition-colors sf-clip-angled-sm"
                            title="GitHub Profile"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {!member.linkedinUrl && !member.instagramUrl && !member.githubUrl && (
                          <span className="text-[10px] font-mono text-neutral-500">OPERATIVE ACTIVE</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-14 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            ← RETURN TO ARENA
          </button>
        </div>
      </div>
    </div>
  );
}

