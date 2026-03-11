/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx,html}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        hazard: 'rgb(var(--color-hazard) / <alpha-value>)',
        alert: 'rgb(var(--color-alert) / <alpha-value>)',
        'bg-dark': 'rgb(var(--color-bg-dark) / <alpha-value>)',
        'panel-dark': 'rgb(var(--color-panel-dark) / <alpha-value>)',
        'border-dark': 'rgb(var(--color-border-dark) / <alpha-value>)',
        'surface-terminal': 'rgb(var(--color-surface-terminal) / <alpha-value>)',
        experimental: '#ff3e3e',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};
