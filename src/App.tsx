import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Stats from './components/Stats';
import Challenges from './components/Challenges';
import HowItWorks from './components/HowItWorks';
import Timeline from './components/Timeline';
import PrizesAndTeamsSection from './components/PrizesAndTeamsSection';
import GalleryPage from './components/Gallery';
import YourTeamPage from './components/YourTeam';
import Partners from './components/Partners';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import CinematicBackground from './components/CinematicBackground';
import BattlegroundsPage from './components/Battlegrounds';
import ContactPage from './components/Contact';
import AdminPanel from './components/AdminPanel';
import ScrollProgress from './components/ScrollProgress';
import SoundWidget from './components/SoundWidget';
import { ContentProvider, useSiteContent } from './context/ContentContext';
import { AudioProvider } from './context/AudioContext';
import { Challenge } from './types';
import { resetScrollImmediate } from './utils/scroll';

const SECTIONS = [
  { id: 'hero', name: 'HERO', index: 1 },
  { id: 'mission', name: 'MISSION', index: 2 },
  { id: 'stats', name: 'METRICS', index: 3 },
  { id: 'challenges', name: 'ARENA', index: 4 },
  { id: 'how-it-works', name: 'WARRIOR PATH', index: 5 },
  { id: 'timeline', name: 'TIMELINE', index: 6 },
  { id: 'prizes', name: 'CHAMPIONS', index: 7 },
  { id: 'sponsors', name: 'SPONSORS', index: 8 },
  { id: 'partners', name: 'PARTNERS', index: 9 },
  { id: 'faq', name: 'RULES', index: 10 },
];

function checkIsAdminUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path === '/admin' || path.startsWith('/admin/') || hash === '#admin';
}

function MainApp() {
  const { content } = useSiteContent();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('HERO');
  const [showBattlegrounds, setShowBattlegrounds] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showYourTeam, setShowYourTeam] = useState(false);
  const [showAdmin, setShowAdmin] = useState(checkIsAdminUrl);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = undefined;
    };
  }, []);

  // Dynamically sync browser tab favicon with Techxera site logo
  useEffect(() => {
    const logoUrl = content.navbar?.siteLogoUrl || '/favicon.png';
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = String(logoUrl);
  }, [content.navbar?.siteLogoUrl]);

  // When Admin Panel is opened, stop Lenis completely to ensure native scrolling
  useEffect(() => {
    if (showAdmin) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [showAdmin]);

  // High-performance Section Observer for active section in Navbar (Off-thread, Zero layout reflow)
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          const match = SECTIONS.find((s) => s.id === id);
          if (match) {
            setCurrentSection((prev) => (prev === match.name ? prev : match.name));
          }
        }
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Registration handler — always redirects to Google Form URL configured by admin
  const regForm = content?.registrationForm || {};
  const googleFormUrl = regForm.googleFormUrl ? String(regForm.googleFormUrl).trim() : '';
  const regIsOpen = regForm.isOpen !== false;

  // Battlegrounds lock state
  const eventControl = content?.eventControl || {};
  const battlegroundsLocked = eventControl.battlegroundsLocked === true;
  const battlegroundsLockedMessage = String(eventControl.battlegroundsLockedMessage || 'BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.');

  // Your Team lock state
  const isTeamLocked = content?.yourTeamLocked === true || eventControl?.yourTeamLocked === true;

  // Sync URL routing, sub-pages & browser back/forward buttons (Mobile gesture/hardware Back support)
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdmin = checkIsAdminUrl();
      setShowAdmin(isAdmin);

      const hash = window.location.hash.toLowerCase();

      if (hash === '#battlegrounds') {
        setShowBattlegrounds(true);
        setShowGallery(false);
        setShowContact(false);
        setShowYourTeam(false);
      } else if (hash === '#gallery') {
        setShowGallery(true);
        setShowBattlegrounds(false);
        setShowContact(false);
        setShowYourTeam(false);
      } else if (hash === '#contact') {
        setShowContact(true);
        setShowBattlegrounds(false);
        setShowGallery(false);
        setShowYourTeam(false);
      } else if ((hash === '#your-team' || hash === '#team') && !isTeamLocked) {
        setShowYourTeam(true);
        setShowBattlegrounds(false);
        setShowGallery(false);
        setShowContact(false);
      } else {
        // Returned to home landing page (via mobile back gesture/button or navigation)
        setShowBattlegrounds(false);
        setShowGallery(false);
        setShowContact(false);
        setShowYourTeam(false);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [isTeamLocked]);

  const handleCloseAdmin = () => {
    setShowAdmin(false);
    if (checkIsAdminUrl()) {
      window.history.pushState({}, '', '/');
    }
  };

  const handleOpenRegister = () => {
    if (!regIsOpen) {
      alert(
        regForm.closedMessage && !regForm.closedMessage.includes("HackVerse '26")
          ? regForm.closedMessage
          : "Registrations for SYNTHARA2.0 are currently closed by the administrator."
      );
      return;
    }
    const targetUrl = googleFormUrl || 'https://forms.google.com';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenRegisterWithChallenge = (_challenge: Challenge) => {
    setShowBattlegrounds(false);
    handleOpenRegister();
  };

  const handleOpenBattlegrounds = () => {
    setShowBattlegrounds(true);
    setShowGallery(false);
    setShowContact(false);
    setShowYourTeam(false);
    resetScrollImmediate();
    if (window.location.hash.toLowerCase() !== '#battlegrounds') {
      if (window.history.state?.modal === 'mobile-menu') {
        window.history.replaceState({ page: 'battlegrounds' }, '', '#battlegrounds');
      } else {
        window.history.pushState({ page: 'battlegrounds' }, '', '#battlegrounds');
      }
    }
  };

  const handleCloseBattlegrounds = () => {
    if (window.location.hash.toLowerCase() === '#battlegrounds') {
      window.history.back();
    } else {
      setShowBattlegrounds(false);
    }
    setTimeout(() => lenisRef.current?.resize(), 50);
  };

  const handleOpenGallery = () => {
    setShowGallery(true);
    setShowBattlegrounds(false);
    setShowContact(false);
    setShowYourTeam(false);
    resetScrollImmediate();
    if (window.location.hash.toLowerCase() !== '#gallery') {
      if (window.history.state?.modal === 'mobile-menu') {
        window.history.replaceState({ page: 'gallery' }, '', '#gallery');
      } else {
        window.history.pushState({ page: 'gallery' }, '', '#gallery');
      }
    }
  };

  const handleCloseGallery = () => {
    if (window.location.hash.toLowerCase() === '#gallery') {
      window.history.back();
    } else {
      setShowGallery(false);
    }
    setTimeout(() => lenisRef.current?.resize(), 50);
  };

  const handleOpenContact = () => {
    setShowContact(true);
    setShowBattlegrounds(false);
    setShowGallery(false);
    setShowYourTeam(false);
    resetScrollImmediate();
    if (window.location.hash.toLowerCase() !== '#contact') {
      if (window.history.state?.modal === 'mobile-menu') {
        window.history.replaceState({ page: 'contact' }, '', '#contact');
      } else {
        window.history.pushState({ page: 'contact' }, '', '#contact');
      }
    }
  };

  const handleCloseContact = () => {
    if (window.location.hash.toLowerCase() === '#contact') {
      window.history.back();
    } else {
      setShowContact(false);
    }
    setTimeout(() => lenisRef.current?.resize(), 50);
  };

  const handleOpenYourTeam = () => {
    if (isTeamLocked) return;
    setShowYourTeam(true);
    setShowBattlegrounds(false);
    setShowGallery(false);
    setShowContact(false);
    resetScrollImmediate();
    if (window.location.hash.toLowerCase() !== '#your-team') {
      if (window.history.state?.modal === 'mobile-menu') {
        window.history.replaceState({ page: 'your-team' }, '', '#your-team');
      } else {
        window.history.pushState({ page: 'your-team' }, '', '#your-team');
      }
    }
  };

  const handleCloseYourTeam = () => {
    if (window.location.hash.toLowerCase() === '#your-team' || window.location.hash.toLowerCase() === '#team') {
      window.history.back();
    } else {
      setShowYourTeam(false);
    }
    setTimeout(() => lenisRef.current?.resize(), 50);
  };

  const handleBattlegroundsRegister = (_challenge?: Challenge) => {
    setShowBattlegrounds(false);
    handleOpenRegister();
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#DC2626]/40 selection:text-white overflow-x-hidden">
      {/* Global Background */}
      {!showBattlegrounds && <CinematicBackground />}

      {/* Film Grain */}
      <div className="fixed inset-0 cinema-grain pointer-events-none z-[80]" />

      {/* Custom Reticle Cursor */}
      <CustomCursor />

      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Battlegrounds Page overlay */}
      {showBattlegrounds && (
        <BattlegroundsPage
          onBack={handleCloseBattlegrounds}
          onOpenRegister={handleBattlegroundsRegister}
          isLocked={battlegroundsLocked}
          lockedMessage={battlegroundsLockedMessage}
        />
      )}

      {/* Gallery Page overlay */}
      {showGallery && <GalleryPage onBack={handleCloseGallery} />}

      {/* Contact Page overlay */}
      {showContact && (
        <ContactPage
          onBack={handleCloseContact}
          onOpenYourTeam={handleOpenYourTeam}
          isTeamLocked={isTeamLocked}
        />
      )}

      {/* Your Team Page overlay */}
      {showYourTeam && (
        <YourTeamPage
          onBack={handleCloseYourTeam}
          isLocked={isTeamLocked}
        />
      )}

      {!showBattlegrounds && !showGallery && !showContact && !showYourTeam && (
        <>
          {/* Top Slim Scroll Progress */}
          <ScrollProgress />

          {/* Floating Navigation without Admin Button */}
          <Navbar
            onOpenRegister={handleOpenRegister}
            activeSection={currentSection}
            onOpenBattlegrounds={handleOpenBattlegrounds}
            onOpenGallery={handleOpenGallery}
            onOpenContact={handleOpenContact}
            onOpenYourTeam={handleOpenYourTeam}
          />

          {/* Main Sections */}
          <main className="w-full">
            <Hero onOpenBattlegrounds={handleOpenBattlegrounds} />
            <Mission />
            <Stats />
            <Challenges onSelectChallengeForRegister={handleOpenRegisterWithChallenge} />
            <HowItWorks />
            <Timeline />
            <PrizesAndTeamsSection />
            <Partners />
            <FAQ />
            <FinalCTA onOpenRegister={handleOpenRegister} />
          </main>

          {/* Footer */}
          <Footer />

          {/* Fixed Sound Toggle Button on Home Page (Elevated slightly upward) */}
          <SoundWidget />
        </>
      )}

      {/* Admin Panel Modal — Accessible via /admin in URL */}
      {showAdmin && <AdminPanel onClose={handleCloseAdmin} />}
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AudioProvider>
        <MainApp />
      </AudioProvider>
    </ContentProvider>
  );
}
