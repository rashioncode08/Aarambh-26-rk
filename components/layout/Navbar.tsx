'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark/90 backdrop-blur-xl border-b border-brand-cloud/10 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.svg"
            alt="AARAMBH'26"
            width={180}
            height={42}
            className="h-9 md:h-10 w-auto"
            priority
            loading="eager"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/register" className="btn-accent text-sm py-2 px-5">
            Register
          </Link>
        </div>

        <button
          className="md:hidden text-brand-cloud p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-dark/98 backdrop-blur-xl border-b border-brand-pink/20 p-6 flex flex-col gap-5"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-lg font-semibold ${
                pathname === link.href ? 'text-brand-pink' : 'text-brand-cloud/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/register" className="btn-accent w-full text-center py-3">
            Register Now
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
