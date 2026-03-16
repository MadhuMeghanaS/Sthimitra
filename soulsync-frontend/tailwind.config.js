/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          calm: '#5DADE2',
          dark: '#2E86C1',
          light: '#AED6F1',
          pale: '#EBF5FB',
        },
        lavender: {
          DEFAULT: '#A29BFE',
          dark: '#6C5CE7',
          light: '#D7D3FE',
          pale: '#F3F2FF',
        },
        mint: {
          DEFAULT: '#55E6C1',
          dark: '#1ABC9C',
          light: '#A3F0DC',
          pale: '#EAFAF5',
        },
        soul: {
          bg: '#F4F7FB',
          text: '#2C3E50',
          muted: '#7F8C8D',
          card: '#FFFFFF',
          border: '#E8EEF5',
        }
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", 'Georgia', 'serif'],
        body: ["'Nunito'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      backgroundImage: {
        'soul-gradient': 'linear-gradient(135deg, #5DADE2 0%, #A29BFE 100%)',
        'soul-gradient-soft': 'linear-gradient(135deg, #EBF5FB 0%, #F3F2FF 100%)',
        'hero-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(93,173,226,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(162,155,254,0.15) 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, rgba(85,230,193,0.1) 0%, transparent 50%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
      },
      boxShadow: {
        'soul': '0 4px 24px rgba(93,173,226,0.12), 0 1px 4px rgba(0,0,0,0.04)',
        'soul-hover': '0 16px 48px rgba(93,173,226,0.2), 0 4px 16px rgba(162,155,254,0.1)',
        'soul-card': '0 2px 16px rgba(44,62,80,0.06)',
        'glow-blue': '0 0 32px rgba(93,173,226,0.4)',
        'glow-lavender': '0 0 32px rgba(162,155,254,0.4)',
        'glow-mint': '0 0 32px rgba(85,230,193,0.4)',
        'inner-soft': 'inset 0 1px 3px rgba(0,0,0,0.05)',
      },
      animation: {
        'float': 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite reverse',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' }, '50%': { transform: 'translateY(-22px) rotate(3deg)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(40px) scale(0.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        pulseGlow: { '0%,100%': { opacity: '0.5', transform: 'scale(1)' }, '50%': { opacity: '0.8', transform: 'scale(1.05)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        bounceSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.5rem',
        'xl4': '2rem',
      }
    },
  },
  plugins: [],
}
