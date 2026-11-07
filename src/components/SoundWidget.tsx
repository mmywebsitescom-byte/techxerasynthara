import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function SoundWidget() {
  const { isPlaying, isMuted, toggleSound } = useAudio();

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 z-40 select-none pointer-events-auto">
      <button
        id="fixed-sound-toggle-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSound();
        }}
        aria-label={isMuted || !isPlaying ? 'Turn background sound ON' : 'Turn background sound OFF'}
        title={isMuted || !isPlaying ? 'Sound: OFF (Click to Play)' : 'Sound: ON (Click to Mute)'}
        className={`w-11 h-11 sm:w-12 sm:h-12 sf-clip-angled-sm flex items-center justify-center transition-all duration-300 cursor-pointer relative group border shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-md ${
          isMuted || !isPlaying
            ? 'bg-[#0e1219]/90 border-[#D4AF37]/35 hover:border-[#D4AF37] text-neutral-400 hover:text-[#F5D061] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'
            : 'bg-[#0f1712]/95 border-[#55FF55]/60 hover:border-[#55FF55] text-[#55FF55] shadow-[0_0_20px_rgba(85,255,85,0.35)]'
        }`}
      >
        {isMuted || !isPlaying ? (
          <VolumeX className="w-5 h-5 transition-transform group-hover:scale-110 text-neutral-400 group-hover:text-[#F5D061]" />
        ) : (
          <Volume2 className="w-5 h-5 text-[#55FF55] animate-pulse transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
