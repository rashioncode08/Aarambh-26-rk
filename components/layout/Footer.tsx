'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

const LocationIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const FacebookIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const InstagramIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ArrowUpIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.2" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const HeartIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`inline-block ${className}`}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white border-t-4 border-brand-ink py-16 px-6 overflow-hidden select-none">
      
      {/* 3-Column Neobrutalist Grid */}
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* COLUMN 1: CONTACT US */}
        <div className="space-y-4">
          <div>
            <h4 className="text-brand-ink font-display font-black text-sm uppercase tracking-widest">
              Contact Us
            </h4>
            <div className="w-12 h-1 bg-brand-orange mt-2 rounded-full" />
          </div>
          
          <ul className="space-y-4 text-xs font-mono text-brand-ink leading-relaxed font-bold">
            <li className="flex items-start gap-3">
              <LocationIcon className="text-brand-pink shrink-0 mt-0.5" size={18} />
              <span>
                JK Lakshmipat University, Near Mahindra SEZ, Ajmer Road, Jaipur, Rajasthan 302026
              </span>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="text-brand-pink shrink-0" size={16} />
              <a href="tel:+911417107500" className="hover:text-brand-pink transition-colors">
                +91 141 7107500
              </a>
            </li>
            <li className="flex items-center gap-3">
              <EmailIcon className="text-brand-pink shrink-0" size={16} />
              <a href="mailto:info@jklu.edu.in" className="hover:text-brand-pink transition-colors">
                info@jklu.edu.in
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 2: QUICK LINKS */}
        <div className="space-y-4">
          <div>
            <h4 className="text-brand-ink font-display font-black text-sm uppercase tracking-widest">
              Quick Links
            </h4>
            <div className="w-12 h-1 bg-brand-orange mt-2 rounded-full" />
          </div>
          
          <ul className="grid grid-cols-1 gap-2 text-xs font-mono text-brand-ink/80 font-bold">
            <li>
              <Link href="/about" className="hover:text-brand-pink transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/schedule" className="hover:text-brand-pink transition-colors">
                Schedule
              </Link>
            </li>
            <li>
              <Link href="/speakers" className="hover:text-brand-pink transition-colors">
                Speakers
              </Link>
            </li>
            <li>
              <a 
                href="https://jklu.edu.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-brand-pink transition-colors"
              >
                University Website
              </a>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-pink transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-pink transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-brand-pink transition-colors">
                Refund & Cancellation Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-brand-pink transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: FOLLOW US */}
        <div className="space-y-4">
          <div>
            <h4 className="text-brand-ink font-display font-black text-sm uppercase tracking-widest">
              Follow Us
            </h4>
            <div className="w-12 h-1 bg-brand-orange mt-2 rounded-full" />
          </div>
          
          <div className="flex gap-3">
            <a 
              href="#" 
              aria-label="Facebook"
              className="w-10 h-10 bg-white border-2 border-brand-ink text-brand-ink hover:bg-brand-blue hover:text-white active:translate-y-1 transition-all rounded-md flex justify-center items-center shadow-[3px_3px_0px_0px_#030404] cursor-pointer"
            >
              <FacebookIcon size={18} />
            </a>
            <a 
              href="#" 
              aria-label="X (Twitter)"
              className="w-10 h-10 bg-white border-2 border-brand-ink text-brand-ink hover:bg-brand-pink hover:text-white active:translate-y-1 transition-all rounded-md flex justify-center items-center shadow-[3px_3px_0px_0px_#030404] cursor-pointer"
            >
              <XIcon size={16} />
            </a>
            <a 
              href="#" 
              aria-label="Instagram"
              className="w-10 h-10 bg-white border-2 border-brand-ink text-brand-ink hover:bg-brand-orange hover:text-white active:translate-y-1 transition-all rounded-md flex justify-center items-center shadow-[3px_3px_0px_0px_#030404] cursor-pointer"
            >
              <InstagramIcon size={18} />
            </a>
            <a 
              href="#" 
              aria-label="LinkedIn"
              className="w-10 h-10 bg-white border-2 border-brand-ink text-brand-ink hover:bg-brand-blue hover:text-white active:translate-y-1 transition-all rounded-md flex justify-center items-center shadow-[3px_3px_0px_0px_#030404] cursor-pointer"
            >
              <LinkedInIcon size={18} />
            </a>
          </div>
        </div>

      </div>

      {/* LOCATION TITLE & MAP CONTAINER */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center my-10 space-y-2">
          <h3 className="text-2xl font-display font-black tracking-widest uppercase text-brand-ink">
            Location
          </h3>
          <div className="w-24 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="w-full border-4 border-brand-ink shadow-[8px_8px_0px_0px_#030404] rounded-lg overflow-hidden h-80 mb-10 transform hover:scale-[1.002] transition-transform duration-250">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.1052887370965!2d75.64772927502109!3d26.83660327669258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4af4fe68f403%3A0x3bf05f95df22b8c4!2sJK%20Lakshmipat%20University!5e0!3m2!1sen!2sin!4v1779876968774!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="JK Lakshmipat University Map Location"
            id="jklu-map-iframe"
          />
        </div>
      </div>

      {/* DESIGNED AND DEVELOPED BY */}
      <div className="text-center text-xs md:text-sm font-mono text-brand-ink/65 tracking-wider font-bold mb-10 max-w-7xl mx-auto border-b-2 border-brand-ink/10 pb-6 flex items-center justify-center gap-1.5 uppercase">
        <Link 
          href="/credits" 
          className="hover:text-brand-pink transition-colors flex items-center gap-1.5 cursor-pointer"
          id="tech-credits-link"
        >
          Designed and Developed with{" "}
          <HeartIcon className="text-brand-pink shrink-0 animate-pulse" size={14} />{" "}
          by Tech Team
        </Link>
      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-mono text-brand-ink/65">
        <div className="text-center md:text-left font-bold">
          &copy; 2026 Aarambh - JK Lakshmipat University. All rights reserved.
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="cursor-pointer transition-transform hover:scale-[1.03] active:scale-95 flex">
            <Image
              src="/logo.svg"
              alt="Aarambh '26 Logo"
              width={834}
              height={193}
              className="h-10 w-auto opacity-95 object-contain"
              style={{ width: 'auto', height: '40px' }}
              priority
            />
          </Link>
          <a 
            href="https://jklu.edu.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cursor-pointer transition-transform hover:scale-[1.03] active:scale-95 flex"
          >
            <Image
              src="/jklu_logo.svg"
              alt="JK Lakshmipat University Logo"
              width={120}
              height={40}
              className="h-12 w-auto opacity-95 object-contain"
              style={{ width: 'auto', height: '48px' }}
              priority
            />
          </a>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-brand-pink text-white border-2 border-brand-ink shadow-[3px_3px_0px_0px_#030404] hover:bg-brand-orange active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#030404] transition-all rounded-md flex justify-center items-center cursor-pointer"
            aria-label="Scroll back to top"
            id="scroll-to-top-btn"
          >
            <ArrowUpIcon size={20} />
          </button>
        </div>
      </div>

    </footer>
  );
}
