import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative bg-dark border-t border-brand-cloud/10 py-16 px-6 overflow-hidden">
      <div className="hero-glow w-72 h-72 bg-brand-pink/20 -bottom-32 -left-32" />
      <div className="hero-glow w-64 h-64 bg-brand-blue/15 -top-20 right-0" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block mb-5">
            <Image
              src="/logo.svg"
              alt="AARAMBH'26"
              width={200}
              height={46}
              className="h-11 w-auto"
            />
          </Link>
          <p className="text-brand-cloud/50 max-w-sm leading-relaxed">
            The largest technology and cultural fest of the year. Energy, boldness, and limitless possibilities — all in one place.
          </p>
        </div>

        <div>
          <h4 className="text-brand-orange font-bold mb-4 uppercase text-xs tracking-[0.2em]">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm text-brand-cloud/60">
            <li><Link href="/about" className="hover:text-brand-pink transition-colors">About Us</Link></li>
            <li><Link href="/schedule" className="hover:text-brand-pink transition-colors">Event Schedule</Link></li>
            <li><Link href="/speakers" className="hover:text-brand-pink transition-colors">Guest Speakers</Link></li>
            <li><Link href="/register" className="hover:text-brand-pink transition-colors">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-orange font-bold mb-4 uppercase text-xs tracking-[0.2em]">
            Connect
          </h4>
          <ul className="space-y-2.5 text-sm text-brand-cloud/60">
            <li><a href="#" className="hover:text-brand-blue transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-brand-blue transition-colors">Twitter (X)</a></li>
            <li><a href="#" className="hover:text-brand-blue transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-brand-blue transition-colors">WhatsApp Channel</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 mt-14 pt-8 border-t border-brand-cloud/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-cloud/40">
        <span>&copy; 2026 AARAMBH&apos;26. All rights reserved.</span>
        <span className="text-brand-pink font-semibold">Energy · Boldness · Possibility</span>
      </div>
    </footer>
  );
}
