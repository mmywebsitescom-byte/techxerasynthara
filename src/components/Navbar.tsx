import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Swords, Camera, Phone } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

interface NavbarProps {
  onOpenRegister: () => void;
  activeSection: string;
  onOpenBattlegrounds: () => void;
  onOpenGallery: () => void;
  onOpenContact?: () => void;
}

export default function Navbar({ onOpenRegister, activeSection, onOpenBattlegrounds, onOpenGallery, onOpenContact }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const lastScrollY = useRef(0);
  const { content } = useSiteContent();
  const navbar = content?.navbar || {};
  const partners = Array.isArray(content?.partners) ? content.partners : [];

  // Scroll detection: header bar moves back (retracts) on scroll down, partner bar does not move
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 30) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          // Scrolling down: header moves back (hides out of view)
          setHideNav(true);
          setMobileMenuOpen(false);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up: header smoothly returns
          setHideNav(false);
        }
      } else {
        // Near top of page: header fully visible
        setHideNav(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure enough partner items for seamless infinite marquee loop
  const marqueePartners = partners.length > 0
    ? [...partners, ...partners, ...partners, ...partners].slice(0, Math.max(12, partners.length * 4))
    : [];

  const navLinks = [
    { name: 'ABOUT', href: '#mission' },
    { name: 'TIMELINE', href: '#timeline' },
    { name: 'PRIZES', href: '#prizes' },
    { name: 'PARTNERS', href: '#partners' },
  ];

  return (
    <>
      {/* 1. TOP PARTNER LOGOS BAR — FIXED AT TOP, DOES NOT MOVE */}
      {partners.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200 h-7 sm:h-8 px-2 sm:px-4 flex items-center overflow-hidden select-none shadow-sm">
          {/* Marquee Ticker */}
          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            {/* Subtle lateral gradient fades */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="animate-partner-marquee flex items-center gap-6 sm:gap-10">
              {marqueePartners.map((partner, index) => {
                const partnerItem = (
                  <div className="flex items-center gap-2 group/partner py-0.5 cursor-pointer">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-4 sm:h-5 max-w-[120px] object-contain transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className="font-rajdhani font-bold text-[11px] sm:text-xs tracking-wider text-gray-700 group-hover/partner:text-gray-900 transition-colors whitespace-nowrap">
                      {partner.name}
                    </span>
                  </div>
                );

                return partner.websiteUrl ? (
                  <a
                    key={`${partner.id || partner.name}-${index}`}
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center hover:opacity-100 transition-opacity"
                    title={`Visit ${partner.name}`}
                  >
                    {partnerItem}
                  </a>
                ) : (
                  <div key={`${partner.id || partner.name}-${index}`} className="inline-flex items-center">
                    {partnerItem}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER NAVIGATION BAR — MOVES BACK ON SCROLL */}
      <header
        className={`fixed left-0 right-0 z-40 w-full max-w-full border-b border-[#D4AF37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.9)] bg-[#0c1017]/95 backdrop-blur-md transition-all duration-300 ease-in-out ${partners.length > 0 ? 'top-7 sm:top-8' : 'top-0'
          } ${hideNav
            ? '-translate-y-[130%] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
          }`}
      >
        {/* Main Navigation Bar */}
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#hero"
            className="flex items-center gap-2 group cursor-pointer select-none shrink-0 -ml-1 sm:-ml-2"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              {navbar.siteLogoUrl ? (
                <img
                  src={String(navbar.siteLogoUrl)}
                  alt="Site Logo"
                  className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                />
              ) : (
                <Swords className="w-7 h-7 sm:w-8 sm:h-8 text-[#F5D061] group-hover:rotate-45 group-hover:scale-110 transition-all duration-300" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel font-black text-base sm:text-lg tracking-[0.14em] sf-text-gold leading-none">
                {navbar.brandName || "SYNTHARA2.0"}
                {navbar.brandAccent ? (
                  <> <span className="text-[#FF4655]">{navbar.brandAccent}</span></>
                ) : null}
              </span>
              <span className="font-rajdhani text-[9px] sm:text-[10px] tracking-[0.25em] text-[#D4AF37]/80 font-bold uppercase leading-none mt-1">
                {navbar.brandSubline || "BATTLEGROUND // GCEK"}
              </span>
            </div>
          </a>

          {/* Center Nav Links (Desktop) */}
          <nav
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 mx-2 lg:mx-4 shrink-0"
            aria-label="Main Navigation"
          >
            {/* BATTLES — gold swords pill */}
            <button
              id="nav-battlegrounds-btn"
              onClick={onOpenBattlegrounds}
              className="relative px-3 py-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer text-[#F5D061] bg-[#D4AF37]/10 border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 hover:[text-shadow:0_0_12px_rgba(212,175,55,0.8)] sf-clip-angled-sm shadow-[0_0_8px_rgba(212,175,55,0.1)] hover:shadow-[0_0_16px_rgba(212,175,55,0.25)]"
            >
              <Swords className="w-3 h-3" />
              <span>BATTLES</span>
            </button>

            {/* Scroll-anchor links */}
            {navLinks.map((link) => {
              const isActive = activeSection.toUpperCase() === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-2.5 py-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${isActive
                      ? 'text-[#F5D061] [text-shadow:0_0_12px_rgba(212,175,55,0.6)]'
                      : 'text-neutral-300 hover:text-[#F5D061] hover:[text-shadow:0_0_10px_rgba(212,175,55,0.4)]'
                    }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_8px_#D4AF37]"
                    />
                  )}
                </a>
              );
            })}

            {/* GALLERY — teal camera style */}
            <button
              id="nav-gallery-btn"
              onClick={onOpenGallery}
              className="relative px-3 py-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer text-[#4ECDC4] bg-[#4ECDC4]/8 border border-dashed border-[#4ECDC4]/40 hover:border-[#4ECDC4]/80 hover:bg-[#4ECDC4]/15 hover:[text-shadow:0_0_12px_rgba(78,205,196,0.7)]"
            >
              <Camera className="w-3 h-3" />
              <span>GALLERY</span>
            </button>

            {/* CONTACT — glowing phone style */}
            <button
              id="nav-contact-btn"
              onClick={onOpenContact}
              className="relative px-3 py-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer text-[#55FF55] bg-[#55FF55]/8 border border-[#55FF55]/40 hover:border-[#55FF55] hover:bg-[#55FF55]/15 hover:[text-shadow:0_0_12px_rgba(85,255,85,0.7)] sf-clip-angled-sm shadow-[0_0_8px_rgba(85,255,85,0.1)]"
            >
              <Phone className="w-3 h-3 text-[#55FF55]" />
              <span>CONTACT</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Crimson Register Button */}
            <button
              id="navbar-register-btn"
              onClick={onOpenRegister}
              className="h-9 sm:h-10 px-4 sm:px-6 sf-btn-crimson sf-clip-angled-sm flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span className="font-cinzel tracking-[0.16em]">REGISTER</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 bg-[#141a24] border border-[#D4AF37]/40 sf-clip-angled-sm flex items-center justify-center text-[#F5D061] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0c1017]/98 border-t border-[#D4AF37]/35 border-b-2 border-b-[#D4AF37]/50 shadow-[0_12px_30px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              <div className="px-4 py-5 space-y-2 max-h-[75vh] overflow-y-auto">
                {/* Mobile BATTLES — gold */}
                <button
                  id="mobile-nav-battlegrounds-btn"
                  onClick={() => { setMobileMenuOpen(false); onOpenBattlegrounds(); }}
                  className="w-full text-left font-cinzel font-bold text-xs uppercase tracking-[0.16em] text-[#F5D061] bg-[#D4AF37]/8 hover:bg-[#D4AF37]/15 p-2.5 border-l-2 border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Swords className="w-3.5 h-3.5" /> BATTLES
                </button>

                {/* Mobile GALLERY — teal dashed */}
                <button
                  id="mobile-nav-gallery-btn"
                  onClick={() => { setMobileMenuOpen(false); onOpenGallery(); }}
                  className="w-full text-left font-cinzel font-bold text-xs uppercase tracking-[0.16em] text-[#4ECDC4] bg-[#4ECDC4]/5 hover:bg-[#4ECDC4]/12 p-2.5 border-l-2 border-dashed border-[#4ECDC4]/50 hover:border-[#4ECDC4] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5" /> GALLERY
                </button>

                {/* Mobile CONTACT — green */}
                <button
                  id="mobile-nav-contact-btn"
                  onClick={() => { setMobileMenuOpen(false); onOpenContact?.(); }}
                  className="w-full text-left font-cinzel font-bold text-xs uppercase tracking-[0.16em] text-[#55FF55] bg-[#55FF55]/5 hover:bg-[#55FF55]/12 p-2.5 border-l-2 border-[#55FF55]/60 hover:border-[#55FF55] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> CONTACT & HELPLINE
                </button>

                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-cinzel font-bold text-xs uppercase tracking-[0.16em] text-neutral-300 hover:text-[#F5D061] hover:bg-[#141a24]/60 p-2.5 border-l-2 border-transparent hover:border-[#D4AF37] transition-all"
                  >
                    {link.name}
                  </a>
                ))}

                <div className="pt-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full py-3.5 sf-btn-crimson sf-clip-angled text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>REGISTER YOUR SQUAD</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
