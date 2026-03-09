import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchInput from './SearchInput';

const meta: Meta<typeof SearchInput> = { title: 'Atoms/SearchInput', component: SearchInput, decorators: [(S) => <div className="max-w-xs"><S /></div>] };
export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = { args: { placeholder: 'Search operators...' } };
export const WithLabel: Story = { args: { label: 'Search', placeholder: 'Search targets...' } };
export const Disabled: Story = { args: { label: 'Search', placeholder: 'Offline', disabled: true } };

export const Controlled = {
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div className="flex flex-col gap-2">
        <SearchInput label="Query" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Search..." />
        {q && <p className="text-[10px] font-mono text-slate-600">Query: "{q}"</p>}
      </div>
    );
  },
};
