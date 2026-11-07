import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ChevronLeft, Image } from 'lucide-react';
import { GalleryItem } from '../types';
import { useSiteContent } from '../context/ContentContext';
import SkeletonImage from './SkeletonImage';

interface GalleryPageProps {
  onBack: () => void;
}

export default function GalleryPage({ onBack }: GalleryPageProps) {
  const { content } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['ALL', 'EVENT', 'TEAMS', 'PROJECTS', 'WORKSHOPS', 'WINNERS'];

  const galleryItems: GalleryItem[] = Array.isArray(content?.gallery) ? (content.gallery as any) : [];

  const filteredItems =
    selectedCategory === 'ALL'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] overflow-x-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#FFAA00]/6 blur-[160px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#55FF55]/4 blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <button
            id="gallery-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#F5D061] font-rajdhani font-bold text-xs tracking-[0.2em] uppercase mb-8 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO MAIN ARENA
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 border border-[#FFAA00]/50 sf-clip-angled-sm flex items-center justify-center bg-[#FFAA00]/10">
              <Camera className="w-5 h-5 text-[#FFDF78]" />
            </div>
            <p className="font-rajdhani text-[#FFAA00] text-xs tracking-[0.3em] uppercase font-bold">
              SYNTHARA2.0 // EVENT CHRONICLES
            </p>
          </div>

          <h1 className="sf-gothic-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl sf-text-gold mb-4">
            Gallery
          </h1>
          <p className="font-rajdhani text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Moments from past hackathon sprints, late-night debugging sessions, and winning podium ceremonies. Every pixel tells a story.
          </p>

          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { label: 'ARCHIVES', value: String(galleryItems.length) },
              { label: 'CATEGORIES', value: String(categories.length - 1) },
              { label: 'EDITIONS', value: '04' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="sf-gothic-title text-2xl sm:text-3xl text-[#F5D061]">{stat.value}</span>
                <span className="font-rajdhani text-[10px] text-neutral-500 tracking-[0.2em] uppercase font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-10" />

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap gap-2.5 mb-10 select-none"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              id={`gallery-filter-${cat.toLowerCase()}-btn`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-[3px] ${
                selectedCategory === cat
                  ? 'bg-[#5B8731] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]'
                  : 'bg-[#2B2B2B] text-neutral-300 hover:text-white border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] shadow-[2px_2px_0px_#000]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-neutral-500">
            <Image className="w-12 h-12 opacity-30" />
            <p className="font-rajdhani text-sm uppercase tracking-widest">No archives in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                onClick={() => setLightboxItem(item)}
                className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-3 shadow-[4px_4px_0px_#000] cursor-pointer hover:-translate-y-1 transition-transform group"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-black border-2 border-black">
                  <SkeletonImage
                    src={item.image}
                    alt={item.title}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 z-20 bg-[#FFAA00] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]">
                    {item.category}
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-mono font-bold text-sm text-white uppercase group-hover:text-[#55FF55] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-neutral-300 mt-1 line-clamp-2">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 bg-black/92"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative max-w-3xl w-full bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] z-10"
            >
              <div className="bg-[#2A2A2A] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#555555]">
                <span className="font-mono text-xs font-bold uppercase">{lightboxItem.title}</span>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="w-6 h-6 bg-[#DBDBDB] text-black font-black flex items-center justify-center border border-black cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                <SkeletonImage
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full max-h-[65vh] object-cover border-2 border-black"
                  containerClassName="w-full max-h-[65vh] min-h-[240px]"
                />
                <p className="font-mono text-xs text-neutral-900 mt-2.5 font-medium">{lightboxItem.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
