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

const SECTIONS = [
  { id: 'hero', name: 'HERO', index: 1 },
  { id: 'mission', name: 'MISSION', index: 2 },
  { id: 'stats', name: 'METRICS', index: 3 },
  { id: 'challenges', name: 'ARENA', index: 4 },
  { id: 'how-it-works', name: 'WARRIOR PATH', index: 5 },
  { id: 'timeline', name: 'TIMELINE', index: 6 },
  { id: 'prizes', name: 'CHAMPIONS', index: 7 },
  { id: 'teams', name: 'SQUADS', index: 8 },
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
  const [showAdmin, setShowAdmin] = useState(checkIsAdminUrl);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

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

  // Section Observer for active section in Navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollY >= top) {
            setCurrentSection(SECTIONS[i].name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync /admin URL routing
  useEffect(() => {
    const handleUrlChange = () => {
      setShowAdmin(checkIsAdminUrl());
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleCloseAdmin = () => {
    setShowAdmin(false);
    if (checkIsAdminUrl()) {
      window.history.pushState({}, '', '/');
    }
  };

  // Registration handler — always redirects to Google Form URL configured by admin
  const regForm = content?.registrationForm || {};
  const googleFormUrl = regForm.googleFormUrl ? String(regForm.googleFormUrl).trim() : '';
  const regIsOpen = regForm.isOpen !== false;

  // Battlegrounds lock state
  const eventControl = content?.eventControl || {};
  const battlegroundsLocked = eventControl.battlegroundsLocked === true;
  const battlegroundsLockedMessage = String(eventControl.battlegroundsLockedMessage || 'BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.');

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
    window.scrollTo({ top: 0 });
  };

  const handleCloseBattlegrounds = () => {
    setShowBattlegrounds(false);
  };

  const handleOpenGallery = () => {
    setShowGallery(true);
    setShowBattlegrounds(false);
    setShowContact(false);
    window.scrollTo({ top: 0 });
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  const handleOpenContact = () => {
    setShowContact(true);
    setShowBattlegrounds(false);
    setShowGallery(false);
    window.scrollTo({ top: 0 });
  };

  const handleCloseContact = () => {
    setShowContact(false);
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
      {showContact && <ContactPage onBack={handleCloseContact} />}

      {!showBattlegrounds && !showGallery && !showContact && (
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
