import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: 'Operator ID', placeholder: 'Enter ID...' },
};

export const WithIcon: Story = {
  args: { label: 'Search', placeholder: 'Search targets...', icon: 'search' },
};

export const WithHint: Story = {
  args: { label: 'Passphrase', type: 'password', placeholder: '••••••••', hint: 'Minimum 12 characters required' },
};

export const WithError: Story = {
  args: { label: 'Auth Code', placeholder: 'Enter code...', error: 'Invalid authorization code', value: 'XXXXX', readOnly: true },
};

export const Disabled: Story = {
  args: { label: 'Clearance Level', value: 'CLASSIFIED', disabled: true },
};
