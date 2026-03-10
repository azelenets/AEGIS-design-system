import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusItem from './StatusItem';

const meta: Meta<typeof StatusItem> = {
  title: 'Molecules/StatusItem',
  component: StatusItem,
  decorators: [
    (Story) => (
      <ul className="max-w-sm">
        <Story />
      </ul>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StatusItem>;

export const Standard: Story = {
  args: {
    name: 'TypeScript',
    detail: 'v5.x',
    status: 'PRODUCTION',
  },
};

export const Critical: Story = {
  args: {
    name: 'Ruby on Rails',
    detail: 'v8.x',
    status: 'PRIMARY_STACK',
    isCritical: true,
  },
};

export const Master: Story = {
  args: {
    name: 'PostgreSQL',
    detail: 'v16',
    status: 'PRIMARY_STACK',
    isMaster: true,
  },
};
