import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

export default function Timeline() {
  const { content } = useSiteContent();
  const [selectedDay, setSelectedDay] = useState<'ALL' | 'DAY 01' | 'DAY 02' | 'DAY 03'>('ALL');

  // Strictly display timeline events from Supabase database
  const allEvents = (content.timeline && Array.isArray(content.timeline))
    ? content.timeline.map((evt, idx) => ({
        id: evt.id || `evt-${idx}`,
        day: evt.day,
        time: evt.time,
        title: evt.title,
        description: evt.description,
        milestone: Boolean(evt.milestone),
      }))
    : [];

  const filteredEvents = selectedDay === 'ALL'
    ? allEvents
    : allEvents.filter((e) => e.day === selectedDay);

  return (
    <section
      id="timeline"
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
    >

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Clock className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>CHRONOLOGY // HACKATHON PROTOCOL</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              EVENT <span className="text-[#55FF55]">TIMELINE</span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed [text-shadow:_1px_1px_0_#000]">
            From opening briefing and mentor checkpoint syncs to the final code freeze, live pitches, and victory awards ceremony.
          </p>
        </div>

        {/* Day Filter Pills (Minecraft/Retro Style) */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {(['ALL', 'DAY 01', 'DAY 02', 'DAY 03'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-3 ${
                selectedDay === day
                  ? 'bg-[#5B8731] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]'
                  : 'bg-[#2B2B2B] text-neutral-300 hover:text-white border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] shadow-[2px_2px_0px_#000]'
              }`}
            >
              {day === 'ALL' ? 'COMPLETE SPRINT (48H)' : day}
            </button>
          ))}
        </div>

        {/* HackVerse Timeline List */}
        <div className="space-y-4">
          {filteredEvents.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-4 sm:p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#383838] pb-2 mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#FFAA00] text-black font-mono font-black text-[11px] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                    {evt.day}
                  </span>
                  <span className="bg-[#101010] text-[#55FF55] font-mono font-bold text-xs px-2.5 py-0.5 border border-black">
                    {evt.time}
                  </span>
                </div>

                {evt.milestone && (
                  <span className="inline-flex items-center gap-1 bg-[#8F5500] text-[#FFE285] font-mono font-bold text-[10px] uppercase px-2 py-0.5 border border-black">
                    <Sparkles className="w-3 h-3 text-[#FFE285]" />
                    KEY MILESTONE
                  </span>
                )}
              </div>

              <h3 className="font-mono font-black text-base sm:text-lg text-white uppercase [text-shadow:_1px_1px_0_#000]">
                {evt.title}
              </h3>
              <p className="font-mono text-xs text-neutral-300 mt-1 leading-relaxed">
                {evt.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
