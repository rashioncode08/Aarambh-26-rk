'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AboutSection from '@/components/about';
import { Cabin_Sketch } from 'next/font/google';

const cabinSketch = Cabin_Sketch({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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

const SparkleStar = ({ className, size = 32 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
    <path d="M50 0 C50 35, 65 50, 100 50 C65 50, 50 65, 50 100 C50 65, 35 50, 0 50 C35 50, 50 35, 50 0 Z" />
  </svg>
);

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
// ── Photos from public/photos/web ──
interface Photo {
  id: number
  src: string
  label: string
}

const PHOTOS: Photo[] = [
  {
    "id": 1,
    "src": "/photos/web/MCS00113.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 2,
    "src": "/photos/web/MCS00486.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 3,
    "src": "/photos/web/MCS00734.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 4,
    "src": "/photos/web/MCS01361.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 5,
    "src": "/photos/web/MCS01446.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 6,
    "src": "/photos/web/MCS01565.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 7,
    "src": "/photos/web/MCS01588.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 8,
    "src": "/photos/web/MCS01598.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 9,
    "src": "/photos/web/MCS01616.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 10,
    "src": "/photos/web/MCS01619.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 11,
    "src": "/photos/web/MCS01630.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 12,
    "src": "/photos/web/MCS02240.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 13,
    "src": "/photos/web/MCS02341.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 14,
    "src": "/photos/web/MCS02351.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 15,
    "src": "/photos/web/MCS02401.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 16,
    "src": "/photos/web/MCS02551.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 17,
    "src": "/photos/web/MCS02708.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 18,
    "src": "/photos/web/MCS02747.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 19,
    "src": "/photos/web/MCS03220.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 20,
    "src": "/photos/web/MCS03237.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 21,
    "src": "/photos/web/MCS03264.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 22,
    "src": "/photos/web/MCS03277.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 23,
    "src": "/photos/web/MCS03308.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 24,
    "src": "/photos/web/MCS03352.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 25,
    "src": "/photos/web/MCS03543.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 26,
    "src": "/photos/web/MCS03615.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 27,
    "src": "/photos/web/MCS03804.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 28,
    "src": "/photos/web/MCS03882.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 29,
    "src": "/photos/web/MCS04202.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 30,
    "src": "/photos/web/MCS04213.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 31,
    "src": "/photos/web/MCS04257.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 32,
    "src": "/photos/web/MCS04925.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 33,
    "src": "/photos/web/MCS05021.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 34,
    "src": "/photos/web/MCS05036.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 35,
    "src": "/photos/web/MCS05143.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 36,
    "src": "/photos/web/MCS05159.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 37,
    "src": "/photos/web/MCS05177.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 38,
    "src": "/photos/web/MCS05226.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 39,
    "src": "/photos/web/MCS05230.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 40,
    "src": "/photos/web/MCS05344.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 41,
    "src": "/photos/web/MCS05389.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 42,
    "src": "/photos/web/MCS05430.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 43,
    "src": "/photos/web/MCS05432.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 44,
    "src": "/photos/web/MCS05434.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 45,
    "src": "/photos/web/MCS05448.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 46,
    "src": "/photos/web/MCS05466.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 47,
    "src": "/photos/web/MCS05527.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 48,
    "src": "/photos/web/MCS05585.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 49,
    "src": "/photos/web/MCS05620.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 50,
    "src": "/photos/web/MCS05702.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 51,
    "src": "/photos/web/MCS05747.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 52,
    "src": "/photos/web/MCS05754.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 53,
    "src": "/photos/web/MCS05788.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 54,
    "src": "/photos/web/MCS05795.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 55,
    "src": "/photos/web/MCS05807.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 56,
    "src": "/photos/web/1.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 57,
    "src": "/photos/web/2.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 58,
    "src": "/photos/web/3.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 59,
    "src": "/photos/web/4.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 60,
    "src": "/photos/web/5.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 61,
    "src": "/photos/web/6.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 62,
    "src": "/photos/web/7.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 63,
    "src": "/photos/web/8.webp",
    "label": "Aarambh 26 Moment"
  },
  {
    "id": 64,
    "src": "/photos/web/9.webp",
    "label": "Aarambh 26 Moment"
  }
];

const col1Images = PHOTOS.slice(0, 16).map(p => p.src);
const col2Images = PHOTOS.slice(16, 32).map(p => p.src);
const col3Images = PHOTOS.slice(32, 48).map(p => p.src);
const col4Images = PHOTOS.slice(48, 64).map(p => p.src);

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  rotation: number;
  scaleY: number;
  color: string;
}

function RocketOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rocket, setRocket] = useState({ x: 0, y: 0, scale: 1, zIndex: 30, heading: 0, opacity: 1 });
  const [smoke, setSmoke] = useState<SmokeParticle[]>([]);
  
  const timeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const updateDimensions = () => {
      setDimensions({
        width: parent.offsetWidth,
        height: parent.offsetHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timer = setTimeout(updateDimensions, 200);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  const getPathPosition = (t: number) => {
    const rx = dimensions.width / 2;
    const ry = dimensions.height / 2;

    const normalRadiusX = dimensions.width * 0.52;
    const normalRadiusY = dimensions.height * 0.8;

    const entryDuration = 5.0; // 5 seconds of entry spiral
    let radX = normalRadiusX;
    let radY = normalRadiusY;
    let angle = 0;
    let offsetY = 0;
    let noiseX = 0;
    let noiseY = 0;

    if (t < entryDuration) {
      const progress = t / entryDuration; // 0 to 1
      const spiralFactor = 1.0 - progress; // 1 to 0

      // Start at 135deg (top-left) with a massive radius and spiral inwards
      angle = t * 2.8 + Math.PI * 0.75;
      radX = normalRadiusX * (1.0 + spiralFactor * 2.8);
      radY = normalRadiusY * (1.0 + spiralFactor * 2.8);
      
      // Start high up and drop down
      offsetY = -spiralFactor * 180;

      // Add wavy noise
      noiseX = Math.sin(t * 8) * 35 * spiralFactor;
      noiseY = Math.cos(t * 8) * 30 * spiralFactor;
    } else {
      // Stable orbit
      angle = (t - entryDuration) * 1.5 + (entryDuration * 2.8 + Math.PI * 0.75);
    }

    // Un-tilted orbit
    const dx = radX * Math.cos(angle) + noiseX;
    const dy = radY * Math.sin(angle) + noiseY;

    // 3D Tilt rotation (approx -18 degrees)
    const tiltRad = -18 * Math.PI / 180;
    const cosTilt = Math.cos(tiltRad);
    const sinTilt = Math.sin(tiltRad);

    const tiltedX = dx * cosTilt - dy * sinTilt;
    const tiltedY = dx * sinTilt + dy * cosTilt + offsetY;

    return {
      x: rx + tiltedX,
      y: ry + tiltedY,
      angle: angle,
    };
  };

  const animate = (timestamp: number) => {
    if (prevTimeRef.current !== null) {
      const delta = (timestamp - prevTimeRef.current) * 0.001; // seconds
      timeRef.current += delta;
      const t = timeRef.current;

      if (dimensions.width > 0) {
        // Calculate current and next positions for heading tangent
        const pos = getPathPosition(t);
        const nextPos = getPathPosition(t + 0.01);
        const heading = Math.atan2(nextPos.y - pos.y, nextPos.x - pos.x);

        // 3D Depth layering (Behind vs. In-front)
        // In our un-tilted angle, y goes up (behind) when sin(angle) < 0
        const isBehind = Math.sin(pos.angle) < 0;
        const scale = isBehind
          ? 0.6 + 0.15 * Math.sin(pos.angle) // 0.45 to 0.6
          : 0.95 + 0.3 * Math.sin(pos.angle); // 0.95 to 1.25
        const zIndex = isBehind ? 5 : 30;
        const opacity = isBehind ? 0.75 : 1.0;

        setRocket({
          x: pos.x,
          y: pos.y,
          scale,
          zIndex,
          heading,
          opacity,
        });

        // Spawn smoke at tail
        const now = Date.now();
        if (now - lastSpawnRef.current > 40) {
          lastSpawnRef.current = now;

          const rocketSize = Math.max(50, dimensions.height * 0.35);
          const offset = (rocketSize / 2) * scale;
          const tailX = pos.x - Math.cos(heading) * offset;
          const tailY = pos.y - Math.sin(heading) * offset;

          const smokeColors = [
            'rgba(240, 240, 240, 0.85)', // Light gray
            'rgba(215, 215, 215, 0.75)', // Medium gray
            'rgba(255, 154, 0, 0.7)',   // Accent orange fire smoke
            'rgba(255, 24, 140, 0.55)',   // Pink trail spark
          ];

          const newParticle: SmokeParticle = {
            id: Math.random() + now,
            x: tailX,
            y: tailY,
            size: (Math.random() * 18 + 14) * scale, // scale smoke size with rocket depth
            alpha: 0.9,
            vx: -Math.cos(heading) * 55 + (Math.random() - 0.5) * 25,
            vy: -Math.sin(heading) * 55 + (Math.random() - 0.5) * 25,
            rotation: Math.random() * 360,
            scaleY: 0.75 + Math.random() * 0.4,
            color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
          };

          setSmoke((prev) => [...prev, newParticle]);
        }
      }

      // Update smoke particles
      setSmoke((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * delta,
            y: p.y + p.vy * delta,
            size: p.size + 22 * delta, // smoke expands
            alpha: p.alpha - 0.9 * delta, // smoke fades
          }))
          .filter((p) => p.alpha > 0)
      );
    }

    prevTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [dimensions]);

  if (dimensions.width === 0) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
  }

  const rocketSize = Math.max(50, dimensions.height * 0.35) * rocket.scale;
  const headingDegrees = (rocket.heading * 180) / Math.PI;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 overflow-visible"
    >
      {/* Smoke trail */}
      {smoke.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color} 0%, rgba(200, 200, 200, 0.4) 40%, rgba(150, 150, 150, 0) 70%)`,
            opacity: p.alpha,
            filter: 'blur(3px)',
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scaleY(${p.scaleY})`,
          }}
        />
      ))}

      {/* Rocket */}
      <div
        className="absolute transition-transform duration-75 ease-out"
        style={{
          left: rocket.x,
          top: rocket.y,
          width: rocketSize,
          height: rocketSize,
          zIndex: rocket.zIndex,
          opacity: rocket.opacity,
          transform: `translate(-50%, -50%) rotate(${headingDegrees + 90}deg)`,
        }}
      >
        <div className="w-full h-full relative overflow-visible">
          {/* Custom vector SVG Rocket (Sharp, modern, matches site branding) */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[2px_4px_6px_rgba(3,4,4,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Thrust Flame */}
            <path d="M44,76 L50,96 L56,76 Z" fill="#FF9A00" stroke="#030404" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M47,76 L50,88 L53,76 Z" fill="#FF188C" />
            
            {/* Left Fin */}
            <path d="M37,60 L22,78 C21,80 25,82 32,80 L39,72 Z" fill="#0D21DD" stroke="#030404" strokeWidth="3" strokeLinejoin="round" />
            
            {/* Right Fin */}
            <path d="M63,60 L78,78 C79,80 75,82 68,80 L61,72 Z" fill="#0D21DD" stroke="#030404" strokeWidth="3" strokeLinejoin="round" />
            
            {/* Rocket Main Body */}
            <path d="M50,12 C62,28 66,48 61,74 L39,74 C34,48 38,28 50,12 Z" fill="#F5F1E5" stroke="#030404" strokeWidth="3" strokeLinejoin="round" />
            
            {/* Nose Cone */}
            <path d="M50,12 C55,20 58,28 57,35 L43,35 C42,28 45,20 50,12 Z" fill="#FF188C" stroke="#030404" strokeWidth="3" strokeLinejoin="round" />
            
            {/* Porthole Window */}
            <circle cx="50" cy="48" r="8.5" fill="#0D21DD" stroke="#030404" strokeWidth="3" />
            <circle cx="50" cy="48" r="5" fill="#ffffff" opacity="0.3" />
            <circle cx="47" cy="45" r="2.5" fill="#ffffff" />
            
            {/* Body stripe */}
            <path d="M40,58 L60,58" stroke="#030404" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse coordinates tracking for smooth parallax depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 22 });

  // Parallax drifts for background outlined text / images
  const bgTextX1 = useTransform(springX, [-0.5, 0.5], [60, -60]);
  const bgTextY1 = useTransform(springY, [-0.5, 0.5], [30, -30]);
  
  const bgTextX2 = useTransform(springX, [-0.5, 0.5], [-60, 60]);
  const bgTextY2 = useTransform(springY, [-0.5, 0.5], [-30, 30]);

  // Skateboarder frame 3D drift coordinates
  const logoRotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const logoRotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const logoX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const logoY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  // Y2K Sparkle Stars parallax drifts
  const starX1 = useTransform(springX, [-0.5, 0.5], [35, -35]);
  const starY1 = useTransform(springY, [-0.5, 0.5], [25, -25]);
  const starX2 = useTransform(springX, [-0.5, 0.5], [-45, 45]);
  const starY2 = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };


  const [galleryMounted, setGalleryMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);




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
    setGalleryMounted(true);

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
    { 
      label: 'DAYS', 
      valueKey: 'days', 
      bg: '#fbc5db', 
      gridColor: 'rgba(255, 24, 140, 0.15)',
      numColor: 'text-[#6c287a]', 
      rotate: '-rotate-[2deg]',
      tapeColor: 'bg-[#61c0af]/90',
      tapeRotate: 'rotate-[2deg]',
      tapeClip: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)'
    },
    { 
      label: 'HOURS', 
      valueKey: 'hours', 
      bg: '#ffe8a3', 
      gridColor: 'rgba(255, 154, 0, 0.2)',
      numColor: 'text-[#7c531d]', 
      rotate: 'rotate-[1deg]',
      tapeColor: 'bg-[#eb99a9]/90',
      tapeRotate: '-rotate-[3deg]',
      tapeClip: 'polygon(0% 20%, 5% 0%, 95% 0%, 100% 20%, 98% 80%, 95% 100%, 5% 100%, 2% 80%)'
    },
    { 
      label: 'MINUTES', 
      valueKey: 'mins', 
      bg: '#d2d6ff', 
      gridColor: 'rgba(13, 33, 221, 0.15)',
      numColor: 'text-[#1846b0]', 
      rotate: '-rotate-[1deg]',
      tapeColor: 'bg-[#fad02c]/95',
      tapeRotate: 'rotate-[1deg]',
      tapeClip: 'polygon(2% 0%, 98% 0%, 100% 60%, 98% 100%, 2% 100%, 0% 40%)'
    },
    { 
      label: 'SECONDS', 
      valueKey: 'secs', 
      bg: '#ffffff', 
      gridColor: 'rgba(0, 0, 0, 0.08)',
      numColor: 'text-[#5e6b7d]', 
      rotate: 'rotate-[2deg]',
      tapeColor: 'bg-[#b8ada0]/90',
      tapeRotate: '-rotate-[1deg]',
      tapeClip: 'polygon(4% 0%, 96% 0%, 100% 40%, 96% 100%, 4% 100%, 0% 60%)'
    },
  ];


  if (!isMounted) {
    return <div className="fixed inset-0 bg-brand-ink" />;
  }

  return (
    <main className="flex flex-col items-center overflow-x-hidden relative bg-[#ff9a00] text-brand-ink font-sans">
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Torn Paper PNG + Word Cloud + TV Collage   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[650px] md:min-h-[700px] lg:min-h-[800px] flex flex-col justify-between overflow-hidden bg-[#ff9a00]" id="hero">
        {/* Torn Paper Effect Background PNG */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/1920x1080.png"
            alt="Torn paper background frame"
            className="w-full h-full object-fill"
            draggable={false}
          />
        </div>

        {/* Top Band: Empty Spacer to clear the navbar */}
        <div className="relative w-full z-10 h-[14vh] min-h-[95px] md:min-h-[115px] pointer-events-none" />

        {/* Center Logo Section */}
        <div className="relative flex-1 w-full flex items-center justify-center z-10 px-4 md:px-8 py-2 md:py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero section/new_logo2.png"
              alt="Aarambh New Logo"
              className="relative z-10 w-full h-auto max-h-[45vh] md:max-h-[55vh] object-contain select-none"
              draggable={false}
            />

            {/* Revolving Rocket with Smoke trail */}
            <RocketOrbit />
          </motion.div>
        </div>

        {/* Bottom Spacer/Band to align with the torn edge */}
        <div className="w-full h-[14vh] min-h-[60px] z-10 pointer-events-none" />
      </section>

      {/* ── Countdown Timer Strip ── */}
      <section className="w-full py-8 z-10 flex justify-center items-center overflow-hidden bg-[#ff9a00]">
        <div className="flex items-center justify-center gap-3 sm:gap-6 px-4 py-2">
          {countdownBlocks.map((block) => (
            <div
              key={block.label}
              className={`relative flex flex-col justify-between items-center p-3 sm:p-5 border border-brand-ink/10 shadow-[4px_4px_10px_rgba(3,4,4,0.12)] rounded-sm ${block.rotate} transition-transform hover:scale-105 duration-300 w-[75px] sm:w-[110px] md:w-[130px] h-[105px] sm:h-[150px] md:h-[180px]`}
              style={{
                backgroundColor: block.bg,
                backgroundImage: `linear-gradient(${block.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${block.gridColor} 1px, transparent 1px)`,
                backgroundSize: '12px 12px',
              }}
            >
              {/* Tape decoration at the top */}
              <div 
                className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 sm:w-16 h-3 sm:h-4 ${block.tapeColor} shadow-sm ${block.tapeRotate} z-20`}
                style={{
                  clipPath: block.tapeClip
                }}
              />

              {/* Label: Days, Hours, etc. */}
              <span className="text-[9px] sm:text-xs font-serif font-black tracking-widest text-[#030404]/75 mt-2 select-none">
                {block.label}
              </span>

              {/* Number with sketched hand-drawn font */}
              <div className="flex-1 flex items-center justify-center w-full mb-1 sm:mb-2">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={timeLeft[block.valueKey as keyof TimeLeft]}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${cabinSketch.className} ${block.numColor} text-3xl sm:text-5xl md:text-6xl font-bold tabular-nums`}
                  >
                    {String(timeLeft[block.valueKey as keyof TimeLeft]).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Torn paper visual separation */}
      <TornPaperDivider color="fill-brand-ink" flip={true} />


      {/* About Section wrapper */}
      <section className="w-full z-10 bg-brand-ink">
        <AboutSection />
      </section>
      {/* Memories of 2025 Gallery Showcase Section */}
      <section className="w-full relative z-10 bg-brand-cloud border-t-4 border-brand-ink text-brand-ink">
        <style dangerouslySetInnerHTML={{
          __html: `


          .gl-root {
            width: 100%;
            height: 980px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            background: #F5F1E5;
            perspective: 1200px;
          }

          /* ── ENTER MAGIC CARD ── */
          .gl-card {
            position: relative;
            z-index: 10;
            width: clamp(280px, 82vw, 390px);
            background: #F5F1E5;
            border: 3.5px solid #030404;
            border-radius: 20px;
            padding: 32px 28px;
            text-align: center;
            box-shadow: 12px 12px 0px 0px #030404;
            overflow: visible;
            transform-style: flat;
            will-change: transform;
          }

          /* sliding photo columns */
          .gl-slider-column {
            position: absolute;
            top: -10%;
            width: 145px;
            height: 120%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 22px;
            z-index: 2;
            pointer-events: none;
            opacity: 0.85;
          }

          .gl-slider-img-container {
            width: 100%;
            height: 195px;
            position: relative;
            border: 3px solid #030404;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 5px 5px 0px 0px #030404;
            background: #030404;
          }

          .gl-slider-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @keyframes slideUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }

          @keyframes slideDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }

          .gl-slider-track-up {
            display: flex;
            flex-direction: column;
            gap: 22px;
            animation: slideUp 24s linear infinite;
          }

          .gl-slider-track-down {
            display: flex;
            flex-direction: column;
            gap: 22px;
            animation: slideDown 24s linear infinite;
          }

          @media (max-width: 1200px) {
            .gl-slider-column.inner {
              display: none !important;
            }
          }

          @media (max-width: 768px) {
            .gl-slider-column {
              display: flex !important;
              flex-direction: row !important;
              width: 250% !important;
              height: 105px !important;
              left: -75% !important;
              right: auto !important;
              top: auto !important;
              gap: 12px !important;
              opacity: 0.7 !important;
            }
            
            /* Position columns as horizontal rows */
            .gl-slider-column.left:not(.inner) {
              top: 4% !important;
            }
            .gl-slider-column.left.inner {
              display: flex !important;
              top: 17% !important;
            }
            .gl-slider-column.right.inner {
              display: flex !important;
              bottom: 17% !important;
            }
            .gl-slider-column.right:not(.inner) {
              bottom: 4% !important;
            }

            .gl-slider-img-container {
              width: 140px !important;
              height: 95px !important;
              box-shrink: 0 !important;
              flex-shrink: 0 !important;
              box-shadow: 3px 3px 0px 0px #030404 !important;
            }

            .gl-slider-track-up {
              display: flex !important;
              flex-direction: row !important;
              gap: 12px !important;
              animation: slideLeft 22s linear infinite !important;
            }

            .gl-slider-track-down {
              display: flex !important;
              flex-direction: row !important;
              gap: 12px !important;
              animation: slideRight 22s linear infinite !important;
            }
          }

          @keyframes slideLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          @keyframes slideRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }

          /* Starburst badge */
          .gl-starburst {
            position: absolute;
            width: 72px;
            height: 72px;
            background: #FF9A00;
            border: 2px solid #030404;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: starSpin 10s linear infinite;
          }
          @keyframes starSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .gl-starburst-text {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-display);
            font-weight: 900;
            font-size: 10px;
            color: #030404;
            letter-spacing: 0.05em;
            text-align: center;
            line-height: 1.1;
            animation: starSpin 10s linear infinite reverse;
          }

          .gl-devanagari {
            font-family: 'Tiro Devanagari Hindi', serif;
            font-size: 1.1rem;
            color: #030404;
            margin-bottom: 6px;
            letter-spacing: 0.05em;
            font-weight: 700;
          }

          .gl-eyebrow {
            font-family: var(--font-display);
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #FF188C;
            margin-bottom: 18px;
          }

          .gl-heading {
            font-family: var(--font-display);
            font-size: clamp(2rem, 7vw, 3rem);
            font-weight: 900;
            color: #030404;
            line-height: 1.0;
            letter-spacing: -0.03em;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          
          .gl-heading-highlight {
            color: #F5F1E5;
            text-shadow: 
              2px 2px 0 #FF188C,
              -2px -2px 0 #FF188C,
              2px -2px 0 #FF188C,
              -2px 2px 0 #FF188C,
              4px 4px 0 #030404;
          }

          .gl-divider {
            width: 50px;
            height: 4px;
            background: #030404;
            border-radius: 99px;
            margin: 18px auto 18px;
          }

          .gl-sub {
            font-family: var(--font-display);
            font-size: 0.8rem;
            font-weight: 600;
            color: #030404;
            letter-spacing: 0.02em;
            line-height: 1.5;
            margin-bottom: 24px;
          }

          /* Begin Experience button */
          .gl-cta {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-display);
            font-size: 0.85rem;
            font-weight: 900;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #F5F1E5;
            background: #FF188C;
            border: 3.5px solid #030404;
            border-radius: 12px;
            padding: 14px 28px;
            text-decoration: none;
            cursor: pointer;
            box-shadow: 5px 5px 0px 0px #030404;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
          }
          .gl-cta:hover {
            transform: translate(-3px, -3px);
            box-shadow: 8px 8px 0px 0px #030404;
            background: #FF9A00;
            color: #030404;
          }
          .gl-cta:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px 0px #030404;
          }

          .gl-corner-tag {
            position: absolute;
            font-family: var(--font-display);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #030404;
            pointer-events: none;
            z-index: 5;
          }

          .gl-card-topbar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 10px;
            background: #FF9A00;
            border-bottom: 3.5px solid #030404;
          }
        `}} />

        <div className="gl-root">
          {/* Column 1: Left Outer (Slides Up) */}
          <div className="gl-slider-column left" style={{ left: '1.5%' }}>
            <div className="gl-slider-track-up">
              {[...col1Images, ...col1Images].map((src, i) => (
                <div key={`col1-${i}`} className="gl-slider-img-container">
                  <img src={src} className="gl-slider-image" alt="Aarambh" />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Left Inner (Slides Down) */}
          <div className="gl-slider-column left inner" style={{ left: '12.5%' }}>
            <div className="gl-slider-track-down">
              {[...col2Images, ...col2Images].map((src, i) => (
                <div key={`col2-${i}`} className="gl-slider-img-container">
                  <img src={src} className="gl-slider-image" alt="Aarambh" />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Right Inner (Slides Up) */}
          <div className="gl-slider-column right inner" style={{ right: '12.5%' }}>
            <div className="gl-slider-track-up">
              {[...col3Images, ...col3Images].map((src, i) => (
                <div key={`col3-${i}`} className="gl-slider-img-container">
                  <img src={src} className="gl-slider-image" alt="Aarambh" />
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Right Outer (Slides Down) */}
          <div className="gl-slider-column right" style={{ right: '1.5%' }}>
            <div className="gl-slider-track-down">
              {[...col4Images, ...col4Images].map((src, i) => (
                <div key={`col4-${i}`} className="gl-slider-img-container">
                  <img src={src} className="gl-slider-image" alt="Aarambh" />
                </div>
              ))}
            </div>
          </div>



          {/* Main Content Container */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, padding: '0 20px', textAlign: 'center' }}>

            {/* Title Section */}
            {galleryMounted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  maxWidth: '650px',
                  marginBottom: '32px'
                }}
              >
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 'clamp(2.0rem, 5vw, 3rem)',
                  fontWeight: 800,
                  color: '#FF9A00',
                  marginBottom: '16px',
                  textShadow: '2px 2px 0px #030404',
                  letterSpacing: '-0.02em'
                }}>
                  Memories of 2025
                </h2>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 600,
                  color: '#030404',
                  lineHeight: 1.6
                }}>
                  Experience the best moments of Aarambh 2025 with our curated memories.
                </p>
              </motion.div>
            )}

            {/* Main Neo-Brutalism Card */}
            {galleryMounted && (
              <motion.div
                className="gl-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="gl-card-topbar" />

                {/* Content Container */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                  {/* Devanagari */}
                  <div className="gl-devanagari">आरम्भ '२६</div>

                  {/* Main heading */}
                  <h1 className="gl-heading" style={{ marginBottom: '32px' }}>
                    ENTER THE <br />
                    <span className="gl-heading-highlight">GALLERY</span>
                  </h1>

                  {/* CTA - Navigates to /gallery */}
                  <div style={{ display: 'inline-block', position: 'relative', zIndex: 100, marginTop: '8px' }}>
                    <Link href="/gallery" className="gl-cta">
                      Begin Experience →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Static Registration Section */}
      <section className="py-24 px-6 w-full max-w-5xl pb-32 relative z-10 mx-auto">
        <div className="border-comic bg-brand-orange text-brand-ink shadow-comic-lg bg-halftone-black p-8 sm:p-12 md:p-16 rounded-xl text-center relative overflow-hidden">
          {/* Action starburst backing design */}
          <div className="absolute top-2 left-2 w-16 h-16 border-comic-thin bg-brand-pink text-brand-cloud font-display font-black text-[10px] uppercase tracking-tighter flex items-center justify-center rotate-[-12deg] shadow-comic-sm">
            REG
          </div>

          <span className="relative z-10 px-3 py-1 bg-brand-ink text-brand-cloud font-display text-[10px] font-black uppercase tracking-widest rounded-md">
            OFFICIAL REGISTRATION GATEWAY
          </span>

          <h2 className="text-3xl md:text-5xl font-display font-black uppercase mb-4 tracking-tight mt-6">
            COMPLETE YOUR REGISTRATION!
          </h2>
          <p className="text-brand-ink/80 text-xs sm:text-sm mb-10 max-w-md mx-auto leading-relaxed font-bold uppercase">
            COMPLETE YOUR ONLINE REGISTRATION AND SECURE YOUR SEAT FOR AARAMBH &apos;26. FULL ENROLLMENT GRANTS ACCESS TO ALL KEYNOTES, HANDS-ON WORKSHOPS & FESTIVAL ACTIVITIES!
          </p>
          <div className="flex justify-center relative z-10">
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="comic-interactive border-comic py-4 px-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all font-display font-black text-lg uppercase tracking-wider text-brand-ink bg-brand-pink text-brand-cloud rounded-lg cursor-pointer"
              >
                REGISTER ONLINE NOW →
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
