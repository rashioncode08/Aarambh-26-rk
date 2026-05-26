"use client";
import React from 'react';
import Hero from './Hero';
import WhatIsAarambh from './WhatIsAarambh';

export default function AboutSection() {
  return (
    <div id="about" className="w-full flex flex-col bg-brand-cloud text-brand-ink overflow-hidden">
      <Hero />
      <WhatIsAarambh />
    </div>
  );
}
