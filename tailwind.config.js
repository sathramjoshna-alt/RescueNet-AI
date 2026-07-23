/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aurora Blue + Emerald theme
        'aurora-dark':  '#0b1628',
        'aurora-mid':   '#0f2040',
        'aurora-light': '#163356',
        'aurora-blue':  '#1a4a8a',
        'sky-blue':     '#2d6fbd',
        'horizon':      '#3b82f6',
        'emerald-glow': '#10b981',
        'emerald-soft': '#34d399',
        'teal-accent':  '#06b6d4',
        'violet-soft':  '#818cf8',
        'amber-warm':   '#f59e0b',
        'rose-alert':   '#f43f5e',
        // Legacy compat
        'space-dark':   '#0b1628',
        'space-blue':   '#0f2040',
        'neon-blue':    '#3b82f6',
        'neon-purple':  '#818cf8',
        'neon-cyan':    '#06b6d4',
        'neon-green':   '#10b981',
        'neon-red':     '#f43f5e',
        'neon-orange':  '#f59e0b',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter':    ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 20s linear infinite',
        'float':        'float 6s ease-in-out infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'orbit':        'orbit 10s linear infinite',
        'aurora-shift': 'auroraShift 8s ease infinite',
        'slide-up':     'slideUp 0.4s ease forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'count-up':     'pulse 1s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f666' },
          '100%': { boxShadow: '0 0 20px #3b82f6, 0 0 40px #3b82f633' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        auroraShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card':    '0 4px 24px rgba(11,22,40,0.5), 0 1px 4px rgba(59,130,246,0.1)',
        'glow-sm': '0 0 12px rgba(59,130,246,0.25)',
        'glow-em': '0 0 12px rgba(16,185,129,0.25)',
        'glow-rd': '0 0 12px rgba(244,63,94,0.3)',
      },
    },
  },
  plugins: [],
}
