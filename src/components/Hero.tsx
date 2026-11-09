import { motion } from 'motion/react';
import { Terminal, ChevronDown, Swords, ExternalLink, Lock } from 'lucide-react';
import Countdown from './Countdown';
import { useSiteContent } from '../context/ContentContext';

interface HeroProps {
  onOpenBattlegrounds: () => void;
}

export default function Hero({ onOpenBattlegrounds }: HeroProps) {
  const { content } = useSiteContent();
  const hero = content?.hero || {};
  const eventInfo = content?.eventInfo || {};
  const regForm = content?.registrationForm || {};

  const scrollToBattlegrounds = () => {
    const el = document.getElementById('challenges');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const seatsClaimed = hero.seatsClaimed ?? 184;
  const seatsTotal = hero.seatsTotal ?? 200;
  const capPercent = Math.min(100, Math.round((seatsClaimed / (seatsTotal || 1)) * 100));
  const showProgressBar = hero.showProgressBar !== false;
  const regIsOpen = regForm.isOpen !== false;
  const googleFormUrl = String(regForm.googleFormUrl || '');

  const handleRegisterClick = () => {
    if (!regIsOpen) return;
    const targetUrl = googleFormUrl || 'https://forms.google.com';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 md:px-12 pt-32 sm:pt-36 pb-12 overflow-visible bg-transparent select-none"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[160px] sm:h-[240px] bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[140px] sm:h-[200px] bg-red-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-20 w-full max-w-7xl mx-auto text-center flex flex-col items-center mt-2 sm:mt-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative w-full max-w-full px-2"
        >
          <h1 className="sf-script-title sf-gothic-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.75rem] 2xl:text-8xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)] sf-text-silver whitespace-nowrap">
            {hero.titleGothic || eventInfo.titleGothic || "𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0"}{' '}
            <span className="sf-text-gold">{hero.titleAccent || eventInfo.titleAccent || "2026"}</span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-xs sm:text-sm md:text-base text-[#E2E8F0] font-rajdhani font-bold tracking-[0.2em] uppercase [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]"
        >
          {hero.subheadline || "WHERE WARRIORS CODE // 24 HOURS OF CODE, HARDWARE & INTELLIGENCE"}
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 max-w-2xl font-rajdhani text-sm sm:text-base text-neutral-300 leading-relaxed [text-shadow:0_2px_4px_rgba(0,0,0,0.9)]"
        >
          {hero.description ||
            "Assemble your squad of 2 to 4 engineers at the Government College of Engineering Kalahandi bamboo arena. Non-stop battleground programming, classified quests, and ₹1,50,000+ bounty pool."}
        </motion.p>

        {/* Progress Bar — conditionally shown */}
        {showProgressBar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full max-w-[360px] sm:max-w-[480px] md:max-w-[560px] mt-6 space-y-2 select-none"
          >
            <div className="flex items-center justify-between text-xs px-1 font-rajdhani">
              <span className="text-xs sm:text-sm text-[#F5D061] font-bold tracking-widest uppercase">
                ARENA SEATS: {seatsClaimed} / {seatsTotal} CLAIMED
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#FF4655] tracking-widest uppercase">
                {hero.capText || `${capPercent}% CAP // WARRIORS STANDING BY`}
              </span>
            </div>
            <div className="relative w-full p-1 bg-[#0d1117] border border-[#D4AF37]/50 sf-clip-angled-sm shadow-[0_4px_20px_rgba(0,0,0,0.9),inset_0_2px_8px_rgba(0,0,0,0.9)]">
              <div className="relative w-full h-3 sm:h-4 bg-[#141b24] overflow-hidden sf-clip-angled-sm">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#FF4655] shadow-[0_0_15px_rgba(212,175,55,0.8)] transition-all duration-500"
                  style={{ width: `${capPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Countdown */}
        {hero.showCountdown !== false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 w-full"
          >
            <Countdown targetDate={content?.hero?.countdownTargetDate || content?.eventControl?.countdownTargetDate || '2026-10-16T09:00:00Z'} />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          {/* Register Button */}
          {regIsOpen ? (
            <button
              id="hero-register-team-btn"
              onClick={handleRegisterClick}
              className="w-full sm:w-auto h-12 sm:h-14 px-8 sf-clip-angled flex items-center justify-center gap-3 text-sm sm:text-base font-black tracking-[0.16em] transition-all sf-btn-crimson cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              <span>{hero.joinBattleLabel || "JOIN THE BATTLE"}</span>
              <ExternalLink className="w-5 h-5 text-[#FFE082]" />
            </button>
          ) : (
            <button
              id="hero-register-team-btn-closed"
              disabled
              className="w-full sm:w-auto h-12 sm:h-14 px-8 sf-clip-angled flex items-center justify-center gap-3 text-sm sm:text-base font-black tracking-[0.16em] cursor-not-allowed bg-[#1a1a1a] border border-neutral-700 text-neutral-500"
            >
              <Lock className="w-4 h-4" />
              <span>REGISTRATIONS CLOSED</span>
            </button>
          )}

          {/* Battlegrounds Button */}
          <button
            id="hero-browse-problems-btn"
            onClick={onOpenBattlegrounds}
            className="w-full sm:w-auto h-12 sm:h-14 px-7 sf-btn-gold sf-clip-angled flex items-center justify-center gap-2.5 text-sm sm:text-base tracking-[0.14em] cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>{hero.battlegroundsLabel || "BATTLEGROUNDS"}</span>
          </button>
        </motion.div>

        {/* Closed notice */}
        {!regIsOpen && regForm.closedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mt-4 px-4 py-2.5 border border-[#FF4655]/40 bg-[#FF4655]/10 text-[#FF4655] font-rajdhani text-xs tracking-widest uppercase flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>{regForm.closedMessage}</span>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        onClick={scrollToBattlegrounds}
        className="relative z-20 mt-10 flex flex-col items-center gap-1.5 cursor-pointer text-neutral-400 hover:text-[#F5D061] transition-colors"
      >
        <span className="font-rajdhani text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.9)]">
          EXPLORE COMBAT DOMAINS
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#F5D061]" />
      </motion.div>
    </section>
  );
}
