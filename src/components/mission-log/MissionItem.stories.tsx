import type { Meta, StoryObj } from '@storybook/react-vite';
import MissionItem from './MissionItem';

const meta: Meta<typeof MissionItem> = {
  title: 'Mission Log/MissionItem',
  component: MissionItem,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MissionItem>;

const sharedArgs = {
  date: '2023 — 2025',
  title: 'Operation Blacksite',
  role: 'Lead Engineer',
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
};

export const WithImage: Story = {
  decorators: [(Story) => <div className="p-10 max-w-4xl mx-auto"><Story /></div>],
  args: {
    ...sharedArgs,
    align: 'left',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80',
  },
};
