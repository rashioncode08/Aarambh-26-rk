'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Unlock, Sparkles, Calendar, Ticket, Compass, Users, Radio, Play } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [hasRegistered, setHasRegistered] = useState(false);
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


  const countdownBlocks = [
    { label: 'Days', valueKey: 'days', bg: 'bg-brand-orange text-brand-ink', rotate: '-rotate-2' },
    { label: 'Hours', valueKey: 'hours', bg: 'bg-brand-pink text-brand-cloud', rotate: 'rotate-3' },
    { label: 'Mins', valueKey: 'mins', bg: 'bg-brand-blue text-brand-cloud', rotate: '-rotate-1' },
    { label: 'Secs', valueKey: 'secs', bg: 'bg-brand-cloud text-brand-ink', rotate: 'rotate-2' },
  ];



  return (
    <main className="flex flex-col items-center overflow-x-hidden relative bg-brand-ink text-brand-cloud font-sans">
      {/* Noise/Grain Overlay */}
      <div className="noise-overlay" />

      {/* Full Screen Intro Overlay (Resolves Autoplay Policy) - Removed as per user request */}



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
      {/* Cyberpunk Hero (Light Theme) */}
      <section className="relative w-full min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-brand-cloud text-brand-ink font-mono">
        
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none z-50" />
        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(245,241,229,0)_50%,rgba(3,4,4,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] opacity-30" />

        {/* Scrolling Hex Data Columns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.04] text-brand-ink text-xs font-mono font-black flex justify-between px-10 md:px-20">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`hex-${i}`}
              animate={{ y: [0, -1000] }}
              transition={{ duration: 30 + (i % 5) * 10, repeat: Infinity, ease: 'linear' }}
              className="flex flex-col gap-2 tracking-widest whitespace-pre"
            >
              {Array.from({ length: 100 }).map((_, j) => (
                <div key={j}>{Math.random().toString(16).substring(2, 6).toUpperCase()}</div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Rotating Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.07] overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[150vw] sm:w-[90vw] aspect-square border-[2px] border-dashed border-brand-ink rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[120vw] sm:w-[70vw] aspect-square border-[4px] border-dotted border-brand-ink rounded-full"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[200vw] sm:w-[110vw] aspect-square border-[1px] border-brand-ink rounded-full flex items-center justify-center"
          >
             <div className="w-[105%] h-[1px] bg-brand-ink absolute" />
             <div className="h-[105%] w-[1px] bg-brand-ink absolute" />
          </motion.div>
        </div>

        {/* Cyberpunk Vertical Text */}
        <div className="absolute left-4 md:left-10 top-1/4 flex flex-col items-center gap-6 text-brand-ink/10 font-black text-2xl md:text-4xl z-0 pointer-events-none mix-blend-multiply">
          <span style={{ writingMode: 'vertical-rl' }} className="rotate-180 tracking-[0.5em] text-sm md:text-lg">SYS_LINK</span>
          <span>始</span>
          <span>動</span>
        </div>
        <div className="absolute right-4 md:right-10 top-1/3 flex flex-col items-center gap-6 text-brand-ink/10 font-black text-2xl md:text-4xl z-0 pointer-events-none mix-blend-multiply">
          <span style={{ writingMode: 'vertical-rl' }} className="tracking-[0.5em] text-sm md:text-lg">NET_SYNC</span>
          <span>接</span>
          <span>続</span>
        </div>

        {/* 3D Cyber Grid Floor */}
        <div className="absolute inset-0 perspective-[1000px] overflow-hidden pointer-events-none z-0 flex justify-center">
          <motion.div 
            animate={{ backgroundPosition: ['0px 0px', '0px 100px'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[-20%] w-[300vw] h-[100vh] origin-bottom"
            style={{
              backgroundImage: 'linear-gradient(transparent 95%, rgba(13, 33, 221, 0.15) 100%), linear-gradient(90deg, transparent 95%, rgba(13, 33, 221, 0.15) 100%)',
              backgroundSize: '100px 100px',
              transform: 'rotateX(75deg)',
            }}
          />
          {/* Horizon Glow */}
          <div className="absolute bottom-[40%] w-full h-[60%] bg-gradient-to-t from-white to-transparent blur-2xl z-10" />
        </div>

        {/* HUD UI Elements (Corner brackets) */}
        <div className="hidden md:block absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-brand-ink/20 z-20 pointer-events-none" />
        <div className="hidden md:block absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-brand-ink/20 z-20 pointer-events-none" />
        <div className="hidden md:block absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-brand-ink/20 z-20 pointer-events-none" />
        <div className="hidden md:block absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-brand-ink/20 z-20 pointer-events-none" />

        {/* Floating System Status */}
        <div className="absolute top-10 right-10 md:right-14 flex flex-col items-end z-20 pointer-events-none text-brand-ink/60 text-[10px] md:text-xs">
           <div className="flex items-center gap-2 mb-1">
             <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
             SYSTEM ONLINE
           </div>
           <div>SYS.MEM: OK</div>
           <div>UPLINK: SECURE</div>
        </div>

        <div className="relative z-20 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-12">
          
          {/* Holographic Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-md md:max-w-xl aspect-[4/1] mb-16 flex justify-center items-center"
          >
            {/* Ambient Glows */}
            <div className="absolute inset-0 bg-brand-pink/20 blur-[60px] rounded-full scale-110 mix-blend-multiply animate-pulse" />
            <div className="absolute inset-0 bg-brand-blue/20 blur-[80px] rounded-full scale-125 mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative w-full h-full z-10 flex justify-center items-center">
              <Image 
                src="/logo.svg" 
                alt="Aarambh '26 Hologram" 
                fill 
                className="object-contain filter drop-shadow-[0_0_15px_rgba(255,24,140,0.2)]"
                priority
              />
              {/* Glitch Layer Red */}
              <motion.div
                animate={{ x: [-2, 2, -1, 3, 0], opacity: [0, 0.5, 0.2, 0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", repeatDelay: Math.random() * 2 }}
                className="absolute inset-0 mix-blend-multiply z-20"
              >
                <Image src="/logo.svg" alt="" fill className="object-contain filter hue-rotate-[180deg] opacity-60" />
              </motion.div>
              {/* Glitch Layer Blue */}
              <motion.div
                animate={{ x: [2, -2, 1, -3, 0], opacity: [0, 0.4, 0.1, 0.6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror", repeatDelay: Math.random() * 3 }}
                className="absolute inset-0 mix-blend-multiply z-20"
              >
                <Image src="/logo.svg" alt="" fill className="object-contain filter hue-rotate-[90deg] opacity-60" />
              </motion.div>
            </div>
          </motion.div>

          {/* Cyberpunk HUD Timer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center border border-brand-ink/10 bg-white/50 backdrop-blur-md p-6 shadow-[0_0_30px_rgba(3,4,4,0.05)] mb-12 relative overflow-hidden"
          >
            {/* Scanning line animation inside timer */}
            <motion.div 
               animate={{ top: ['-10%', '110%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
               className="absolute left-0 right-0 h-[2px] bg-brand-ink/20 z-0" 
            />

            <div className="text-brand-ink/60 text-xs md:text-sm tracking-[0.3em] mb-4 relative z-10 flex items-center gap-3 font-bold">
              <span className="hidden sm:block w-3 h-[1px] bg-brand-ink/30" />
              COUNTDOWN INITIATED
              <span className="hidden sm:block w-3 h-[1px] bg-brand-ink/30" />
            </div>
            
            <div className="flex items-baseline gap-4 md:gap-8 text-brand-ink relative z-10">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-black tabular-nums">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-brand-ink/50 tracking-widest mt-1">DAY</span>
              </div>
              <span className="text-3xl text-brand-ink/30 pb-4">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-black tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-brand-ink/50 tracking-widest mt-1">HR</span>
              </div>
              <span className="text-3xl text-brand-ink/30 pb-4">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-black tabular-nums">
                  {String(timeLeft.mins).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-brand-ink/50 tracking-widest mt-1">MIN</span>
              </div>
              <span className="text-3xl text-brand-ink/30 pb-4 hidden sm:block">:</span>
              <div className="flex flex-col items-center hidden sm:flex">
                <span className="text-4xl md:text-6xl font-black text-brand-pink tabular-nums">
                  {String(timeLeft.secs).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-brand-pink tracking-widest mt-1">SEC</span>
              </div>
            </div>
          </motion.div>

          {/* Terminal Brief */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-full max-w-xl text-left border-l-2 border-brand-pink pl-6 py-2 relative"
          >
            <p className="text-brand-ink/80 text-sm md:text-base leading-relaxed font-mono">
              <span className="text-brand-pink font-bold">{"> "}</span>
              DECRYPTING PROTOCOL... <br/>
              <span className="text-brand-pink font-bold">{"> "}</span>
              Where strangers become allies. Dreams map to vectors. <br/>
              <span className="text-brand-pink font-bold">{"> "}</span>
              The ultimate adventure awaits. Enter the gateway.
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-2 h-4 bg-brand-ink ml-2 align-middle"
              />
            </p>
          </motion.div>
          
          {/* Cyber CTA */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 1 }}
             className="mt-12 z-20"
          >
            {!hasRegistered ? (
              <Link href="/register">
                <button className="relative px-12 py-4 bg-white/50 border-[2px] border-brand-ink text-brand-ink font-black text-lg tracking-[0.2em] uppercase hover:bg-brand-ink hover:text-brand-cloud shadow-[4px_4px_0_0_#030404] hover:shadow-[0px_0px_0_0_#030404] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 group overflow-hidden">
                  <span className="relative z-10">INITIALIZE</span>
                  <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-brand-cloud/40 to-transparent skew-x-[-45deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out" />
                  {/* Cyberpunk corner cuts */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-cloud" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-cloud" />
                </button>
              </Link>
            ) : (
              <div className="px-12 py-4 bg-white/80 border-[2px] border-brand-ink text-brand-ink font-black text-sm tracking-[0.2em] uppercase flex items-center gap-3 shadow-[4px_4px_0_0_#030404]">
                <ShieldCheck size={20} /> ACCESS GRANTED
              </div>
            )}
          </motion.div>

        </div>
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
              suppressHydrationWarning={true}
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
