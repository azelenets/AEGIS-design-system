import type { Meta } from '@storybook/react-vite';
import Container from './Container';

const meta: Meta<typeof Container> = { title: 'Layout/Container', component: Container, parameters: { layout: 'fullscreen' } };
export default meta;

const Content = ({ label }: { label: string }) => (
  <div className="bg-surface-terminal border border-primary/20 p-4 text-[10px] font-mono text-primary/60 text-center">{label}</div>
);

export const Small   = { render: () => <Container size="sm"><Content label="max-w-sm" /></Container> };
export const Medium  = { render: () => <Container size="md"><Content label="max-w-2xl" /></Container> };
export const Large   = { render: () => <Container size="lg"><Content label="max-w-4xl" /></Container> };
export const XLarge  = { render: () => <Container size="xl"><Content label="max-w-6xl" /></Container> };
export const Full    = { render: () => <Container size="full"><Content label="max-w-full" /></Container> };
