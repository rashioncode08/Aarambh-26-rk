'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Unlock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [hasRegistered, setHasRegistered] = useState(false);

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
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center overflow-x-hidden">
      {/* Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-28 px-4">
        <div className="hero-glow w-[500px] h-[500px] bg-brand-pink/25 -top-40 -left-40" />
        <div className="hero-glow w-[400px] h-[400px] bg-brand-orange/20 top-20 -right-32" />
        <div className="hero-glow w-[350px] h-[350px] bg-brand-blue/20 bottom-0 left-1/3" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 text-center max-w-4xl flex flex-col items-center"
        >
          <span className="page-eyebrow flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-brand-orange" />
            University of Excellence Presents
          </span>

          <Image
            src="/logo.svg"
            alt="AARAMBH'26"
            width={520}
            height={120}
            className="w-full max-w-md md:max-w-xl h-auto mb-8"
            priority
            loading="eager"
          />

          <p className="page-subtitle mx-auto mb-12">
            The ultimate convergence of technology, culture, and innovation. Three days of energy,
            boldness, and limitless possibilities.
          </p>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-12 w-full max-w-lg">
            {(['Days', 'Hours', 'Mins', 'Secs'] as const).map((label) => (
              <Card
                key={label}
                className="p-4 sm:p-5 flex flex-col items-center border-brand-pink/20 bg-brand-pink/5"
              >
                <div className="relative h-8 sm:h-10 overflow-hidden flex items-center justify-center w-full">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={timeLeft[label.toLowerCase() as keyof TimeLeft]}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl sm:text-4xl font-display font-extrabold text-brand-cloud tabular-nums absolute"
                    >
                      {String(timeLeft[label.toLowerCase() as keyof TimeLeft]).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-[10px] sm:text-xs text-brand-cloud/50 uppercase tracking-widest mt-1">
                  {label}
                </span>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {!hasRegistered ? (
              <Link href="/register">
                <Button variant="accent" className="flex items-center gap-2 text-base px-8">
                  Register Now <ArrowRight size={20} />
                </Button>
              </Link>
            ) : (
              <div className="bg-brand-blue/20 text-brand-cloud border border-brand-blue/40 px-6 py-3 rounded-md font-bold flex items-center gap-2">
                <ShieldCheck size={20} className="text-brand-orange" /> You are Registered!
              </div>
            )}

          </div>
        </motion.div>


      </section>

      {/* Brand strip */}
      <section className="w-full py-6 border-y border-brand-cloud/10 bg-brand-cloud/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          {[
            { label: 'Energy', color: 'text-brand-orange' },
            { label: 'Boldness', color: 'text-brand-pink' },
            { label: 'Possibility', color: 'text-brand-blue' },
          ].map((item) => (
            <span key={item.label} className={`font-display font-bold text-lg uppercase tracking-widest ${item.color}`}>
              {item.label}
            </span>
          ))}
        </div>
      </section>



      {/* Exclusive content */}
      <section className="py-24 px-4 w-full max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="section-heading flex items-center justify-center gap-3">
            {hasRegistered ? (
              <Unlock className="text-brand-orange" size={32} />
            ) : (
              <Lock className="text-brand-cloud/40" size={32} />
            )}
            Exclusive Student Content
          </h2>
        </div>

        {!hasRegistered ? (
          <Card className="p-12 text-center flex flex-col items-center border-dashed border-brand-pink/30 bg-brand-pink/5">
            <Lock size={56} className="text-brand-pink/50 mb-6" />
            <h3 className="text-2xl font-display font-bold text-brand-cloud mb-4">Content Locked</h3>
            <p className="text-brand-cloud/50 max-w-md">
              Register for AARAMBH&apos;26 to unlock exclusive schedules, speaker details, and community access.
            </p>
            <Link href="/register" className="mt-8">
              <Button variant="accent">Register to Unlock</Button>
            </Link>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="p-8 border-brand-blue/30 bg-brand-blue/10">
              <h3 className="text-2xl font-display font-bold text-brand-cloud mb-4">Student Community</h3>
              <p className="text-brand-cloud/60 mb-6">
                Join your cohort&apos;s WhatsApp and Discord groups to start networking!
              </p>
              <Button variant="secondary" className="w-full">
                Join Discord Server
              </Button>
            </Card>
            <Card className="p-8 border-brand-orange/30 bg-brand-orange/10">
              <h3 className="text-2xl font-display font-bold text-brand-cloud mb-4">Event Schedule</h3>
              <p className="text-brand-cloud/60 mb-6">
                View your personalized itinerary based on your cohort assignment.
              </p>
              <Link href="/schedule">
                <Button variant="accent" className="w-full">
                  View Full Schedule
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 w-full max-w-5xl pb-32">
        <Card className="p-10 md:p-14 text-center relative overflow-hidden border-brand-blue/20">
          <div className="hero-glow w-64 h-64 bg-brand-pink/20 -mr-32 -mt-32 top-0 right-0" />
          <span className="page-eyebrow relative z-10">Stay Updated</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 relative z-10 text-brand-cloud">
            Don&apos;t Miss Any Update
          </h2>
          <p className="text-brand-cloud/60 mb-10 relative z-10 max-w-lg mx-auto">
            Subscribe for real-time alerts about registrations, speaker announcements, and event highlights.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-grow py-3"
              required
              suppressHydrationWarning
            />
            <Button variant="primary" className="py-3 px-8 shrink-0">
              Subscribe
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}


