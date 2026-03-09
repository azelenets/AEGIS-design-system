import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Deploy' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Configure' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Cancel' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Terminate' },
};

export const WithIcon: Story = {
  args: { variant: 'primary', icon: 'rocket_launch', children: 'Launch' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Processing' },
};

export const SmallSize: Story = {
  args: { variant: 'secondary', size: 'sm', children: 'Scan' },
};

export const LargeSize: Story = {
  args: { variant: 'primary', size: 'lg', icon: 'shield', children: 'Authorize' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Locked' },
};

export const AllVariants: Story = {
  decorators: [
    () => (
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
    ),
  ],
};
