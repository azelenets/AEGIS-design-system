# AEGIS Design System Memory

## Stack
- React 19 + TypeScript, Vite 6, Storybook 10 (port 6007), dev on port 3001
- Tailwind CSS via CDN in Storybook; consuming apps extend `aegisTailwindTheme`
- Icons: Material Symbols Outlined (`<span class="material-symbols-outlined">icon_name</span>`)
- Fonts: JetBrains Mono (mono), Orbitron (display), Space Grotesk (grotesk)

## Component Conventions
- All components: `memo()`-wrapped, TypeScript interface exported as `XyzProps`
- Color variants always use color-map objects (not inline conditionals)
- Storybook story title format: `'Category/ComponentName'`
- Story files: `ComponentName.stories.tsx` beside the component

## Primitives (added 2026-03-09)
Located at `src/components/primitives/`:
- `Button` — variants: primary/secondary/ghost/danger; sizes: sm/md/lg; loading/icon support
- `Badge` — variants: primary/hazard/alert/success/ghost; optional pulsing dot
- `Input` — label, error, hint, icon (left-side Material Symbol)
- `Textarea` — label, error, hint; resizable
- `Select` — label, error, hint, placeholder; typed `SelectOption[]`
- `Divider` — horizontal (with optional label) or vertical; variants: primary/hazard/ghost
- `Spinner` — sizes sm/md/lg; variants: primary/hazard/alert/ghost; optional label
- `Alert` — variants: info/warning/danger/success; optional title + onDismiss
- `Tooltip` — placements: top/bottom/left/right; hover-triggered, no library dep
- `Avatar` — src/initials/icon fallback; sizes sm/md/lg/xl; status dot: online/offline/busy
- `Form` + `FormSection` + `FormRow` + `FormActions` — form layout system; FormRow cols 1–4; FormActions align left/right/center
- `Table` — generic typed `TableColumn<T>[]` + `data: T[]`; sortable columns (controlled via `onSort`/`sortKey`/`sortDir`); `striped`, `emptyLabel`, `emptyIcon`, `caption`; memo wrapping preserves generics via `as typeof TableInner`

## Design Tokens
- primary: `#00f3ff` (cyan), hazard: `#facc15` (yellow), alert: `#ff003c` (red)
- bg-dark: `#050505`, panel-dark: `#0a0a0a`, surface-terminal: `#0d1117`, border-dark: `#1a1a1a`
- Global CSS classes: `.cyber-grid`, `.scanlines`, `.hud-border`, `.hazard-stripe`, `.primary-stripe`, `.slanted-clip`, `.glitch-img`
