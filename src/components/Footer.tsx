import { Mail, MapPin, Calendar, ArrowUp } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import SkeletonImage from './SkeletonImage';
import { smoothScrollTo } from '../utils/scroll';

function formatExternalUrl(url?: string, platform?: string): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();

  // If already starts with http:// or https://
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If starts with //
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Handle '@username'
  if (trimmed.startsWith('@')) {
    const handle = trimmed.substring(1);
    if (platform === 'INSTAGRAM') return `https://instagram.com/${handle}`;
    if (platform === 'TWITTER') return `https://x.com/${handle}`;
    if (platform === 'GITHUB') return `https://github.com/${handle}`;
    if (platform === 'LINKEDIN') return `https://linkedin.com/in/${handle}`;
  }

  // If starts with domain names like instagram.com, github.com, etc.
  if (/^(www\.)?(instagram\.com|github\.com|twitter\.com|x\.com|linkedin\.com|discord\.gg|discord\.com)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // If user just typed their username/handle (e.g. 'techxera' or 'codebreakers')
  if (!trimmed.includes('.') && !trimmed.includes('/')) {
    if (platform === 'INSTAGRAM') return `https://instagram.com/${trimmed}`;
    if (platform === 'TWITTER') return `https://x.com/${trimmed}`;
    if (platform === 'GITHUB') return `https://github.com/${trimmed}`;
    if (platform === 'LINKEDIN') return `https://linkedin.com/in/${trimmed}`;
    if (platform === 'DISCORD') return `https://discord.gg/${trimmed}`;
  }

  // Fallback: prepend https://
  return `https://${trimmed}`;
}

export default function Footer() {
  const { content } = useSiteContent();
  const footer = content?.footer || {};
  const eventInfo = content?.eventInfo || {};
  const regForm = content?.registrationForm || {};

  const isRegOpen = regForm.isOpen !== false;

  const scrollToTop = () => {
    smoothScrollTo(0, { offset: 0 });
  };

  const socials = [
    { name: 'DISCORD', href: formatExternalUrl(footer.discord || 'https://discord.gg', 'DISCORD') },
    { name: 'INSTAGRAM', href: formatExternalUrl(footer.instagram || 'https://instagram.com', 'INSTAGRAM') },
    { name: 'GITHUB', href: formatExternalUrl(footer.github || 'https://github.com', 'GITHUB') },
    { name: 'TWITTER', href: formatExternalUrl(footer.twitter || 'https://twitter.com', 'TWITTER') },
    { name: 'LINKEDIN', href: formatExternalUrl(footer.linkedin || 'https://linkedin.com', 'LINKEDIN') },
  ].filter((item) => Boolean(item.href && item.href.trim()));

  const formattedPoweredByUrl = formatExternalUrl(footer.poweredByUrl || 'https://raghabportfolio.in');

  return (
    <footer className="bg-[#121212] border-t-4 border-t-[#383838] py-12 px-4 sm:px-6 md:px-12 text-neutral-300 relative overflow-hidden select-none font-mono">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b-2 border-[#282828]">
          {/* Brand Left */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="shrink-0 flex items-center justify-center">
                {content?.navbar?.siteLogoUrl ? (
                  <SkeletonImage
                    src={String(content.navbar.siteLogoUrl)}
                    alt="SYNTHARA2.0 Logo"
                    className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(255,170,0,0.25)]"
                    containerClassName="w-12 h-12 flex items-center justify-center"
                  />
                ) : (
                  <span className="font-mono font-black text-sm text-[#FFAA00]">HV</span>
                )}
              </div>
              <div>
                <span className="font-mono font-black text-xl text-white tracking-wide leading-none block">
                  {eventInfo.name && eventInfo.name !== "HACKVERSE '26" ? eventInfo.name : "SYNTHARA2.0"}
                </span>
                <span className="font-mono text-[10px] text-[#55FF55] font-bold block">
                  BY CODEBREAKERS // GCEK
                </span>
              </div>
            </div>

            <p className="font-mono text-xs text-neutral-400 leading-relaxed max-w-sm">
              {eventInfo.tagline || "The premier state hackathon platform organized by Codebreakers Club at Government College of Engineering Kalahandi."}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className={`w-2 h-2 rounded-none inline-block ${isRegOpen ? 'bg-[#55FF55]' : 'bg-[#FF4655]'}`} />
              <span className={`text-[11px] font-bold ${isRegOpen ? 'text-[#55FF55]' : 'text-[#FF4655]'}`}>
                {isRegOpen ? (footer.systemStatusText || 'SYSTEM STATUS: REGISTRATIONS OPEN') : 'SYSTEM STATUS: REGISTRATIONS PAUSED'}
              </span>
            </div>
          </div>

          {/* Coordinates */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              VENUE & COORDINATES
            </div>
            <ul className="space-y-2 font-mono text-xs text-neutral-300">
              <li className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#FFAA00]" />
                <span>{eventInfo.dates || 'October 16 - 18, 2026'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#55FF55]" />
                <span>{footer.address || 'Government College of Engineering Kalahandi, Bhawanipatna, Odisha 766002'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <a href={`mailto:${footer.contactEmail || 'codebreakers@gcekbpatna.ac.in'}`} className="hover:text-[#55FF55] transition-colors">
                  {footer.contactEmail || 'codebreakers@gcekbpatna.ac.in'}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links / Socials */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              COMMUNITY LINKS
            </div>
            <div className="flex flex-wrap gap-2">
              {socials.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#222222] border-2 border-t-[#3a3a3a] border-l-[#3a3a3a] border-r-[#111111] border-b-[#111111] text-neutral-300 hover:text-[#55FF55] text-[10px] font-bold transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="px-3 py-1.5 bg-[#DBDBDB] hover:bg-white text-black font-mono font-black text-xs border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" />
                <span>BACK TO TOP</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3 border-t border-[#222222]">
          <div>
            {footer.copyright && !footer.copyright.includes("HACKVERSE") ? footer.copyright : '© 2026 SYNTHARA2.0 // CODEBREAKERS CLUB GCEK. ALL RIGHTS RESERVED.'}
          </div>

          {/* Right Side: Powered by: Raghab Barik, clickable to destination link */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-right">
            <span className="text-[11px] text-neutral-400 font-bold tracking-wider">
              {footer.poweredByPrefix !== undefined && footer.poweredByPrefix !== '' ? footer.poweredByPrefix : 'Powered by:'}
            </span>
            {formattedPoweredByUrl ? (
              <a
                href={formattedPoweredByUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#FFAA00] hover:text-[#55FF55] transition-colors underline decoration-[#FFAA00]/40 hover:decoration-[#55FF55] tracking-wide"
                title={`Visit ${footer.poweredByName || 'Raghab Barik'}`}
              >
                {footer.poweredByName || 'Raghab Barik'}
              </a>
            ) : (
              <span className="font-bold text-[#FFAA00] tracking-wide">
                {footer.poweredByName || 'Raghab Barik'}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
