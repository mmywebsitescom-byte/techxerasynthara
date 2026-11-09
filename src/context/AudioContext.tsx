import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  toggleSound: () => void;
  enableSound: () => void;
  disableSound: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  isMuted: true,
  toggleSound: () => {},
  enableSound: () => {},
  disableSound: () => {},
});

const AUDIO_SRC = '/assets/bg_music.mp3';
const DEFAULT_VOLUME = 0.35;
const STORAGE_KEY = 'hackverse_bg_music_muted';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Default to music ON (false) when someone opens the website
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Keep a synchronous ref so event handlers and callbacks never see stale state
  const isMutedRef = useRef<boolean>(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Initialize single Audio element once
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = DEFAULT_VOLUME;
    audio.preload = 'auto';
    audio.muted = isMutedRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    audioRef.current = audio;

    // Immediately attempt autoplay on initial page load if not muted
    if (!isMutedRef.current) {
      audio.muted = false;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Browser requires first user gesture, handleInteraction will start it
      });
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.muted = true;
      audioRef.current = null;
    };
  }, []);

  const disableSound = useCallback(() => {
    // 1. Immediately update ref and persistent storage
    isMutedRef.current = true;
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch { /* ignore */ }

    // 2. Hardware/software mute + pause immediately
    const audio = audioRef.current;
    if (audio) {
      audio.muted = true;
      audio.pause();
    }

    // 3. Update React UI state
    setIsMuted(true);
    setIsPlaying(false);
  }, []);

  const enableSound = useCallback(() => {
    // 1. Immediately update ref and persistent storage
    isMutedRef.current = false;
    try {
      localStorage.setItem(STORAGE_KEY, 'false');
    } catch { /* ignore */ }

    // 2. Unmute and play
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback waiting for user gesture:', err);
      });
    }

    // 3. Update React UI state
    setIsMuted(false);
  }, []);

  const toggleSound = useCallback(() => {
    // If sound is currently ON (not muted), turn it OFF immediately
    if (!isMutedRef.current) {
      disableSound();
    } else {
      enableSound();
    }
  }, [disableSound, enableSound]);

  // Listen for user gestures to start audio ONLY if explicitly unmuted
  useEffect(() => {
    if (isMuted) return;

    const handleInteraction = (e: Event) => {
      // If user muted, do not play!
      if (isMutedRef.current) return;

      // If user clicked any sound toggle button, let the toggle handler handle it
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#fixed-sound-toggle-btn, #sound-toggle-btn, #mobile-sound-toggle-btn, #hero-sound-toggle-btn, #loading-sound-btn, #loading-bottom-sound-btn')) {
        return;
      }

      const audio = audioRef.current;
      if (audio && !isMutedRef.current && audio.paused) {
        audio.muted = false;
        audio.volume = DEFAULT_VOLUME;
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('click', handleInteraction, { capture: true });
    window.addEventListener('keydown', handleInteraction, { capture: true });
    window.addEventListener('touchstart', handleInteraction, { capture: true, passive: true });
    window.addEventListener('pointerdown', handleInteraction, { capture: true });
    window.addEventListener('scroll', handleInteraction, { capture: true, passive: true });

    return () => {
      window.removeEventListener('click', handleInteraction, { capture: true });
      window.removeEventListener('keydown', handleInteraction, { capture: true });
      window.removeEventListener('touchstart', handleInteraction, { capture: true });
      window.removeEventListener('pointerdown', handleInteraction, { capture: true });
      window.removeEventListener('scroll', handleInteraction, { capture: true });
    };
  }, [isMuted]);

  return (
    <AudioContext.Provider value={{ isPlaying, isMuted, toggleSound, enableSound, disableSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
