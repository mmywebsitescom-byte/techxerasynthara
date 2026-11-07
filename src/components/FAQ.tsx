import { useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

export default function FAQ() {
  const { content } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Strictly display FAQ from Supabase database
  const rawItems = (content?.faq && Array.isArray(content.faq)) ? content.faq : [];

  const categories = ['ALL', ...Array.from(new Set(rawItems.map((item: any) => item.category || 'General')))];

  const filteredItems = selectedCategory === 'ALL'
    ? rawItems
    : rawItems.filter((item: any) => item.category === selectedCategory);

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
            <HelpCircle className="w-3.5 h-3.5 text-[#55FF55]" />
            <span>KNOWLEDGE BASE // RULES & FAQS</span>
          </div>
          <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
            FREQUENTLY ASKED <span className="text-[#55FF55]">QUESTIONS</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto tracking-wider uppercase mt-2 [text-shadow:_1px_1px_0_#000]">
            Squad formation constraints, offline venue access, submission deadlines, and evaluation rules.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 select-none">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-3 ${
                selectedCategory === cat
                  ? 'bg-[#5B8731] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]'
                  : 'bg-[#2B2B2B] text-neutral-300 hover:text-white border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] shadow-[2px_2px_0px_#000]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Retro HackVerse Accordion */}
        <div className="space-y-3">
          {filteredItems.map((item: any, idx: number) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={item.id || idx}
                className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] shadow-[4px_4px_0px_#000] transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="bg-[#FFAA00] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[1px_1px_0_#000] shrink-0">
                      {item.category || "General"}
                    </span>
                    <span className="font-mono font-bold text-sm sm:text-base text-white [text-shadow:_1px_1px_0_#000]">
                      {item.question}
                    </span>
                  </div>

                  {/* Retro Square Toggle Button */}
                  <div className="w-7 h-7 bg-[#DBDBDB] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] text-black flex items-center justify-center shrink-0 font-mono font-black text-sm">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t-2 border-[#383838]">
                    <p className="font-mono text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
