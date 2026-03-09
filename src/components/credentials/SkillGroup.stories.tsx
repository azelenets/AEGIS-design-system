import type { Meta, StoryObj } from '@storybook/react-vite';
import SkillGroup from './SkillGroup';

const meta: Meta<typeof SkillGroup> = {
  title: 'Credentials/SkillGroup',
  component: SkillGroup,
};

export default meta;
type Story = StoryObj<typeof SkillGroup>;

export const Default: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    title: 'LANGUAGES',
    items: ['Ruby', 'TypeScript', 'Python', 'Go', 'SQL', 'Bash'],
  },
};
