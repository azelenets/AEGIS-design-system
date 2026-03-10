# AEGIS Design System

AEGIS is a standalone tactical UI workspace. It packages the production visual language into reusable foundations, components, and Storybook stories.

## Scope

- Shared design tokens for color, typography, and motion
- Global tactical surface styles (`cyber-grid`, `hud-border`, scanlines, terminal chrome)
- Primitive components covering all baseline UI needs
- Storybook-documented components ported from the current site
- A small Vite showcase app for quick inspection outside Storybook

## Components

### Primitives

Foundational UI building blocks that match the AEGIS visual language.

| Component | Description |
|-----------|-------------|
| `Button` | Action trigger — variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; `loading` and `icon` support |
| `Badge` | Inline status label — variants: `primary`, `hazard`, `alert`, `success`, `ghost`; optional pulsing dot |
| `Input` | Single-line text field with `label`, `error`, `hint`, and left-side icon |
| `Textarea` | Multi-line text field with `label`, `error`, and `hint` |
| `Select` | Dropdown with typed `SelectOption[]`, `label`, `error`, and `placeholder` |
| `Divider` | Horizontal separator (with optional label) or vertical rule — variants: `primary`, `hazard`, `ghost` |
| `Spinner` | Loading indicator — sizes: `sm`, `md`, `lg`; variants: `primary`, `hazard`, `alert`, `ghost`; optional label |
| `Alert` | Notification banner — variants: `info`, `warning`, `danger`, `success`; optional title and dismiss handler |
| `Tooltip` | Hover tooltip — placements: `top`, `bottom`, `left`, `right`; no external dependencies |
| `Avatar` | User/entity display with `src`, `initials`, or icon fallback; sizes: `sm`, `md`, `lg`, `xl`; `online`/`offline`/`busy` status dot |
| `Form` | `<form>` wrapper; compose with `FormSection`, `FormRow`, `FormActions` sub-components |
| `FormSection` | Groups fields with a title, optional description, and a bottom divider |
| `FormRow` | Responsive CSS grid row — `cols` 1–4 |
| `FormActions` | Footer action bar with `left / right / center` alignment |
| `Table` | Typed data table with column definitions, optional sorting, striped rows, and empty state |

### Domain components

| Category | Components |
|----------|-----------|
| Dashboard | `StatCard`, `StatBlock` |
| Layout | `PageHeader` |
| Arsenal | `FilterButton`, `TechItem`, `SpecCard` |
| Laboratory | `LabCard` |
| Mission Log | `MissionItem` |
| Credentials | `CertCard`, `SkillGroup`, `EducationEntry` |
| Protocols | `ProtocolCard` |

## Local usage

```bash
npm install
npm run storybook   # http://localhost:6007
npm run dev         # http://localhost:3001
```

## Foundation exports

`src/foundations/aegisTheme.ts` exports:

- `aegisTailwindTheme` — extend your Tailwind config with AEGIS tokens
- `aegisTokens` — direct token access for docs or glue code

**Color tokens:**

| Token | Value | Role |
|-------|-------|------|
| `primary` | `#00f3ff` | Cyan — main accent |
| `hazard` | `#facc15` | Yellow — warnings |
| `alert` | `#ff003c` | Red — critical/danger |
| `bg-dark` | `#050505` | Main background |
| `panel-dark` | `#0a0a0a` | Panel surfaces |
| `surface-terminal` | `#0d1117` | Terminal surfaces |
| `border-dark` | `#1a1a1a` | Borders |

**Global CSS utilities** (from `src/foundations/globals.css`):

| Class | Effect |
|-------|--------|
| `.cyber-grid` | Repeating cyan grid background |
| `.scanlines` | CRT scanline overlay |
| `.hud-border` | Tactical HUD corner brackets |
| `.hazard-stripe` | Yellow/black diagonal stripes |
| `.primary-stripe` | Cyan/black diagonal stripes |
| `.slanted-clip` | 10° polygon clip path |
| `.glitch-img` | Desaturated glitch filter |

## Notes

- This workspace intentionally mirrors the current production styling, including the CDN Tailwind setup used by the main project.
- If you want this moved to a sibling folder outside the repo or promoted into a monorepo package, the structure is ready for that next step.
