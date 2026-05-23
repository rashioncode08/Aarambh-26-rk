'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Calendar, Utensils, Sparkles, Smile, Compass, Navigation } from 'lucide-react';
import { SCHEDULE_DATA, DaySchedule, ScheduleItem } from '@/constants/events';

const dayColors = [
  'border-brand-orange hover:shadow-solid-orange',
  'border-brand-pink hover:shadow-solid-pink',
  'border-brand-blue hover:shadow-solid-blue',
];

const accentBgs = ['bg-brand-orange', 'bg-brand-pink', 'bg-brand-blue'];

export default function SchedulePage() {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const activeDay = SCHEDULE_DATA[activeDayIdx];

  // Check if title represents a meal to style it subtler
  const isMeal = (title: string) => {
    const t = title.toUpperCase();
    return t === 'BREAKFAST' || t === 'LUNCH' || t === 'SNACKS' || t === 'DINNER' || t === 'REST';
  };

  // Get corresponding icon for event
  const getEventIcon = (title: string) => {
    const t = title.toUpperCase();
    if (t === 'BREAKFAST' || t === 'LUNCH' || t === 'SNACKS' || t === 'DINNER') {
      return <Utensils className="w-5 h-5" />;
    }
    if (t.includes('SPORT') || t.includes('RUN')) {
      return <Compass className="w-5 h-5 animate-pulse" />;
    }
    if (t.includes('WORKSHOP') || t.includes('SESSION') || t.includes('HACKS') || t.includes('CYBER')) {
      return <Sparkles className="w-5 h-5" />;
    }
    if (t.includes('DANCE') || t.includes('LATENT') || t.includes('DRAMA') || t.includes('BAND') || t.includes('CULTURAL')) {
      return <Smile className="w-5 h-5 text-brand-pink" />;
    }
    return <Navigation className="w-5 h-5" />;
  };

  return (
    <div className="py-28 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen relative overflow-hidden bg-brand-ink text-brand-cloud">
      {/* Halftone dot pattern background */}
      <div className="absolute inset-0 bg-halftone-cloud opacity-[0.03] pointer-events-none" />

      {/* Retro comic header panel */}
      <header className="text-center mb-16 relative z-10 flex flex-col items-center">
        <div className="border-comic bg-brand-orange text-brand-ink px-5 py-2 font-display text-xs font-black tracking-[0.25em] uppercase shadow-comic -rotate-1 mb-8 bg-halftone-black">
          SQUAD DEPLOYMENT TIMELINES
        </div>

        {/* Comic Speech Bubble */}
        <div className="relative mb-6 comic-bubble px-6 py-2.5 font-display text-xs sm:text-sm font-black uppercase text-brand-ink rotate-1 shadow-comic-sm animate-bounce">
          “PLAN YOUR DAYS, DOMINATE THE SQUAD!” ⚡
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter mb-4 text-brand-cloud text-center drop-shadow-[4px_4px_0px_#FF188C]">
          AARAMBH SCHEDULE
        </h1>
        <p className="text-brand-cloud/60 font-bold uppercase text-xs sm:text-sm tracking-widest max-w-2xl mt-2">
          Eight days of epic learning, community squads, and non-stop action.
        </p>
      </header>

      {/* Horizontal Scrollable Neo-Brutalist Tabs */}
      <div className="relative z-20 mb-12 w-full">
        <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-thin scrollbar-thumb-brand-pink scrollbar-track-brand-ink justify-start md:justify-center">
          {SCHEDULE_DATA.map((day, idx) => {
            const isActive = activeDayIdx === idx;
            const rotation = idx % 2 === 0 ? 'rotate-1' : '-rotate-1';
            
            return (
              <button
                key={day.day}
                onClick={() => setActiveDayIdx(idx)}
                className={`comic-interactive border-comic-thin px-5 py-3 rounded-lg font-display shrink-0 transition-all select-none ${
                  isActive
                    ? 'bg-brand-pink text-brand-cloud shadow-solid-pink scale-105 -rotate-2 font-black'
                    : 'bg-brand-cloud text-brand-ink shadow-comic-sm hover:bg-brand-orange hover:text-brand-ink font-bold ' + rotation
                }`}
              >
                <div className="text-sm tracking-tighter">{day.day}</div>
                <div className="text-xs uppercase opacity-85 mt-0.5 tracking-wider font-mono">{day.date}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Itinerary Timeline */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDayIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activeDay.events.map((event, idx) => {
              const isEventMeal = isMeal(event.title);
              const accentColor = accentBgs[idx % 3];
              
              // Special Layout for All Day Outing (Day 5)
              if (event.time.toLowerCase() === 'all day') {
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    key={idx}
                    className="border-comic bg-brand-orange text-brand-ink p-8 sm:p-12 rounded-xl shadow-comic bg-halftone-black text-center relative overflow-hidden my-8"
                  >
                    <div className="absolute top-3 right-3 text-[10px] font-mono font-black text-brand-ink/50 bg-brand-pink/15 px-2 py-0.5 border-comic-thin rounded rotate-3">
                      LEVEL 5 • COHORT EXCURSION
                    </div>
                    
                    <div className="relative p-6 mb-6 bg-brand-pink border-comic shadow-comic-sm rounded-lg text-brand-cloud inline-block rotate-[-3deg]">
                      <Compass size={48} className="animate-spin-slow" />
                    </div>

                    <h3 className="font-display text-4xl sm:text-5xl font-black mb-4 uppercase tracking-tighter">
                      {event.title}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 bg-brand-ink text-brand-cloud px-4 py-1.5 rounded-lg border-2 border-brand-cloud font-display text-sm font-black uppercase shadow-comic-sm rotate-1">
                      <MapPin size={16} className="text-brand-orange" /> {event.location}
                    </div>
                    <p className="text-brand-ink/80 text-xs sm:text-sm mt-8 max-w-md mx-auto leading-relaxed font-bold uppercase">
                      WHOOSH! AN ENTIRE DAY DEDICATED TO OUTDOOR ADVENTURES, TEAM BUILDING, AND EXPLORING OFF-CAMPUS WONDERS WITH THE REST OF THE FRESHERS!
                    </p>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  key={idx}
                  className={`border-comic p-5 rounded-xl transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start sm:items-center ${
                    isEventMeal
                      ? 'bg-brand-cloud/5 border-brand-cloud/15 text-brand-cloud/60'
                      : 'bg-brand-cloud text-brand-ink shadow-comic hover:-translate-y-0.5 cursor-pointer'
                  }`}
                >
                  {/* Time Badge */}
                  <div
                    className={`border-2 border-brand-ink px-4 py-2 font-display font-black text-xs shadow-comic-sm shrink-0 w-full sm:w-44 text-center rounded-md ${
                      isEventMeal 
                        ? 'bg-brand-ink/30 border-brand-cloud/20 text-brand-cloud/50 shadow-none' 
                        : accentColor + ' text-brand-ink ' + (idx % 2 === 0 ? '-rotate-1' : 'rotate-1')
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Clock size={13} />
                      <span className="tracking-wide uppercase font-mono">{event.time}</span>
                    </div>
                  </div>

                  {/* Icon & Event details */}
                  <div className="flex gap-4 items-center flex-grow">
                    {!isEventMeal && (
                      <div className={`p-2.5 rounded-lg border-2 border-brand-ink shrink-0 hidden sm:block ${accentColor} text-brand-ink shadow-comic-sm`}>
                        {getEventIcon(event.title)}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <h3
                        className={`font-display text-lg sm:text-xl font-black uppercase leading-tight tracking-tight ${
                          isEventMeal ? 'text-brand-cloud/50 font-bold' : 'text-brand-ink hover:text-brand-pink transition-colors'
                        }`}
                      >
                        {event.title}
                      </h3>
                      {event.location && (
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            isEventMeal
                              ? 'bg-brand-ink/10 border-brand-cloud/10 text-brand-cloud/45'
                              : 'bg-brand-blue/15 border-brand-blue/30 text-brand-blue'
                          }`}
                        >
                          <MapPin size={10} />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Footer Section */}
      <section className="mt-20 text-center relative z-10">
        <div className="border-comic bg-brand-pink text-brand-cloud max-w-xl mx-auto p-6 rounded-xl shadow-comic bg-halftone-black -rotate-1">
          <h3 className="font-display font-black text-lg uppercase mb-2">DOWNLOAD RULES & INSTRUCTIONS</h3>
          <p className="text-xs uppercase tracking-wide opacity-90 mb-4 font-bold">
            Make sure to download and review the official rule book before check-in.
          </p>
          <a
            href="https://drive.google.com/file/d/1ZYlhBmtHS6bgUEg6MdhIxg4ipDRmEkpj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-comic bg-brand-orange text-brand-ink px-4 py-2 font-display text-xs font-black uppercase tracking-wider shadow-comic-sm hover:scale-[1.03] transition-transform active:scale-[0.98]"
          >
            DOWNLOAD RULES BOOK
          </a>
        </div>
      </section>
    </div>
  );
}
