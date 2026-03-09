export const aegisTailwindTheme = {
  colors: {
    primary: '#00f3ff',
    hazard: '#facc15',
    alert: '#ff003c',
    'bg-dark': '#050505',
    'panel-dark': '#0a0a0a',
    'border-dark': '#1a1a1a',
    'surface-terminal': '#0d1117',
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
} as const;

export const aegisTokens = {
  colors: {
    background: '#050505',
    panel: '#0a0a0a',
    terminal: '#0d1117',
    primary: '#00f3ff',
    hazard: '#facc15',
    alert: '#ff003c',
    border: '#1a1a1a',
    text: '#cbd5e1',
  },
  fonts: {
    mono: 'JetBrains Mono, monospace',
    display: 'Orbitron, sans-serif',
    grotesk: 'Space Grotesk, sans-serif',
  },
} as const;
