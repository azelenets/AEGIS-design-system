import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Table, { type TableColumn, type SortDirection } from './Table';
import Badge from '@/components/atoms/Badge';

const meta: Meta<typeof Table> = {
  title: 'Organisms/Table',
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

// ─── Shared data ─────────────────────────────────────────────────────────────

type Operator = {
  id: string;
  callSign: string;
  clearance: string;
  sector: string;
  status: 'active' | 'standby' | 'offline';
  lastSeen: string;
};

const operators: Operator[] = [
  { id: 'OP-001', callSign: 'GHOST', clearance: 'Omega', sector: 'Alpha-7', status: 'active', lastSeen: '02:14 UTC' },
  { id: 'OP-002', callSign: 'RAVEN', clearance: 'Beta', sector: 'Delta-3', status: 'standby', lastSeen: '01:58 UTC' },
  { id: 'OP-003', callSign: 'WRAITH', clearance: 'Alpha', sector: 'Sigma-1', status: 'offline', lastSeen: '23:40 UTC' },
  { id: 'OP-004', callSign: 'CIPHER', clearance: 'Omega', sector: 'Alpha-7', status: 'active', lastSeen: '02:17 UTC' },
  { id: 'OP-005', callSign: 'VIPER', clearance: 'Beta', sector: 'Echo-9', status: 'standby', lastSeen: '00:52 UTC' },
];

const STATUS_BADGE: Record<Operator['status'], { label: string; variant: 'primary' | 'hazard' | 'ghost' }> = {
  active: { label: 'Active', variant: 'primary' },
  standby: { label: 'Standby', variant: 'hazard' },
  offline: { label: 'Offline', variant: 'ghost' },
};

const columns: TableColumn<Operator>[] = [
  { key: 'id', header: 'ID', width: '90px', sortable: true },
  { key: 'callSign', header: 'Call Sign', sortable: true },
  { key: 'clearance', header: 'Clearance', sortable: true },
  { key: 'sector', header: 'Sector' },
  {
    key: 'status',
    header: 'Status',
    width: '110px',
    render: (val) => {
      const s = val as Operator['status'];
      const cfg = STATUS_BADGE[s];
      return <Badge label={cfg.label} variant={cfg.variant} dot />;
    },
  },
  { key: 'lastSeen', header: 'Last Seen', align: 'right' },
];

const SortableTableStory = () => {
  const [sortKey, setSortKey] = useState<string>('id');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const sorted = [...operators].sort((a, b) => {
    const av = a[sortKey as keyof Operator];
    const bv = b[sortKey as keyof Operator];
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <Table
      columns={columns}
      data={sorted}
      keyField="id"
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={(key, dir) => { setSortKey(key); setSortDir(dir); }}
      striped
    />
  );
};

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  decorators: [
    () => <Table columns={columns} data={operators} keyField="id" />,
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('table')).toBeInTheDocument();
    await expect(canvas.getByText('GHOST')).toBeVisible();
    await expect(canvas.getByText('VIPER')).toBeVisible();
    await expect(canvas.getByText('Last Seen')).toBeVisible();
  },
};

export const Striped: Story = {
  decorators: [
    () => <Table columns={columns} data={operators} keyField="id" striped />,
  ],
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByText('RAVEN').closest('tr');

    await expect(row).toHaveClass('bg-surface-terminal/50');
  },
};

export const WithCaption: Story = {
  decorators: [
    () => (
      <Table
        columns={columns}
        data={operators}
        keyField="id"
        caption="AEGIS // Operator Registry // Sector Alpha-7"
      />
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('AEGIS // Operator Registry // Sector Alpha-7')).toBeVisible();
  },
};

export const Empty: Story = {
  decorators: [
    () => (
      <Table
        columns={columns}
        data={[]}
        keyField="id"
        emptyLabel="No operators on record"
        emptyIcon="person_off"
      />
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyIcon = canvasElement.querySelector('svg.material-symbols_person_off');

    await expect(canvas.getByText('No operators on record')).toBeVisible();
    await expect(emptyIcon).toBeInTheDocument();
  },
};

export const WithSorting: Story = {
  decorators: [
    () => <SortableTableStory />,
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const callSignHeader = canvas.getByText('Call Sign').closest('th');
    const rows = () => canvas.getAllByRole('row').slice(1);

    await userEvent.click(callSignHeader as HTMLElement);
    await expect(rows()[0]).toHaveTextContent('CIPHER');
    await userEvent.click(callSignHeader as HTMLElement);
    await expect(rows()[0]).toHaveTextContent('WRAITH');
    await expect(callSignHeader?.querySelector('.text-primary')).toBeInTheDocument();
  },
};
