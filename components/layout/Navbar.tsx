'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === '/') {
      if (href.startsWith('/#')) {
        e.preventDefault();
        const targetId = href.replace('/#', '');
        const element = document.getElementById(targetId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else if (href === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const leftLinks = [
    { name: 'Home', href: '/' },
    { name: 'Registration', href: '/register' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
  ];

  const rightLinks = [
    { name: 'Schedule', href: '/schedule' },
    { name: 'Rules', href: '/rules' },
    { name: 'About', href: '/#about' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Contact', href: '/contact' },
  ];

  const mobileLinks = [
    { name: 'Home', href: '/' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Rules', href: '/rules' },
    { name: 'About', href: '/#about' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 transition-all duration-300 rounded-full border border-transparent bg-transparent py-3.5 px-6"
      >
        <div className="flex justify-between items-center w-full">
          {/* Mobile View Toggle & Logo */}
          <div className="flex md:hidden justify-between items-center w-full">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo-variations/png/Ink_Black.png"
                alt="AARAMBH'26"
                width={150}
                height={47}
                className="h-8 w-auto hover:scale-105 transition-transform"
                priority
              />
            </Link>

            <button
              className={`border-2 border-brand-ink p-1.5 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_#030404] rounded-md ${
                isMobileMenuOpen 
                  ? 'bg-brand-pink text-brand-cloud shadow-none' 
                  : 'bg-brand-orange text-brand-ink'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Desktop Split Navbar */}
          <div className="hidden md:flex items-center justify-between w-full font-display">
            {/* Left side links */}
            <div className="flex items-center gap-6">
              {leftLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-1 px-3 text-xs font-bold tracking-widest uppercase transition-colors duration-200 ${
                    pathname === link.href ? 'text-brand-pink' : 'text-brand-ink hover:text-brand-pink'
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink rounded-full shadow-[0_0_8px_var(--color-brand-pink)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Center Logo with space on both sides */}
            <div className="flex-shrink-0 mx-10">
              <Link href="/" className="flex items-center" onClick={(e) => handleNavClick(e, '/')}>
                <Image
                  src="/logo-variations/png/Ink_Black.png"
                  alt="AARAMBH'26"
                  width={200}
                  height={63}
                  className="h-10 md:h-12 w-auto hover:scale-105 transition-transform"
                  priority
                />
              </Link>
            </div>

            {/* Right side links */}
            <div className="flex items-center gap-6">
              {rightLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-1 px-3 text-xs font-bold tracking-widest uppercase transition-colors duration-200 ${
                    pathname === link.href ? 'text-brand-pink' : 'text-brand-ink hover:text-brand-pink'
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink rounded-full shadow-[0_0_8px_var(--color-brand-pink)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden absolute top-[calc(100%+0.75rem)] left-0 w-full bg-brand-cloud border-4 border-brand-ink p-6 flex flex-col gap-3 shadow-[8px_8px_0px_0px_#030404] rounded-xl z-50 text-brand-ink"
            >


              {mobileLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-display font-black tracking-wider uppercase transition-all py-2.5 px-3 border-2 border-transparent hover:border-brand-ink hover:bg-brand-orange hover:-translate-y-0.5 rounded-lg flex items-center justify-between group ${
                    pathname === link.href 
                      ? 'text-brand-pink border-brand-ink bg-brand-pink/5' 
                      : 'text-brand-ink hover:text-brand-ink'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-ink font-mono text-xs">→</span>
                </Link>
              ))}

              <Link
                href="/register"
                onClick={(e) => handleNavClick(e, '/register')}
                className={`w-full text-center py-3.5 border-4 border-brand-ink font-display font-black text-xs uppercase tracking-widest transition-all mt-4 shadow-[4px_4px_0px_0px_#030404] active:translate-y-1 active:shadow-none hover:bg-brand-pink hover:text-brand-cloud rounded-lg ${
                  pathname?.startsWith('/register')
                    ? 'text-brand-cloud bg-brand-blue'
                    : 'text-brand-ink bg-brand-orange'
                }`}
              >
                Registration
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

