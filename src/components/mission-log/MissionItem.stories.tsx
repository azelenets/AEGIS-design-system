import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import MissionItem from './MissionItem';

const meta: Meta<typeof MissionItem> = {
  title: 'Organisms/MissionItem',
  component: MissionItem,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [(Story) => <div className="p-10 max-w-4xl mx-auto"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof MissionItem>;

const sharedArgs = {
  date: '2023 — 2025',
  title: 'Operation Blacksite',
  missionRole: 'Lead Engineer',
  scanId: 'SC-4891',
  objective: 'Architect and ship a zero-downtime microservices migration for a high-traffic SaaS platform.',
  tactics: [
    'Decomposed Rails monolith into 6 NestJS services',
    'Implemented Kafka-based event bus for async communication',
    'Blue/green deployment with feature-flagged rollout',
  ],
  tools: ['NestJS', 'Kafka', 'Kubernetes', 'AWS', 'Terraform'],
  outcome: 'MISSION_SUCCESS',
  status: 'COMPLETED',
  statusColor: 'text-primary bg-primary/10',
} satisfies Story['args'];

export const WithImage: Story = {
  args: {
    ...sharedArgs,
    align: 'left',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'Operation Blacksite' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'Wireframe' })).toBeVisible();
    await expect(canvas.getByText('TECH_STACK')).toBeVisible();
  },
};

export const ShieldMode: Story = {
  args: {
    ...sharedArgs,
    align: 'right',
    isShield: true,
    tools: ['NestJS', 'Kafka'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shieldIcon = canvasElement.querySelector('svg.material-symbols_shield_lock');

    await expect(shieldIcon).toBeInTheDocument();
    await expect(canvas.getByText('SC-4891')).toBeVisible();
  },
};

export const GhostModeNoTools: Story = {
  args: {
    ...sharedArgs,
    align: 'right',
    isGhost: true,
    tools: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText('TECH_STACK')).not.toBeInTheDocument();
    await expect(canvas.getByText('MISSION_OBJECTIVE')).toBeVisible();
    await expect(canvas.getByText('TACTICAL_IMPLEMENTATION')).toBeVisible();
  },
};
