import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: 'Operator ID', placeholder: 'Enter ID...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Operator ID');

    await userEvent.type(input, 'UNIT-007');
    await expect(input).toHaveValue('UNIT-007');
  },
};

export const WithIcon: Story = {
  args: { label: 'Search', placeholder: 'Search targets...', icon: 'search' },
};

export const WithHint: Story = {
  args: { label: 'Passphrase', type: 'password', placeholder: '••••••••', hint: 'Minimum 12 characters required' },
};

export const WithError: Story = {
  args: { label: 'Auth Code', placeholder: 'Enter code...', error: 'Invalid authorization code', value: 'XXXXX', readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Invalid authorization code')).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { label: 'Clearance Level', value: 'CLASSIFIED', disabled: true },
};
