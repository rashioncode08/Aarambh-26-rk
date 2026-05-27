'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Unlock, Sparkles, Calendar, Ticket, Compass, Users, Radio } from 'lucide-react';
import Link from 'next/link';
import AboutSection from '@/components/about';

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  isSquare: boolean;
}

function TornPaperDivider({ color = "fill-brand-ink", flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] select-none pointer-events-none ${flip ? 'rotate-180' : ''}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-[40px] ${color}`}>
        <path d="M0,0 L30,40 L60,10 L95,50 L130,20 L165,60 L200,30 L240,70 L280,30 L320,80 L360,40 L400,90 L440,50 L480,95 L520,60 L560,100 L600,45 L640,110 L680,50 L720,95 L760,40 L800,90 L840,30 L880,80 L920,40 L960,105 L1000,55 L1040,90 L1080,35 L1120,70 L1160,20 L1200,80 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
}

const marqueeVariants: Variants = {
  animate: {
    x: [0, -1035],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

// Web Audio API Retro sound effects synthesizer
const playSynthSound = (type: 'boom' | 'pow' | 'bang' | 'stamp' | 'click') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'boom') {
      // Deep explosion rumble sliding down
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.65);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (type === 'pow') {
      // Punchy laser slide down
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'bang') {
      // Retro coin jump slide
      osc.type = 'square';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.setValueAtTime(580, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.4);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'stamp') {
      // Thumping press sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(15, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Subtle click bleep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    // Audio context may be blocked by browser policy until user click, which is normal
  }
};



export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [hasRegistered, setHasRegistered] = useState(false);
  const [activeSpectrum, setActiveSpectrum] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Function to create comic dot explosion particles
  const spawnParticles = (x: number, y: number) => {
    const colors = ['#FF9A00', '#FF188C', '#0D21DD', '#030404', '#F5F1E5'];
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random() + Date.now() + i,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 6,
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 70 + 30,
      isSquare: Math.random() > 0.5
    }));
    setParticles((prev) => [...prev, ...newParticles].slice(-40)); // Keep max 40 in DOM
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const regStatus = localStorage.getItem('aarambh_registered');
      if (regStatus === 'true') setHasRegistered(true);
    }

    const targetDate = new Date('2026-07-14T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    // Global listener for screen clicks to synthesis clicks and pop comic dots
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('a')) return;
      spawnParticles(e.clientX, e.clientY);
      playSynthSound('click');
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const stickers = [
    { text: "BOOM!", type: "boom", color: "bg-brand-pink text-brand-cloud", top: "12%", left: "6%", starburst: true, rotate: "-8deg" },
    { text: "POW!", type: "pow", color: "bg-brand-orange text-brand-ink font-extrabold", top: "15%", right: "8%", starburst: true, rotate: "6deg" },
    { text: "BANG!", type: "bang", color: "bg-brand-blue text-brand-cloud", bottom: "25%", left: "8%", starburst: true, rotate: "-12deg" },
    { text: "APPROVED", type: "stamp", subtext: "BY THE SQUAD", color: "bg-brand-cloud text-brand-pink border-4 border-dashed border-brand-pink", bottom: "22%", right: "8%", stamp: true, rotate: "15deg" },
  ];

  const countdownBlocks = [
    { label: 'Days', valueKey: 'days', bg: 'bg-brand-orange text-brand-ink', rotate: '-rotate-2' },
    { label: 'Hours', valueKey: 'hours', bg: 'bg-brand-pink text-brand-cloud', rotate: 'rotate-3' },
    { label: 'Mins', valueKey: 'mins', bg: 'bg-brand-blue text-brand-cloud', rotate: '-rotate-1' },
    { label: 'Secs', valueKey: 'secs', bg: 'bg-brand-cloud text-brand-ink', rotate: 'rotate-2' },
  ];

  const comicStoryPanels = [
    {
      title: "THE STAGE IS SET!",
      category: "CULTURE",
      color: "bg-brand-pink text-brand-cloud",
      icon: <Radio className="w-8 h-8" />,
      description: "GET READY FOR HIGH-ENERGY NIGHTS, LIVE BANDS, AND CULTURAL PERFORMANCES THAT WILL LEAVE YOU SPEECHLESS!",
    },
    {
      title: "CODE & CREATE!",
      category: "INNOVATION",
      color: "bg-brand-blue text-brand-cloud",
      icon: <Compass className="w-8 h-8" />,
      description: "COLLABORATE IN INTENSE DESIGN SPRINTS AND HACKATHONS TO BUILD PRODUCTS THAT PUSH BEYOND LIMITS!",
    },
    {
      title: "MEET THE SENIORS!",
      category: "COMMUNITY",
      color: "bg-brand-orange text-brand-ink",
      icon: <Users className="w-8 h-8" />,
      description: "CONNECT WITH MENTORS, DISCOVER INFLUENTIAL CLUBS, AND ESTABLISH YOUR CAMPUS ROADMAP!",
    },
    {
      title: "CAMPUS SCAVENGER HUNT!",
      category: "EXPLORE",
      color: "bg-brand-cloud text-brand-ink",
      icon: <Sparkles className="w-8 h-8 text-brand-pink" />,
      description: "DECRYPT CLUES, NAVIGATE ROOMS, AND DOMINATE THE LARGEST CAMPUS TREASURE HUNT!",
    }
  ];

  const spectrumPanels = [
    {
      id: 0,
      title: "ENERGY ORANGE",
      hex: "#FF9A00",
      accentBg: "bg-brand-orange text-brand-ink",
      colorClass: "bg-brand-orange",
      subtitle: "ENERGY. ENTHUSIASM. ACTION.",
      description: "Represents the fire inside, the excitement of new friendships, and the energy that powers Aarambh.",
      tag: "PANEL #1"
    },
    {
      id: 1,
      title: "BOLD PINK",
      hex: "#FF188C",
      accentBg: "bg-brand-pink text-brand-cloud",
      colorClass: "bg-brand-pink",
      subtitle: "BOLDNESS. CONFIDENCE. EXPRESSION.",
      description: "Reflects the courage to be yourself, speak your truth, and step outside conventions.",
      tag: "PANEL #2"
    },
    {
      id: 2,
      title: "ELECTRIC BLUE",
      hex: "#0D21DD",
      accentBg: "bg-brand-blue text-brand-cloud",
      colorClass: "bg-brand-blue",
      subtitle: "DEPTH. TRUST. LIMITLESS PATHS.",
      description: "Represents the infinite skies, deep intelligence, and the boundless path that lies ahead.",
      tag: "PANEL #3"
    }
  ];

  return (
    <main className="flex flex-col items-center overflow-x-hidden relative bg-brand-ink text-brand-cloud font-sans">
      {/* Noise/Grain Overlay */}
      <div className="noise-overlay" />

      {/* Particle Overlay for click explosions */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, scale: 1, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x - p.size / 2 + Math.cos(p.angle) * p.distance,
                y: p.y - p.size / 2 + Math.sin(p.angle) * p.distance,
                scale: 0.1,
                opacity: 0,
                rotate: 180
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.isSquare ? '0%' : '50%',
                border: '2px solid #030404',
                boxShadow: '1.5px 1.5px 0px #030404',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Comic Magazine Cover Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-28 px-4 overflow-hidden bg-brand-cloud text-brand-ink">

        {/* Comic Pattern Backdrop */}
        <div className="absolute inset-0 bg-halftone-black opacity-30 pointer-events-none" />

        {/* Abstract comic background shapes */}
        <div className="absolute top-12 left-12 w-64 h-64 bg-brand-pink/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-[450px] h-[450px] bg-brand-orange/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Draggable Pop-Art Stickers with synthesized audio triggers */}
        <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
          {stickers.map((sticker, idx) => (
            <motion.div
              key={idx}
              drag
              dragConstraints={{ left: -400, right: 400, top: -200, bottom: 200 }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
              whileHover={{ scale: 1.15, zIndex: 50, rotate: "0deg" }}
              whileDrag={{ scale: 1.2, zIndex: 100, cursor: "grabbing" }}
              onDragStart={(e) => {
                // Synthesizes retro sounds when dragging begins
                playSynthSound(sticker.type as any);
              }}
              onClick={(e) => {
                // Spawn click explosion right at stamp/sticker location
                spawnParticles(e.clientX, e.clientY);
                playSynthSound(sticker.type as any);
              }}
              style={{
                top: sticker.top,
                left: sticker.left,
                right: sticker.right,
                bottom: sticker.bottom,
                rotate: sticker.rotate,
              }}
              className="absolute pointer-events-auto cursor-grab select-none"
            >
              {sticker.starburst ? (
                <div className={`comic-starburst w-36 h-36 border-4 border-brand-ink flex flex-col items-center justify-center text-center p-4 shadow-comic ${sticker.color}`}>
                  <span className="font-display font-black text-xl leading-none uppercase tracking-tighter drop-shadow-md">
                    {sticker.text}
                  </span>
                </div>
              ) : sticker.stamp ? (
                <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-center p-3 rotate-12 shadow-comic-sm bg-brand-cloud ${sticker.color}`}>
                  <span className="font-display font-black text-xs leading-none uppercase tracking-tighter">
                    {sticker.text}
                  </span>
                  <span className="text-[7px] font-black uppercase mt-1 tracking-widest leading-none">
                    {sticker.subtext}
                  </span>
                </div>
              ) : (
                <div className={`px-5 py-3 font-display font-black text-sm uppercase rounded-md border-2 border-brand-ink ${sticker.color}`}>
                  {sticker.text}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Hero Content Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center max-w-4xl flex flex-col items-center px-4"
        >
          {/* Comic Magazine Header Band */}
          <div className="border-comic bg-brand-ink text-brand-cloud px-6 py-2.5 font-display text-xs font-black tracking-[0.25em] uppercase shadow-comic -rotate-1 mb-10 bg-halftone-cloud">
            JK LAKSHMIPAT UNIVERSITY PRESENTS • THE MEGA INDUCTION FEST
          </div>

          {/* Comic Styled Heading Stack */}
          <div className="relative mb-8 select-none p-3 max-w-full">
            {/* Outline back text */}
            <h1 className="font-display text-6xl sm:text-7xl md:text-[6.5rem] lg:text-[8rem] font-black uppercase leading-none tracking-tighter text-outline-pink select-none">
              BOLD & BEYOND
            </h1>            {/* Centered Primary Logo */}
            <div className="absolute inset-0 flex items-center justify-center p-2 mt-2 z-20 perspective-[1500px]">
              <div className="relative w-full max-w-xs sm:max-w-md md:max-w-xl group">
                {/* Base logo card with drop shadow */}
                <div className="relative z-10 w-full bg-brand-cloud border-comic rounded-xl p-4 sm:p-6 drop-shadow-[8px_8px_0px_#030404] flex items-center justify-center perspective-[1500px] transform-style-3d min-h-[140px] sm:min-h-[180px]">
                  
                  {/* Logo Container for Jigsaw SVG Assembly */}
                  <motion.div 
                     className="relative w-full aspect-[550/120] z-20 pointer-events-none"
                  >
                    {[0, 1, 2, 3, 4, 5].map((sliceIndex) => {
                      // Slice into 6 equal horizontal pieces
                      const leftPercent = sliceIndex * (100 / 6);
                      const rightPercent = 100 - ((sliceIndex + 1) * (100 / 6));
                      
                      const startConfigs = [
                        { x: -800, y: -400, rotate: -75 },
                        { x: 800, y: -300, rotate: 60 },
                        { x: -700, y: 500, rotate: -90 },
                        { x: 700, y: 400, rotate: 120 },
                        { x: -300, y: -700, rotate: -30 },
                        { x: 300, y: 600, rotate: 75 },
                      ];
                      const config = startConfigs[sliceIndex];
                      
                      return (
                        <motion.div
                          key={`slice-${sliceIndex}`}
                          initial={{ x: config.x, y: config.y, rotate: config.rotate, opacity: 0, scale: 1.5 }}
                          animate={{ 
                            x: [config.x, 0], 
                            y: [config.y, 0],
                            rotate: [config.rotate, 0],
                            opacity: [0, 1],
                            scale: [1.5, 1] 
                          }}
                          transition={{ 
                            delay: 0.5 + sliceIndex * 0.3, // Staggered entry from off-screen
                            duration: 1.2, 
                            type: "spring",
                            stiffness: 70,
                            damping: 12,
                          }}
                          className="absolute inset-0 w-full h-full"
                          style={{ 
                            clipPath: `inset(0% ${rightPercent}% 0% ${leftPercent}%)`,
                            WebkitClipPath: `inset(0% ${rightPercent}% 0% ${leftPercent}%)`
                          }}
                        >
                          <Image
                            src="/logo.svg"
                            alt="AARAMBH'26 Chunk"
                            fill
                            className="object-contain drop-shadow-sm"
                            priority
                            loading="eager"
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Final Cinematic Polish */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 1, 0] }}
                    transition={{ duration: 4.5, times: [0, 0.7, 0.8, 1] }}
                    className="absolute inset-0 bg-brand-pink blur-[40px] z-10 pointer-events-none mix-blend-screen"
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5] }}
                    transition={{ delay: 2.8, duration: 0.8 }}
                    className="absolute top-0 right-4 text-brand-orange z-30"
                  >
                    <Sparkles size={32} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Dialogue Box */}
          <div className="border-comic bg-brand-ink text-brand-cloud p-6 rounded-xl max-w-2xl shadow-comic rotate-1 bg-halftone-cloud mb-10">
            <p className="font-display font-black text-sm sm:text-base leading-relaxed tracking-wide uppercase">
              “SQUAD REPORT: A FRESH BEGINNING IS INITIATED! CLICK ANYWHERE TO UNLEASH HALFTONE PARTICLES AND SYNTH SOUNDS!”
            </p>
          </div>

          {/* Countdown Clock Panel */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-12 w-full max-w-md text-brand-cloud">
            {countdownBlocks.map((block) => (
              <div
                key={block.label}
                className={`p-3 sm:p-4 border-comic rounded-lg shadow-comic ${block.bg} ${block.rotate} transition-transform hover:scale-105`}
              >
                <div className="relative h-8 sm:h-10 overflow-hidden flex items-center justify-center w-full">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={timeLeft[block.valueKey as keyof TimeLeft]}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -24, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl sm:text-3xl font-display font-black tabular-nums absolute"
                    >
                      {String(timeLeft[block.valueKey as keyof TimeLeft]).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-6 z-20 relative">
            {!hasRegistered ? (
              <div className="relative">
                {/* Speech Bubble floating callout */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 comic-bubble px-4 py-2 font-display text-xs font-black uppercase whitespace-nowrap animate-bounce z-30">
                  ACTIVATE YOUR ACCESS PASS! ⚡
                </div>

                <Link href="/register">
                  <button className="comic-interactive border-comic shadow-comic py-3.5 px-8 font-display font-black text-sm uppercase tracking-wider text-brand-ink bg-brand-orange hover:bg-brand-pink hover:text-brand-cloud rounded-lg">
                    REGISTER NOW <ArrowRight className="inline shrink-0 ml-1.5" size={18} />
                  </button>
                </Link>
              </div>
            ) : (
              <div className="bg-brand-blue text-brand-cloud border-comic shadow-comic px-8 py-3.5 rounded-lg font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={20} className="text-brand-orange animate-bounce" /> ACCESS GRANTED!
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Torn paper visual separation */}
      <TornPaperDivider color="fill-brand-ink" />

      {/* Comic styled strip/marquee */}
      <section className="w-full py-4 border-y-4 border-brand-ink bg-brand-cloud text-brand-ink overflow-hidden z-10">
        <div className="w-full flex whitespace-nowrap overflow-hidden">
          <motion.div
            variants={marqueeVariants}
            animate="animate"
            className="flex gap-16 font-display font-black text-base sm:text-lg uppercase tracking-wider select-none"
          >
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-brand-pink">💥 AARAMBH &apos;26</span>
                <span className="text-brand-blue">🎓 JK LAKSHMIPAT UNIVERSITY</span>
                <span className="text-brand-orange">💥 AARAMBH &apos;26</span>
                <span className="text-brand-ink">🎓 JK LAKSHMIPAT UNIVERSITY</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Torn paper visual separation */}
      <TornPaperDivider color="fill-brand-ink" flip={true} />

      {/* Comic Book Panels Grid */}
      <section className="py-24 px-6 w-full max-w-7xl relative z-10 flex flex-col items-center">
        <span className="px-4 py-1.5 border-comic-thin bg-brand-pink text-brand-cloud font-display text-xs font-black tracking-widest uppercase rotate-2 mb-4">
          EVENT BRIEFINGS
        </span>
        <h2 className="text-center font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-cloud mb-4">
          WHAT&apos;S IN THE COMIC?
        </h2>
        <p className="text-center text-brand-cloud/60 max-w-xl mb-16 text-sm">
          A preview of the episodes scheduled across this multi-day campus induction program.
        </p>

        {/* 4 Comic Book Grid Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {comicStoryPanels.map((panel, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="border-comic bg-brand-cloud text-brand-ink p-8 rounded-xl shadow-comic bg-halftone-black flex flex-col sm:flex-row gap-6 items-start hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div className={`p-4 border-comic-thin rounded-lg shrink-0 ${panel.color} shadow-comic-sm`}>
                {panel.icon}
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-pink">
                  EPISODE #{idx + 1} • {panel.category}
                </span>
                <h3 className="font-display text-2xl font-black uppercase leading-none tracking-tight">
                  {panel.title}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-brand-ink/80 leading-relaxed uppercase">
                  {panel.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spectrum Panels (Comic Book Color Story) */}
      <section className="py-24 px-6 w-full max-w-7xl relative z-10 flex flex-col items-center">
        <span className="px-4 py-1.5 border-comic-thin bg-brand-orange text-brand-ink font-display text-xs font-black tracking-widest uppercase -rotate-2 mb-4">
          SPECTRUM STORY
        </span>
        <h2 className="text-center font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-cloud mb-4">
          THE SPECTRUM PANELS
        </h2>
        <p className="text-center text-brand-cloud/60 max-w-xl mb-16 text-sm">
          Hover over each comic panel block to trigger halftone coloring and reveal the narrative behind the colors.
        </p>

        {/* 3 Comic Column grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {spectrumPanels.map((panel) => {
            const isHovered = activeSpectrum === panel.id;
            return (
              <div
                key={panel.id}
                onMouseEnter={() => setActiveSpectrum(panel.id)}
                onMouseLeave={() => setActiveSpectrum(null)}
                className={`relative flex flex-col justify-between p-8 border-comic bg-brand-cloud text-brand-ink rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shadow-comic ${isHovered ? 'scale-105 bg-brand-cloud' : 'hover:scale-[1.02]'
                  }`}
                style={{
                  transform: isHovered ? 'translate(-4px, -4px)' : 'none',
                  boxShadow: isHovered ? '12px 12px 0px 0px var(--color-brand-ink)' : '8px 8px 0px 0px var(--color-brand-ink)'
                }}
              >
                {/* Halftone backing (activates on hover) */}
                <div
                  className={`absolute inset-0 bg-halftone-black opacity-10 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-25' : 'opacity-0'
                    }`}
                />

                {/* Panel tag */}
                <div className="flex justify-between items-center z-10">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 border-comic-thin rounded ${panel.accentBg}`}>
                    {panel.tag}
                  </span>
                  <span className="text-[10px] font-mono text-brand-ink/40 uppercase tracking-widest">
                    {panel.hex}
                  </span>
                </div>

                {/* Comic illustration area (Stark block color representer) */}
                <div className="my-8 h-28 border-comic bg-brand-ink flex items-center justify-center overflow-hidden relative rounded-lg">
                  <div className={`absolute inset-0 ${panel.colorClass} opacity-80`} />
                  <div className="absolute inset-0 bg-halftone-cloud opacity-35" />
                  <span className="relative z-10 font-display font-black text-2xl text-brand-cloud uppercase tracking-tighter text-outline-ink drop-shadow-md">
                    {panel.title.split(' ')[0]}
                  </span>
                </div>

                {/* Content */}
                <div className="z-10 space-y-3">
                  <h3 className="font-display text-2xl font-black uppercase leading-none tracking-tight">
                    {panel.title}
                  </h3>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-pink">
                      {panel.subtitle}
                    </h4>
                    <p className="text-xs text-brand-ink/80 leading-relaxed font-bold">
                      {panel.description}
                    </p>
                  </div>
                </div>

                {/* Expand indicator */}
                <div className="mt-8 flex items-center justify-between z-10">
                  <div className="flex gap-1">
                    <div className="w-3.5 h-3.5 rounded-full border-comic-thin bg-brand-orange" />
                    <div className="w-3.5 h-3.5 rounded-full border-comic-thin bg-brand-pink" />
                    <div className="w-3.5 h-3.5 rounded-full border-comic-thin bg-brand-blue" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black uppercase">
                    READ PANEL <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section wrapper */}
      <section className="w-full z-10 bg-brand-ink">
        <AboutSection />
      </section>

      {/* Exclusive student gateway panels */}
      <section className="py-24 px-6 w-full max-w-7xl relative z-10 flex flex-col items-center">
        <span className="px-4 py-1.5 border-comic-thin bg-brand-blue text-brand-cloud font-display text-xs font-black tracking-widest uppercase -rotate-2 mb-4">
          PORTAL PASS
        </span>
        <h2 className="text-center font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-cloud mb-4">
          THE STUDENT GATEWAY
        </h2>
        <p className="text-center text-brand-cloud/60 max-w-xl mb-16 text-sm">
          Unlock your schedules and cohorts. Join your assigned teams once registration validation completes.
        </p>

        {!hasRegistered ? (
          <div className="w-full max-w-4xl border-comic bg-brand-cloud text-brand-ink p-12 text-center flex flex-col items-center rounded-xl shadow-comic bg-halftone-black relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[10px] font-mono font-black text-brand-ink/50 bg-brand-pink/15 px-2 py-0.5 border-comic-thin rounded">
              SYSTEM: CRYPTO-LOCKED
            </div>

            {/* Padlock icon in a comic badge */}
            <div className="relative p-6 mb-6 bg-brand-pink border-comic shadow-comic-sm rounded-lg text-brand-cloud animate-pulse rotate-3">
              <Lock size={40} />
            </div>

            <h3 className="text-2xl font-display font-black mb-2 uppercase tracking-wide">GATEWAY LOCKED</h3>
            <p className="text-brand-ink/75 max-w-md text-xs sm:text-sm mb-8 leading-relaxed font-bold">
              KAPOW! THIS AREA IS RESTRICTED. COMPLETE YOUR REGISTRATION ENROLLMENT TO ACTIVATE YOUR ACCESS KEYS.
            </p>

            <Link href="/register">
              <button className="comic-interactive border-comic shadow-comic px-8 py-3.5 bg-brand-pink text-brand-cloud font-display font-black text-xs uppercase tracking-wider rounded-lg">
                ACTIVATE ACCOUNT KEYS
              </button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
          >
            {/* Comic panel 1 */}
            <div className="p-8 border-comic bg-brand-cloud text-brand-ink rounded-xl shadow-comic hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-brand-blue text-brand-cloud px-3 py-1 border-comic-thin rounded">
                    SQUAD CHAT
                  </span>
                  <Unlock className="text-brand-blue" size={18} />
                </div>
                <h3 className="text-2xl font-display font-black mb-3 uppercase tracking-tight">
                  Join Peer Cohort
                </h3>
                <p className="text-brand-ink/70 text-xs sm:text-sm leading-relaxed font-bold mb-6">
                  Connect with your assignees in the official Aarambh chat server. Network with seniors and organize squad taskboards!
                </p>
              </div>
              <button className="w-full py-3.5 bg-brand-blue border-comic shadow-comic-sm text-brand-cloud font-display font-black text-xs uppercase tracking-widest rounded-lg comic-interactive">
                JOIN DISCORD SQUAD
              </button>
            </div>

            {/* Comic panel 2 */}
            <div className="p-8 border-comic bg-brand-cloud text-brand-ink rounded-xl shadow-comic hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-brand-orange text-brand-ink px-3 py-1 border-comic-thin rounded">
                    ITINERARY
                  </span>
                  <Unlock className="text-brand-orange" size={18} />
                </div>
                <h3 className="text-2xl font-display font-black mb-3 uppercase tracking-tight">
                  TIMETABLE FLOW
                </h3>
                <p className="text-brand-ink/70 text-xs sm:text-sm leading-relaxed font-bold mb-6">
                  View scheduled lecture rooms, project workshop assignments, and cultural evening timelines.
                </p>
              </div>
              <Link href="/schedule">
                <button className="w-full py-3.5 bg-brand-orange border-comic shadow-comic-sm text-brand-ink font-display font-black text-xs uppercase tracking-widest rounded-lg comic-interactive">
                  LAUNCH SCHEDULE SHEET
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      {/* Comic Book Ad Banner Style Newsletter */}
      <section className="py-24 px-6 w-full max-w-5xl pb-32 relative z-10">
        <div className="border-comic bg-brand-orange text-brand-ink shadow-comic-lg bg-halftone-black p-8 sm:p-12 md:p-16 rounded-xl text-center relative overflow-hidden">
          {/* Action starburst backing design */}
          <div className="absolute top-2 left-2 w-16 h-16 border-comic-thin bg-brand-pink text-brand-cloud font-display font-black text-[10px] uppercase tracking-tighter flex items-center justify-center rotate-[-12deg] shadow-comic-sm">
            NEWS!
          </div>

          <span className="relative z-10 px-3 py-1 bg-brand-ink text-brand-cloud font-display text-[10px] font-black uppercase tracking-widest">
            AARAMBH DISPATCH
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase mb-4 tracking-tight mt-6">
            SUBSCRIBE & STAY TUNED!
          </h2>
          <p className="text-brand-ink/80 text-xs sm:text-sm mb-10 max-w-md mx-auto leading-relaxed font-bold uppercase">
            GET THE OFFICIAL BROADCASTS DELIVERED TO YOUR INBOX. ANNOUNCEMENTS, KEYNOTE SCHEDULES, AND VENUE ASSIGNMENTS!
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <input
              type="email"
              placeholder="ENTER.YOUR.EMAIL@HERE.COM"
              className="bg-brand-cloud border-comic text-brand-ink placeholder:text-brand-ink/40 font-mono text-sm font-bold focus:outline-none focus:bg-white transition-colors flex-grow shadow-inner uppercase tracking-wider p-3 rounded-lg"
              required
            />
            <button
              type="submit"
              className="py-3.5 px-8 bg-brand-ink text-brand-cloud font-display font-black text-xs uppercase tracking-widest rounded-lg comic-interactive border-2 border-brand-cloud shadow-comic-sm"
            >
              SUBSCRIBE NOW
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
