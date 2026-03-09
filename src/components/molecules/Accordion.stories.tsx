import type { Meta } from '@storybook/react-vite';
import Accordion from './Accordion';

const meta: Meta<typeof Accordion> = { title: 'Molecules/Accordion', component: Accordion, decorators: [(S) => <div className="max-w-sm"><S /></div>] };
export default meta;

const items = [
  { id: 'recon',     trigger: 'Reconnaissance Protocol',   content: 'Passive observation of target subnet. No active packets emitted. Duration: 4–8 hours.' },
  { id: 'intercept', trigger: 'Signal Intercept',          content: 'Active capture of encrypted traffic on designated channels. Requires Omega-level clearance.' },
  { id: 'neutralize',trigger: 'Neutralize Threat',         content: 'Full-spectrum engagement. Command authorization required. Non-reversible.', },
  { id: 'archive',   trigger: 'Archive (disabled)',        content: 'N/A', disabled: true },
];

export const Default = { render: () => <Accordion items={items} /> };
export const Flush = { render: () => <Accordion items={items} variant="flush" /> };
export const MultipleOpen = { render: () => <Accordion items={items} multiple defaultOpen={['recon', 'intercept']} /> };
export const DefaultOpen = { render: () => <Accordion items={items} defaultOpen={['recon']} /> };
