import type { Meta } from '@storybook/react-vite';
import Stack, { HStack, VStack, ZStack, Spacer, Center } from './Stack';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const meta: Meta<typeof Stack> = { title: 'Layout/Stack', component: Stack };
export default meta;

// ─── Shared helpers ───────────────────────────────────────────────────────────

const Box = ({ label, dim }: { label: string; dim?: boolean }) => (
  <div className={[
    'border px-3 py-2 text-[10px] font-mono text-center',
    dim ? 'bg-bg-dark border-border-dark text-slate-400' : 'bg-surface-terminal border-border-dark text-slate-400',
  ].join(' ')}>
    {label}
  </div>
);

const TallBox = ({ label }: { label: string }) => (
  <div className="bg-surface-terminal border border-border-dark px-3 py-6 text-[10px] font-mono text-slate-400">{label}</div>
);

// ─── Stack ────────────────────────────────────────────────────────────────────

export const Vertical = {
  render: () => (
    <Stack gap={3}>
      <Box label="Item A" />
      <Box label="Item B" />
      <Box label="Item C" />
    </Stack>
  ),
};

export const Horizontal = {
  render: () => (
    <Stack direction="row" gap={3} align="center">
      <Box label="Left" />
      <Box label="Center" />
      <Box label="Right" />
    </Stack>
  ),
};

export const SpaceBetween = {
  render: () => (
    <Stack direction="row" justify="between" align="center">
      <Box label="Brand" />
      <Box label="Actions" />
    </Stack>
  ),
};

export const Wrapping = {
  render: () => (
    <div className="max-w-xs">
      <Stack direction="row" wrap gap={2}>
        {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'].map((l) => (
          <Box key={l} label={l} />
        ))}
      </Stack>
    </div>
  ),
};

// ─── HStack ───────────────────────────────────────────────────────────────────

export const HStackDefault = {
  name: 'HStack',
  render: () => (
    <HStack gap={3}>
      <Box label="Alpha" />
      <Box label="Bravo" />
      <Box label="Charlie" />
    </HStack>
  ),
};

export const HStackWithSpacer = {
  name: 'HStack + Spacer',
  render: () => (
    <HStack gap={2} className="w-full border border-border-dark p-3">
      <Badge label="AEGIS" variant="primary" />
      <Badge label="v2.4" variant="ghost" />
      <Spacer />
      <Button variant="ghost" size="sm" icon="notifications">Alerts</Button>
      <Button variant="secondary" size="sm" icon="person">Operator</Button>
    </HStack>
  ),
};

export const HStackAlignments = {
  name: 'HStack — align variants',
  render: () => (
    <VStack gap={4}>
      {(['start', 'center', 'end', 'stretch'] as const).map(align => (
        <div key={align}>
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">align="{align}"</p>
          <HStack gap={2} align={align} className="border border-border-dark p-2">
            <Box label="Short" />
            <TallBox label="Tall" />
            <Box label="Short" />
          </HStack>
        </div>
      ))}
    </VStack>
  ),
};

// ─── VStack ───────────────────────────────────────────────────────────────────

export const VStackDefault = {
  name: 'VStack',
  render: () => (
    <div className="max-w-xs">
      <VStack gap={3}>
        <Box label="First" />
        <Box label="Second" />
        <Box label="Third" />
      </VStack>
    </div>
  ),
};

export const VStackWithSpacer = {
  name: 'VStack + Spacer (sidebar pattern)',
  render: () => (
    <div className="w-48 h-64 border border-border-dark bg-panel-dark flex">
      <VStack gap={1} className="w-full p-2">
        <Box label="Nav Item 1" />
        <Box label="Nav Item 2" />
        <Box label="Nav Item 3" />
        <Spacer />
        <Box label="Settings" />
      </VStack>
    </div>
  ),
};

// ─── ZStack ───────────────────────────────────────────────────────────────────

export const ZStackDefault = {
  name: 'ZStack — layered content',
  render: () => (
    <ZStack className="w-64 h-32 border border-border-dark">
      {/* Background layer */}
      <div className="w-full h-full bg-surface-terminal cyber-grid" />
      {/* Overlay layer */}
      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
      {/* Content layer */}
      <Center className="w-full h-full">
        <div className="text-center">
          <p className="font-display text-sm font-bold text-primary tracking-widest uppercase">AEGIS</p>
          <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest">Tactical Grid</p>
        </div>
      </Center>
    </ZStack>
  ),
};

export const ZStackBadgeOverlay = {
  name: 'ZStack — badge overlay',
  render: () => (
    <HStack gap={6} align="start">
      {(['top-right corner badge', 'status dot', 'count pill'] as const).map((label, i) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{label}</p>
          <ZStack align="start" className="inline-grid">
            {/* Base element */}
            <div className="w-12 h-12 bg-surface-terminal border border-border-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-slate-400">
                {i === 0 ? 'notifications' : i === 1 ? 'person' : 'mail'}
              </span>
            </div>
            {/* Overlay element */}
            <div className="justify-self-end self-start translate-x-1/2 -translate-y-1/2">
              {i === 0 && <Badge label="NEW" variant="alert" solid />}
              {i === 1 && <span className="block w-2.5 h-2.5 rounded-full bg-primary border-2 border-bg-dark" />}
              {i === 2 && <span className="block px-1 py-0.5 text-[8px] font-bold font-mono bg-hazard text-bg-dark leading-none">12</span>}
            </div>
          </ZStack>
        </div>
      ))}
    </HStack>
  ),
};

export const ZStackAlignments = {
  name: 'ZStack — align variants',
  render: () => (
    <HStack gap={4} align="start" wrap>
      {(['start', 'center', 'end'] as const).map(align => (
        <div key={align} className="flex flex-col items-center gap-2">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">align="{align}"</p>
          <ZStack align={align} className="w-24 h-24 border border-border-dark bg-surface-terminal">
            <div className="w-full h-full" />
            <div className="w-10 h-10 bg-primary/20 border border-primary/40" />
          </ZStack>
        </div>
      ))}
    </HStack>
  ),
};

// ─── Spacer ───────────────────────────────────────────────────────────────────

export const SpacerExample = {
  name: 'Spacer',
  render: () => (
    <VStack gap={3}>
      <div>
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">HStack with Spacer</p>
        <HStack gap={2} className="border border-border-dark p-2 w-full">
          <Box label="Logo" />
          <Spacer />
          <Box label="Action A" />
          <Box label="Action B" />
        </HStack>
      </div>
      <div>
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">Multiple Spacers (equal distribution)</p>
        <HStack gap={0} className="border border-border-dark p-2 w-full">
          <Box label="A" />
          <Spacer />
          <Box label="B" />
          <Spacer />
          <Box label="C" />
          <Spacer />
          <Box label="D" />
        </HStack>
      </div>
    </VStack>
  ),
};

// ─── Center ───────────────────────────────────────────────────────────────────

export const CenterExample = {
  name: 'Center',
  render: () => (
    <Center className="h-32 border border-border-dark bg-surface-terminal">
      <div className="text-center">
        <p className="font-display text-sm font-bold text-primary tracking-widest uppercase">Centered</p>
        <p className="text-[9px] font-mono text-slate-400 mt-1">Both axes</p>
      </div>
    </Center>
  ),
};

// ─── Combined ─────────────────────────────────────────────────────────────────

export const AppShell = {
  name: 'Combined — app shell',
  render: () => (
    <VStack gap={0} className="border border-border-dark h-64 w-full overflow-hidden">
      {/* Navbar */}
      <HStack gap={2} className="border-b border-border-dark bg-panel-dark px-3 h-10 shrink-0">
        <span className="font-display text-xs font-bold text-primary tracking-widest uppercase">AEGIS</span>
        <Spacer />
        <Badge label="ONLINE" variant="primary" dot />
      </HStack>
      {/* Body */}
      <HStack gap={0} align="stretch" className="flex-1 min-h-0">
        {/* Sidebar */}
        <VStack gap={1} className="border-r border-border-dark bg-panel-dark w-28 p-2 shrink-0">
          {['Dashboard', 'Missions', 'Intel', 'Lab'].map(l => (
            <Box key={l} label={l} />
          ))}
          <Spacer />
          <Box label="Settings" dim />
        </VStack>
        {/* Main */}
        <Center className="flex-1 bg-bg-dark">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Main content area</p>
        </Center>
      </HStack>
    </VStack>
  ),
};
