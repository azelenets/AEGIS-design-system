import type { Meta, StoryObj } from '@storybook/react-vite';
import TagGroup from './TagGroup';

const meta: Meta<typeof TagGroup> = {
  title: 'Molecules/TagGroup',
  component: TagGroup,
};

export default meta;
type Story = StoryObj<typeof TagGroup>;

export const Default: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    title: 'LANGUAGES',
    items: ['Ruby', 'TypeScript', 'Python', 'Go', 'SQL', 'Bash'],
  },
};

export const Technologies: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    title: 'TECHNOLOGIES',
    items: ['React', 'NestJS', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes', 'Terraform'],
  },
};
