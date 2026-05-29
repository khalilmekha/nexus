/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c2d4ff',
          300: '#94b3fd',
          400: '#6089fa',
          500: '#3b63f6',
          600: '#2445eb',
          700: '#1c35d8',
          800: '#1e2faf',
          900: '#1e2d8a',
          950: '#161d5b',
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
        warning: { 400: '#fb923c', 500: '#f97316', 600: '#ea580c' },
        danger:  { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
        accent:  { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
      },
      boxShadow: {
        'glow':    '0 0 20px rgba(59,99,246,0.3)',
        'card':    '0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
        'card-lg': '0 4px 6px rgba(0,0,0,0.05), 0 16px 48px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'spin-slow':  'spin 3s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
