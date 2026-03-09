// ─── Tailwind theme extension (CSS-variable-based) ────────────────────────────
// Use this in your Tailwind config's `theme.extend` block.
// Colors reference CSS custom properties so light/dark themes work automatically
// via the [data-theme] attribute managed by ThemeProvider.
//
// The <alpha-value> placeholder enables opacity modifiers:
//   bg-primary/20  →  background-color: rgb(var(--color-primary) / 0.2)

export const aegisTailwindTheme = {
  colors: {
    primary:            'rgb(var(--color-primary)          / <alpha-value>)',
    hazard:             'rgb(var(--color-hazard)           / <alpha-value>)',
    alert:              'rgb(var(--color-alert)            / <alpha-value>)',
    'bg-dark':          'rgb(var(--color-bg-dark)          / <alpha-value>)',
    'panel-dark':       'rgb(var(--color-panel-dark)       / <alpha-value>)',
    'border-dark':      'rgb(var(--color-border-dark)      / <alpha-value>)',
    'surface-terminal': 'rgb(var(--color-surface-terminal) / <alpha-value>)',
    experimental:       '#ff3e3e',
  },
  fontFamily: {
    mono:    ['JetBrains Mono', 'monospace'],
    display: ['Orbitron', 'sans-serif'],
    grotesk: ['Space Grotesk', 'sans-serif'],
  },
  animation: {
    'spin-slow':  'spin 20s linear infinite',
    'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
} as const;

// ─── Raw token values ─────────────────────────────────────────────────────────
// Use these when you need actual hex values (e.g. canvas, SVG, non-Tailwind CSS).

export const aegisTokens = {
  dark: {
    primary:          '#00f3ff',
    hazard:           '#facc15',
    alert:            '#ff003c',
    background:       '#050505',
    panel:            '#0a0a0a',
    surface:          '#0d1117',
    border:           '#1a1a1a',
    text:             '#cbd5e1',
  },
  light: {
    primary:          '#0097a7',
    hazard:           '#b45309',
    alert:            '#be123c',
    background:       '#f8fafc',
    panel:            '#f1f5f9',
    surface:          '#e8eff8',
    border:           '#cbd5e1',
    text:             '#0f172a',
  },
  fonts: {
    mono:    'JetBrains Mono, monospace',
    display: 'Orbitron, sans-serif',
    grotesk: 'Space Grotesk, sans-serif',
  },
} as const;

// ─── CSS variable declarations (inject into :root / [data-theme]) ─────────────
// Paste these into your global CSS. RGB channel format required for opacity modifiers.

export const aegisCSSVars = {
  dark: `
    --color-primary:          0 243 255;
    --color-hazard:           250 204 21;
    --color-alert:            255 0 60;
    --color-bg-dark:          5 5 5;
    --color-panel-dark:       10 10 10;
    --color-border-dark:      26 26 26;
    --color-surface-terminal: 13 17 23;
  `,
  light: `
    --color-primary:          0 151 167;
    --color-hazard:           180 83 9;
    --color-alert:            190 18 60;
    --color-bg-dark:          248 250 252;
    --color-panel-dark:       241 245 249;
    --color-border-dark:      203 213 225;
    --color-surface-terminal: 232 239 248;
  `,
} as const;
