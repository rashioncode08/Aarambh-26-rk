/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF9A00',
          pink: '#FF188C',
          blue: '#0D21DD',
          ink: '#030404',
          cloud: '#F5F1E5',
        },
        primary: {
          DEFAULT: '#FF188C',
          dark: '#E0107A',
        },
        secondary: {
          DEFAULT: '#0D21DD',
          dark: '#0A1AB8',
        },
        accent: {
          DEFAULT: '#FF9A00',
          dark: '#E68A00',
        },
        dark: {
          DEFAULT: '#030404',
          lighter: '#1a1a1a',
        },
        admin: {
          bg: '#F5F1E5',
          surface: '#ffffff',
          accent: '#FF9A00',
          text: '#030404',
          muted: '#64748b',
          border: '#e2e8f0'
        },
        brand: {
          orange: '#FF9A00',
          pink: '#FF188C',
          blue: '#0D21DD',
          black: '#030404',
          white: '#F5F1E5',
        }
      },
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        sans: ['"Google Sans"', 'Roboto', 'system-ui', 'sans-serif'],
        adminHeading: ['"DM Serif Display"', 'serif'],
        adminBody: ['"DM Sans"', 'sans-serif'],
        premium: ['"Outfit"', 'system-ui', 'sans-serif'],
        vanilla: ['"Vanilla Extract"', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF9A00 0%, #FF188C 50%, #0D21DD 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(255,154,0,0.15) 0%, rgba(255,24,140,0.15) 50%, rgba(13,33,221,0.15) 100%)',
        'glass-gradient': 'linear-gradient(to bottom right, rgba(245, 241, 229, 0.08), rgba(245, 241, 229, 0.03))',
      },
      boxShadow: {
        'brand-pink': '0 0 40px rgba(255, 24, 140, 0.25)',
        'brand-orange': '0 0 40px rgba(255, 154, 0, 0.25)',
        'brand-blue': '0 0 40px rgba(13, 33, 221, 0.25)',
      },
    },
  },
  plugins: [],
}
