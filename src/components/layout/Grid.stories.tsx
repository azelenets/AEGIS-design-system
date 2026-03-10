import type { Meta } from '@storybook/react-vite';
import Grid, { GridItem } from './Grid';

const meta: Meta<typeof Grid> = { title: 'Layout/Grid', component: Grid, parameters: { layout: 'padded' } };
export default meta;

const Cell = ({ label, dim }: { label: string; dim?: boolean }) => (
  <div className={[
    'bg-surface-terminal border border-primary/20 p-3 text-[10px] font-mono text-center',
    dim ? 'text-slate-400 border-border-dark' : 'text-primary/60',
  ].join(' ')}>
    {label}
  </div>
);

// ─── Basic columns ─────────────────────────────────────────────────────────

export const TwoColumns = {
  render: () => (
    <Grid cols={2} gap={4}>
      {['Alpha', 'Bravo', 'Charlie', 'Delta'].map((l) => <Cell key={l} label={l} />)}
    </Grid>
  ),
};

export const ThreeColumns = {
  render: () => (
    <Grid cols={3} gap={4}>
      {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((l) => <Cell key={l} label={l} />)}
    </Grid>
  ),
};

export const FourColumns = {
  render: () => (
    <Grid cols={4} gap={4}>
      {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'].map((l) => (
        <Cell key={l} label={l} />
      ))}
    </Grid>
  ),
};

// ─── Column spanning ───────────────────────────────────────────────────────

export const ColSpan = {
  render: () => (
    <Grid cols={12} gap={3}>
      <GridItem span={8}><Cell label="span-8" /></GridItem>
      <GridItem span={4}><Cell label="span-4" /></GridItem>
      <GridItem span={6}><Cell label="span-6" /></GridItem>
      <GridItem span={6}><Cell label="span-6" /></GridItem>
      <GridItem span={4}><Cell label="span-4" /></GridItem>
      <GridItem span={4}><Cell label="span-4" /></GridItem>
      <GridItem span={4}><Cell label="span-4" /></GridItem>
      <GridItem span="full"><Cell label="span-full" /></GridItem>
    </Grid>
  ),
};

// ─── Row spanning ──────────────────────────────────────────────────────────

export const RowSpan = {
  render: () => (
    <Grid cols={3} gap={3}>
      <GridItem rowSpan={2}><Cell label="row-span-2" /></GridItem>
      <Cell label="1×1" />
      <Cell label="1×1" />
      <Cell label="1×1" />
      <Cell label="1×1" />
    </Grid>
  ),
};

// ─── Dashboard layout ──────────────────────────────────────────────────────

export const DashboardLayout = {
  render: () => (
    <Grid cols={12} gap={4}>
      {/* Stat row */}
      <GridItem span={3}><Cell label="Stat A" /></GridItem>
      <GridItem span={3}><Cell label="Stat B" /></GridItem>
      <GridItem span={3}><Cell label="Stat C" /></GridItem>
      <GridItem span={3}><Cell label="Stat D" /></GridItem>

      {/* Main + sidebar */}
      <GridItem span={8}><div className="bg-surface-terminal border border-primary/20 h-40 flex items-center justify-center text-[10px] font-mono text-primary/60">Main Chart</div></GridItem>
      <GridItem span={4}><div className="bg-surface-terminal border border-primary/20 h-40 flex items-center justify-center text-[10px] font-mono text-slate-400">Side Panel</div></GridItem>

      {/* Footer row */}
      <GridItem span="full"><Cell label="Full-width footer strip" /></GridItem>
    </Grid>
  ),
};

// ─── Responsive ────────────────────────────────────────────────────────────

export const Responsive = {
  render: () => (
    <Grid cols={1} colsSm={2} colsMd={3} colsLg={4} gap={4}>
      {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'].map((l) => (
        <Cell key={l} label={l} />
      ))}
    </Grid>
  ),
};

// ─── Gap variants ──────────────────────────────────────────────────────────

export const AsymmetricGap = {
  render: () => (
    <Grid cols={3} gapX={8} gapY={2}>
      {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((l) => <Cell key={l} label={l} />)}
    </Grid>
  ),
};
