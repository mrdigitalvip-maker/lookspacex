import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          50: 'var(--color-space-50)',
          100: 'var(--color-space-100)',
          200: 'var(--color-space-200)',
          300: 'var(--color-space-300)',
          400: 'var(--color-space-400)',
          500: 'var(--color-space-500)',
          600: 'var(--color-space-600)',
          700: 'var(--color-space-700)',
          800: 'var(--color-space-800)',
          900: 'var(--color-space-900)',
        },
        nebula: {
          purple: 'var(--color-nebula-purple)',
          cyan: 'var(--color-nebula-cyan)',
          pink: 'var(--color-nebula-pink)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Menlo', 'monospace'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(0, 255, 136, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(0, 255, 136, 1)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
    },
  },
  plugins: [],
}

export default config
