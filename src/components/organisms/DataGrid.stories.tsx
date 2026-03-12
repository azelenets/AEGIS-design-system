import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import DataGrid, { type DataGridColumn } from './DataGrid';
import Badge from '@/components/atoms/Badge';
import MaterialIcon from '@/components/atoms/MaterialIcon';

const meta: Meta<typeof DataGrid> = { title: 'Organisms/DataGrid', component: DataGrid };
export default meta;

// ─── Dataset ──────────────────────────────────────────────────────────────────

type Operator = {
  id: string;
  callSign: string;
  clearance: 'Alpha' | 'Beta' | 'Omega' | 'Sigma';
  sector: string;
  status: 'active' | 'standby' | 'offline';
  threats: number;
  lastSeen: string;
  notes: string;
};

const operators: Operator[] = [
  { id: 'OP-001', callSign: 'GHOST',   clearance: 'Omega', sector: 'Alpha-7',  status: 'active',  threats: 14, lastSeen: '02:14 UTC', notes: 'Lead recon operative for northern grid.' },
  { id: 'OP-002', callSign: 'RAVEN',   clearance: 'Beta',  sector: 'Delta-3',  status: 'standby', threats: 3,  lastSeen: '01:58 UTC', notes: 'On standby pending sector clearance.' },
  { id: 'OP-003', callSign: 'WRAITH',  clearance: 'Alpha', sector: 'Sigma-1',  status: 'offline', threats: 0,  lastSeen: '23:40 UTC', notes: 'Last check-in failed. Status unknown.' },
  { id: 'OP-004', callSign: 'CIPHER',  clearance: 'Omega', sector: 'Alpha-7',  status: 'active',  threats: 8,  lastSeen: '02:17 UTC', notes: 'Handling encrypted comms layer.' },
  { id: 'OP-005', callSign: 'VIPER',   clearance: 'Beta',  sector: 'Echo-9',   status: 'standby', threats: 1,  lastSeen: '00:52 UTC', notes: 'Monitoring Echo sector perimeter.' },
  { id: 'OP-006', callSign: 'SPECTER', clearance: 'Sigma', sector: 'Bravo-2',  status: 'active',  threats: 21, lastSeen: '02:20 UTC', notes: 'High-priority exfil assignment.' },
  { id: 'OP-007', callSign: 'ATLAS',   clearance: 'Alpha', sector: 'Charlie-5',status: 'offline', threats: 0,  lastSeen: '20:11 UTC', notes: 'Equipment failure reported in Charlie-5.' },
  { id: 'OP-008', callSign: 'NOVA',    clearance: 'Beta',  sector: 'Delta-3',  status: 'active',  threats: 5,  lastSeen: '02:09 UTC', notes: 'Secondary support for RAVEN.' },
  { id: 'OP-009', callSign: 'VECTOR',  clearance: 'Omega', sector: 'Sigma-1',  status: 'active',  threats: 17, lastSeen: '02:22 UTC', notes: 'Coordinating multi-sector sweep.' },
  { id: 'OP-010', callSign: 'LYNX',    clearance: 'Sigma', sector: 'Echo-9',   status: 'standby', threats: 2,  lastSeen: '01:30 UTC', notes: 'Awaiting extraction window.' },
  { id: 'OP-011', callSign: 'FALCON',  clearance: 'Alpha', sector: 'Alpha-7',  status: 'active',  threats: 9,  lastSeen: '02:18 UTC', notes: 'Air support coordination.' },
  { id: 'OP-012', callSign: 'KRAKEN',  clearance: 'Omega', sector: 'Bravo-2',  status: 'offline', threats: 0,  lastSeen: '18:44 UTC', notes: 'Signal lost after last transmission.' },
];

const STATUS_CFG: Record<Operator['status'], { label: string; variant: 'primary' | 'hazard' | 'ghost' }> = {
  active:  { label: 'Active',   variant: 'primary' },
  standby: { label: 'Standby',  variant: 'hazard'  },
  offline: { label: 'Offline',  variant: 'ghost'   },
};

const columns: DataGridColumn<Operator>[] = [
  { key: 'id',        header: 'ID',        width: '90px',  sortable: true, filterable: true },
  { key: 'callSign',  header: 'Call Sign', sortable: true, filterable: true },
  { key: 'clearance', header: 'Clearance', sortable: true, filterable: true },
  { key: 'sector',    header: 'Sector',    sortable: true, filterable: true },
  {
    key: 'status',
    header: 'Status',
    width: '110px',
    filterable: true,
    render: (val) => {
      const cfg = STATUS_CFG[val as Operator['status']];
      return <Badge label={cfg.label} variant={cfg.variant} dot />;
    },
  },
  { key: 'threats',  header: 'Threats', align: 'right', sortable: true, width: '80px' },
  { key: 'lastSeen', header: 'Last Seen', align: 'right', width: '110px' },
];

const MultiSelectStory = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col gap-3">
      <DataGrid
        columns={columns}
        data={operators}
        keyField="id"
        selectionMode="multi"
        selectedIds={selected}
        onSelectionChange={setSelected}
        searchable
        striped
      />
      {selected.size > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">Selected:</span>
          {[...selected].map(id => (
            <span key={id} className="text-[10px] font-mono text-primary border border-primary/30 px-2 py-0.5">{id}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const FullFeaturedStory = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <DataGrid
      columns={columns}
      data={operators}
      keyField="id"
      selectionMode="multi"
      selectedIds={selected}
      onSelectionChange={setSelected}
      searchable
      striped
      pageSize={5}
      caption="AEGIS // Operator Registry"
      renderExpanded={(row) => (
        <p className="text-[10px] font-mono text-slate-400">{row.notes}</p>
      )}
      actions={(row) => (
        <>
          <button title="View" className="text-slate-400 hover:text-primary transition-colors" onClick={() => alert(`View ${row.callSign}`)}>
            <MaterialIcon name="visibility" className="text-[16px]" />
          </button>
          <button title="Delete" className="text-slate-400 hover:text-alert transition-colors" onClick={() => alert(`Delete ${row.callSign}`)}>
            <MaterialIcon name="delete" className="text-[16px]" />
          </button>
        </>
      )}
    />
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <DataGrid columns={columns} data={operators} keyField="id" searchable />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('searchbox')).toHaveAttribute('placeholder', 'Search...');
    await expect(canvas.getByText('12 rows')).toBeVisible();
    await expect(canvas.getByText('GHOST')).toBeVisible();
    await expect(canvas.getByText('LYNX')).toBeVisible();
  },
};

export const SortableHeaders = {
  render: () => (
    <DataGrid columns={columns} data={operators} keyField="id" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('button', { name: 'Call Sign' });

    await expect(header.closest('th')).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(header);
    await expect(header.closest('th')).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(header);
    await expect(header.closest('th')).toHaveAttribute('aria-sort', 'descending');
  },
};

export const Striped = {
  render: () => (
    <DataGrid columns={columns} data={operators} keyField="id" striped />
  ),
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByText('RAVEN').closest('tr');

    await expect(row).toHaveClass('bg-surface-terminal/40');
  },
};

export const WithFilters = {
  render: () => (
    <DataGrid
      columns={columns}
      data={operators}
      keyField="id"
      searchable
      caption="AEGIS // Operator Registry"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('AEGIS // Operator Registry')).toBeVisible();
    await userEvent.click(canvas.getByTitle('Toggle filters'));
    const inputs = canvasElement.querySelectorAll('input[placeholder="Filter…"]');
    await expect(inputs.length).toBeGreaterThan(0);
    await userEvent.type(inputs[1] as HTMLInputElement, 'RAVEN');
    await expect(canvas.getByText('RAVEN')).toBeVisible();
    await expect(canvas.queryByText('GHOST')).not.toBeInTheDocument();
  },
};

export const MultiSelect = {
  render: () => <MultiSelectStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByLabelText('Select row OP-001'));
    await userEvent.click(canvas.getByLabelText('Select row OP-002'));
    await expect(canvas.getByText('2 selected · 12 of 12 rows')).toBeVisible();
    await expect(canvas.getAllByText('OP-001').length).toBeGreaterThan(1);
    await expect(canvas.getAllByText('OP-002').length).toBeGreaterThan(1);
    await userEvent.click(canvas.getByLabelText('Select all rows'));
    await expect(canvas.getByText('10 selected · 12 of 12 rows')).toBeVisible();
  },
};

export const SingleSelect = {
  render: () => (
    <DataGrid
      columns={columns}
      data={operators}
      keyField="id"
      selectionMode="single"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByLabelText('Select row OP-001'));
    await expect(canvas.getByText('1 selected · 12 of 12 rows')).toBeVisible();
    await userEvent.click(canvas.getByLabelText('Select row OP-002'));
    await expect(canvas.getByText('1 selected · 12 of 12 rows')).toBeVisible();
    await expect(canvas.getByLabelText('Select row OP-001')).not.toBeChecked();
  },
};

export const ExpandableRows = {
  render: () => (
    <DataGrid
      columns={columns}
      data={operators}
      keyField="id"
      renderExpanded={(row) => (
        <div className="flex gap-8 text-[10px] font-mono">
          <div>
            <p className="text-slate-400 uppercase tracking-widest mb-1">Operator Notes</p>
            <p className="text-slate-300">{row.notes}</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase tracking-widest mb-1">Threat Count</p>
            <p className={row.threats > 10 ? 'text-alert' : row.threats > 0 ? 'text-hazard' : 'text-slate-400'}>
              {row.threats} active threat{row.threats !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByText('GHOST').closest('tr');

    await userEvent.click(row?.querySelector('button') as HTMLButtonElement);
    await expect(canvas.getByText('Operator Notes')).toBeVisible();
    await expect(canvas.getByText('Lead recon operative for northern grid.')).toBeVisible();
  },
};

export const WithRowActions = {
  render: () => (
    <DataGrid
      columns={columns}
      data={operators}
      keyField="id"
      actions={(row) => (
        <>
          <button
            title="View"
            onClick={() => alert(`View ${row.callSign}`)}
            className="text-slate-400 hover:text-primary transition-colors"
          >
            <MaterialIcon name="visibility" className="text-[16px]" />
          </button>
          <button
            title="Edit"
            onClick={() => alert(`Edit ${row.callSign}`)}
            className="text-slate-400 hover:text-hazard transition-colors"
          >
            <MaterialIcon name="edit" className="text-[16px]" />
          </button>
          <button
            title="Remove"
            onClick={() => alert(`Remove ${row.callSign}`)}
            className="text-slate-400 hover:text-alert transition-colors"
          >
            <MaterialIcon name="delete" className="text-[16px]" />
          </button>
        </>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByTitle('View')).toHaveLength(10);
    await expect(canvas.getAllByTitle('Edit')).toHaveLength(10);
    await expect(canvas.getAllByTitle('Remove')).toHaveLength(10);
  },
};

export const FullFeatured = {
  render: () => <FullFeaturedStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('AEGIS // Operator Registry')).toBeVisible();
    await expect(canvas.getByText('12 of 12 rows')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: '3' }));
    await expect(canvas.getByText('FALCON')).toBeVisible();
    await expect(canvas.queryByText('GHOST')).not.toBeInTheDocument();
    await userEvent.type(canvas.getByRole('searchbox'), 'KRAKEN');
    await expect(canvas.getByText('KRAKEN')).toBeVisible();
    await expect(canvas.getByText('1 rows')).toBeVisible();
    await expect(canvas.getByText('1 of 12 rows')).toBeVisible();
  },
};

export const Empty = {
  render: () => (
    <DataGrid
      columns={columns}
      data={[]}
      keyField="id"
      searchable
      emptyLabel="No operators on record"
      emptyIcon="person_off"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('No operators on record')).toBeVisible();
    await expect(canvas.getByText('0 rows')).toBeVisible();
  },
};

export const ColumnVisibility = {
  render: () => (
    <DataGrid
      columns={[
        ...columns,
        { key: 'notes', header: 'Notes', hidden: true },
      ] as DataGridColumn<Operator>[]}
      data={operators}
      keyField="id"
      searchable
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText('Notes')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByTitle('Columns'));
    await userEvent.click(canvas.getByRole('button', { name: /Notes/i }));
    await expect(canvas.getAllByText('Notes').length).toBeGreaterThan(1);
  },
};
