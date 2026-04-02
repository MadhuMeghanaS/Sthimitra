/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Primary (Slate 800) ──
        primary:       '#1E293B',
        'primary-dark':'#0F172A',
        'primary-pale':'#F1F5F9',
        // ── Secondary (Indigo) ──
        secondary:     '#4F46E5',
        'secondary-pale': '#E0E7FF',
        // ── Accent (Blue) ──
        accent:        '#3B82F6',
        'accent-pale': '#DBEAFE',
        // ── Backgrounds ──
        soul: {
          bg:     '#F8FAFC',
          card:   '#FFFFFF',
          text:   '#0F172A',
          muted:  '#64748B',
          border: '#E2E8F0',
        },
        // ── Dark Slate (footer/CTA) ──
        forest:       '#020617',
        'forest-mid': '#1E293B',
        // ── Pastel card backgrounds (muted grays and subtle tints) ──
        'pastel-green':  '#F1F5F9',
        'pastel-purple': '#F8FAFC',
        'pastel-pink':   '#F3F4F6',
        'pastel-blue':   '#F8FAFC',
        'pastel-yellow': '#F9FAFB',
      },
      fontFamily: {
        display: ["'Outfit'", 'system-ui', 'sans-serif'],
        body:    ["'Inter'", 'system-ui', 'sans-serif'],
        serif:   ["'Playfair Display'", 'serif'],
      },
      backgroundImage: {
        'soul-gradient':      'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        'soul-gradient-soft': 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        'hero-mesh':
          'radial-gradient(ellipse at 20% 50%, rgba(79,70,229,0.05) 0%, transparent 60%),' +
          'radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 60%),' +
          'radial-gradient(ellipse at 60% 80%, rgba(15,23,42,0.03) 0%, transparent 50%)',
      },
      boxShadow: {
        soul:        '0 2px 12px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.02)',
        'soul-hover':'0 12px 32px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.03)',
        'soul-card': '0 1px 8px rgba(15,23,42,0.04)',
        'glow-green':'0 0 24px rgba(79,70,229,0.15)',
        'inner-soft':'inset 0 1px 2px rgba(0,0,0,0.02)',
      },
      animation: {
        'float':       'float 7s ease-in-out infinite',
        'float-slow':  'float 11s ease-in-out infinite reverse',
        'fade-up':     'fadeUp 0.6s ease forwards',
        'fade-in':     'fadeIn 0.5s ease forwards',
        'slide-up':    'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-glow':  'pulseGlow 3s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'spin-slow':   'spin 20s linear infinite',
      },
      keyframes: {
        float:      { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },   '50%': { transform: 'translateY(-22px) rotate(3deg)' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(24px)' },        to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:     { from: { opacity: '0' },                                        to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(40px) scale(0.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        pulseGlow:  { '0%,100%': { opacity: '0.5', transform: 'scale(1)' },        '50%': { opacity: '0.8', transform: 'scale(1.05)' } },
        shimmer:    { from: { backgroundPosition: '-200% 0' },                       to: { backgroundPosition: '200% 0' } },
        bounceSoft: { '0%,100%': { transform: 'translateY(0)' },                    '50%': { transform: 'translateY(-8px)' } },
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.5rem', xl4: '2rem' },
    },
  },
  plugins: [],
}