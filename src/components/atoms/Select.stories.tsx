import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Select from './Select';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Select>;

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'standby', label: 'Standby' },
  { value: 'offline', label: 'Offline' },
  { value: 'classified', label: 'Classified' },
];

export const Default: Story = {
  args: { label: 'Operator Status', options: statusOptions, placeholder: 'Select status...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox', { name: 'Operator Status' });

    await userEvent.click(combobox);
    await userEvent.click(within(document.body).getByRole('option', { name: 'Standby' }));
    await expect(combobox).toHaveTextContent('Standby');
  },
};

export const WithError: Story = {
  args: { label: 'Clearance Level', options: statusOptions, error: 'Selection required' },
};

export const Disabled: Story = {
  args: { label: 'Zone Lock', options: statusOptions, value: 'classified', disabled: true },
};

export const Multiple: Story = {
  args: { label: 'Operator Roles', options: statusOptions, multiple: true, placeholder: 'Select roles...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox', { name: 'Operator Roles' });
    const body = within(document.body);

    await userEvent.click(combobox);
    await userEvent.click(body.getByRole('option', { name: 'Active' }));
    await userEvent.click(body.getByRole('option', { name: 'Offline' }));
    await expect(combobox).toHaveTextContent('Active');
    await expect(combobox).toHaveTextContent('Offline');
  },
};

export const MultiplePreselected: Story = {
  args: { label: 'Active Zones', options: statusOptions, multiple: true, values: ['active', 'standby'] },
};
