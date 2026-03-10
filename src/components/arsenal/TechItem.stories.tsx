import type { Meta, StoryObj } from '@storybook/react-vite';
import TechItem from './TechItem';

const meta: Meta<typeof TechItem> = {
  title: 'Molecules/TechItem',
  component: TechItem,
  decorators: [
    (Story) => (
      <ul className="max-w-sm">
        <Story />
      </ul>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TechItem>;

export const Standard: Story = {
  args: {
    name: 'TypeScript',
    version: 'v5.x',
    status: 'PRODUCTION',
  },
};

export const Critical: Story = {
  args: {
    name: 'Ruby on Rails',
    version: 'v8.x',
    status: 'PRIMARY_STACK',
    isCritical: true,
  },
};
