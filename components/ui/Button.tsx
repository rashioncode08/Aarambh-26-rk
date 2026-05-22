import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-blue',
    accent: 'btn-accent',
    glass:
      'glass-card px-6 py-2.5 rounded-md text-brand-cloud font-semibold hover:bg-brand-cloud/10 hover:border-brand-pink/30 transition-all',
  };

  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
