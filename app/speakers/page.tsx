'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Share2, Plus, X, Hand } from 'lucide-react';

const THEMES = [
  { primary: '#FF188C', highlight: '#FF9A00', dark: '#030404' }, // Pink
  { primary: '#0D21DD', highlight: '#FF188C', dark: '#030404' }, // Blue
  { primary: '#FF9A00', highlight: '#0D21DD', dark: '#030404' }, // Orange
];

const SPEAKERS_DATA = [
  { 
    name: 'Dr. Elena Vance', role: 'AI Research Lead', time: '01:30 PM - AUDI 1',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    bio: "Pioneering the intersection of artificial intelligence and human cognition. Dr. Vance focuses on ethical AI deployment and neural network optimization. Her session breaks down complex machine learning models into simple, actionable insights.",
    expertise: ['Neural Networks', 'Ethical AI', 'Automation']
  },
  { 
    name: 'Marcus Wright', role: 'Founder, Nexus VC', time: '11:00 AM - MAIN STAGE',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop',
    bio: "Marcus is a visionary investor who turns high-stakes risk into high-reward reality. Having seeded three unicorns in the last decade, he's here to talk about what it takes to survive and scale in an unpredictable market.",
    expertise: ['Venture Capital', 'Scaling', 'Risk Management']
  },
  { 
    name: 'Sarah Chen', role: 'Web3 Architect', time: '04:00 PM - AUDI 2',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop',
    bio: "Building the decentralized web from the ground up. Sarah has architected smart contract systems for global finance and is here to demystify crypto. She strips away the jargon to show you exactly how the next internet is built.",
    expertise: ['Blockchain', 'Smart Contracts', 'Cryptography']
  },
];

export default function SpeakersSection() {
  const [introFinished, setIntroFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Intro Sequence Timer
  useEffect(() => {
    const timer = setTimeout(() => setIntroFinished(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SPEAKERS_DATA.length);
  };

  const speaker = SPEAKERS_DATA[currentIndex];
  const theme = THEMES[currentIndex % THEMES.length];

  return (
    <div className="relative w-full min-h-screen bg-[#F5F1E5] overflow-hidden font-sans selection:bg-[#030404] selection:text-[#F5F1E5]"
         style={{ backgroundImage: 'radial-gradient(#030404 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      
      {/* 1. THE CINEMATIC INTRO */}
      <AnimatePresence>
        {!introFinished && (
          <motion.div 
            className="fixed inset-0 z-[99999] bg-[#030404] flex items-center justify-center"
            exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1.1, 1.2], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] }}
                transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
                className="text-5xl md:text-8xl font-black text-[#F5F1E5] uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                Fearless.
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1.1, 1.2], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] }}
                transition={{ duration: 0.8, delay: 0.8, times: [0, 0.3, 0.7, 1] }}
                className="text-5xl md:text-8xl font-black text-[#FF188C] uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                Unconventional.
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.2], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] }}
                transition={{ duration: 1.2, delay: 1.6, times: [0, 0.2, 0.8, 1] }}
                className="text-5xl md:text-8xl font-black text-[#FF9A00] uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                Meet The Minds.
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT */}
      {introFinished && (
        // Added pt-32 so it clears your original global navbar
        <div className="w-full h-screen px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 pt-32 pb-10">
          
          {/* LEFT: Typography & Instructions */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center z-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                <div 
                  className="inline-block px-6 py-2 border-[4px] border-[#030404] text-sm uppercase tracking-widest font-black mb-6 shadow-[6px_6px_0px_rgba(3,4,4,1)]"
                  style={{ backgroundColor: theme.primary, color: '#F5F1E5' }}
                >
                  {speaker.role}
                </div>
                <h2 
                  className="text-7xl md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] text-[#030404] mb-8"
                  style={{ textShadow: `6px 6px 0px ${theme.highlight}` }}
                >
                  {speaker.name.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Brutalist Navigation Hint (Replaces Arrows) */}
            <div className="mt-8 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#030404] rounded-full flex items-center justify-center animate-bounce shadow-[4px_4px_0px_rgba(255,24,140,1)] border-[3px] border-[#FF188C]">
                <Hand size={28} className="text-[#F5F1E5]" />
              </div>
              <div>
                <p className="text-[#030404] font-black uppercase tracking-widest text-lg leading-none">Grab & Throw</p>
                <p className="text-[#030404]/60 font-bold uppercase tracking-widest text-[10px] mt-1">To view next speaker</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Draggable Card Engine */}
          <div className="w-full lg:w-1/2 h-full flex justify-center lg:justify-end items-center relative perspective-[2000px]">
            {/* We render the "Next" card statically behind the current one so it's revealed when thrown */}
            <div className="absolute w-full max-w-[420px] aspect-[3/4] opacity-40 scale-95 pointer-events-none">
               <div className="w-full h-full border-[8px] border-[#030404] bg-[#030404]">
                  <img src={SPEAKERS_DATA[(currentIndex + 1) % SPEAKERS_DATA.length].image} className="w-full h-full object-cover grayscale" alt="next" />
               </div>
            </div>

            <AnimatePresence mode="popLayout">
              <DraggableDossierCard 
                key={speaker.name} 
                speaker={speaker} 
                theme={theme} 
                onThrow={handleNext} 
              />
            </AnimatePresence>
          </div>

        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DRAGGABLE DOSSIER CARD COMPONENT
// ---------------------------------------------------------------------------
function DraggableDossierCard({ speaker, theme, onThrow }: { speaker: any, theme: any, onThrow: () => void }) {
  const [showBio, setShowBio] = useState(false);
  const controls = useAnimation();

  // Handles the physics of throwing the card
  const handleDragEnd = async (e: any, info: any) => {
    const swipeThreshold = 100; // How far they have to drag to trigger it
    if (info.offset.x > swipeThreshold || info.offset.x < -swipeThreshold) {
      // Throw the card completely off screen
      await controls.start({ x: info.offset.x * 5, y: info.offset.y * 5, rotate: info.offset.x * 0.1, opacity: 0, transition: { duration: 0.4 } });
      onThrow();
    } else {
      // Snap back to center if they didn't drag far enough
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div 
      drag={!showBio} // Can only drag if bio is closed
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative w-full max-w-[420px] aspect-[3/4] cursor-grab active:cursor-grabbing group z-20"
    >
      
      {/* FRONT PHOTO BASE */}
      <div className="absolute inset-0 w-full h-full shadow-[25px_25px_0px_rgba(3,4,4,1)] border-[8px] md:border-[12px] border-[#030404] bg-[#030404] overflow-hidden">
        <img 
          src={speaker.image} 
          alt={speaker.name}
          className="w-full h-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 pointer-events-none"
        />
        
        {/* Grain */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Floating Open Bio Button */}
        <button 
          onClick={() => setShowBio(true)}
          className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-[6px_6px_0px_rgba(3,4,4,1)] border-[4px] border-[#030404] hover:scale-110 transition-transform duration-300 z-30 cursor-pointer"
          style={{ backgroundColor: theme.highlight }}
        >
          <Plus size={32} className="text-[#030404] mb-1" />
          <span className="text-[#030404] font-black uppercase text-[10px] tracking-widest leading-none">View<br/>Bio</span>
        </button>
      </div>

      {/* THE "INK SPILL" BIO REVEAL */}
      <motion.div 
        initial={{ clipPath: 'circle(0% at 10% 90%)' }}
        animate={{ clipPath: showBio ? 'circle(150% at 10% 90%)' : 'circle(0% at 10% 90%)' }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 w-full h-full shadow-[25px_25px_0px_rgba(3,4,4,1)] border-[8px] md:border-[12px] border-[#030404] bg-[#030404] overflow-hidden p-8 flex flex-col justify-between z-40 cursor-default"
      >
        <div className="absolute inset-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <img src={speaker.image} className="w-full h-full object-cover grayscale blur-[2px]" alt="watermark" />
          <div className="absolute inset-0 bg-[#030404]/80" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b-[3px] border-[#F5F1E5]/20 pb-6">
            <div>
              <h3 className="font-black text-3xl uppercase tracking-tighter text-[#F5F1E5] leading-none mb-2">
                Dossier:<br/>{speaker.name.split(' ')[0]}
              </h3>
              <p className="text-[#F5F1E5]/70 font-bold text-xs uppercase tracking-widest">{speaker.time}</p>
            </div>
            <div className="w-12 h-12 bg-[#F5F1E5] flex items-center justify-center border-[3px] border-[#030404] shadow-[4px_4px_0px_rgba(245,241,229,0.3)]">
              <Share2 size={20} className="text-[#030404]" />
            </div>
          </div>

          <p className="text-[#F5F1E5] font-medium text-sm md:text-base leading-relaxed mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {speaker.bio}
          </p>

          <div className="mt-auto">
            <p className="text-[#F5F1E5]/50 text-xs font-black uppercase tracking-widest mb-3">Core Focus</p>
            <div className="flex flex-wrap gap-2">
              {speaker.expertise.map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-[#F5F1E5]/10 border border-[#F5F1E5]/30 text-[#F5F1E5] text-[10px] font-bold uppercase tracking-wider">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowBio(false)}
          className="relative z-10 mt-6 w-full py-4 bg-[#F5F1E5] text-[#030404] font-black uppercase tracking-widest text-sm border-[3px] border-[#030404] shadow-[4px_4px_0px_rgba(245,241,229,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_rgba(245,241,229,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <X size={20} /> Close File
        </button>
      </motion.div>

    </motion.div>
  );
}