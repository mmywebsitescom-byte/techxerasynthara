import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      if (isNaN(target)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center justify-center gap-2 sm:gap-3.5">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2 sm:gap-3.5">
            <div className="flex flex-col items-center">
              {/* Shadow Fight Obsidian Combat Chamber */}
              <div className="relative px-3 py-2 sm:px-4 sm:py-3 sf-clip-angled-sm bg-gradient-to-b from-[#1b2230] via-[#111722] to-[#090c12] border border-[#D4AF37]/60 shadow-[0_8px_20px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] min-w-[56px] sm:min-w-[74px] text-center">
                <span className="font-cinzel text-xl sm:text-3xl font-black tracking-wider sf-text-gold">
                  {String(item.value).padStart(2, '0')}
                </span>
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#D4AF37]" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#D4AF37]" />
              </div>
              <span className="text-[10px] sm:text-xs font-rajdhani font-bold tracking-[0.2em] text-[#D4AF37]/90 uppercase mt-2">
                {item.label}
              </span>
            </div>
            {index < items.length - 1 && (
              <span className="font-cinzel text-xl sm:text-2xl text-[#D4AF37]/70 font-black pb-5 animate-pulse">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
