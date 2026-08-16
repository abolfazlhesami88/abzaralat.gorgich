// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: 'hsl(var(--color-white))',
        background: 'hsl(var(--color-background))',
        gold: {
          DEFAULT: 'hsl(var(--color-gold))',
          hover: 'hsl(var(--color-gold-hover))',
          light: 'hsl(var(--color-gold-light))',
          dark: 'hsl(var(--color-gold-dark))',
        },
        surface: 'hsl(var(--color-surface))',
        border: {
          DEFAULT: 'hsl(var(--color-border))',
          gold: 'hsl(var(--color-border-gold))',
        },
        text: {
          primary: 'hsl(var(--color-text-primary))',
          secondary: 'hsl(var(--color-text-secondary))',
          muted: 'hsl(var(--color-text-muted))',
        },
        success: 'hsl(var(--color-success))',
        danger: 'hsl(var(--color-danger))',
        warning: 'hsl(var(--color-warning))',
      },
      fontFamily: {
        display: ['Vazirmatn', 'sans-serif'],
        body: ['Vazirmatn', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        hero: ['64px', { lineHeight: '1.1', letterSpacing: '-1px', fontWeight: '700' }],
        h1: ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        button: 'var(--radius-button)',
        card: 'var(--radius-card)',
        modal: 'var(--radius-modal)',
        badge: 'var(--radius-badge)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
        'gold-glow': 'var(--shadow-gold-glow)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
} satisfies Config;
