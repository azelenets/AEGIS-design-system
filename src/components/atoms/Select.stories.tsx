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
    const body = within(document.body);

    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(combobox);
    await expect(combobox).toHaveAttribute('aria-expanded', 'true');
    await expect(body.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(body.getByRole('option', { name: 'Standby' }));
    await expect(combobox).toHaveTextContent('Standby');
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  },
};

export const WithError: Story = {
  args: { label: 'Clearance Level', options: statusOptions, error: 'Selection required' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('combobox', { name: 'Clearance Level' })).toHaveClass('border-alert/50');
    await expect(canvas.getByText('Selection required')).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { label: 'Zone Lock', options: statusOptions, value: 'classified', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox', { name: 'Zone Lock' });

    await expect(combobox).toBeDisabled();
    await expect(combobox).toHaveTextContent('Classified');
  },
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
    await expect(canvas.getByRole('button', { name: 'Remove Active' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Remove Offline' })).toBeInTheDocument();
    const options = body.getAllByRole('option');
    const activeOption = options.find((option) => option.textContent?.includes('Active'));
    const offlineOption = options.find((option) => option.textContent?.includes('Offline'));

    await expect(activeOption).toHaveAttribute('aria-selected', 'true');
    await expect(offlineOption).toHaveAttribute('aria-selected', 'true');
  },
};

export const MultiplePreselected: Story = {
  args: { label: 'Active Zones', options: statusOptions, multiple: true, values: ['active', 'standby', 'offline'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox', { name: 'Active Zones' });

    await expect(combobox).toHaveTextContent('Active');
    await expect(combobox).toHaveTextContent('Standby');
    await expect(combobox).toHaveTextContent('+1');
    await expect(canvas.getByRole('button', { name: 'Remove Active' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Remove Standby' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Remove Offline' })).toBeInTheDocument();
  },
};

export const KeyboardNavigation: Story = {
  args: { label: 'Keyboard Select', options: statusOptions, placeholder: 'Select status...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox', { name: 'Keyboard Select' });
    const body = within(document.body);

    combobox.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(combobox).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    await expect(combobox).toHaveTextContent('Standby');
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const EscapeCloses: Story = {
  args: { label: 'Escape Close', options: statusOptions, placeholder: 'Select status...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox', { name: 'Escape Close' });
    const body = within(document.body);

    await userEvent.click(combobox);
    await expect(body.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const MultipleRemoveTag: Story = {
  args: { label: 'Assigned Roles', options: statusOptions, multiple: true, values: ['active', 'offline'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combobox = canvas.getByRole('combobox', { name: 'Assigned Roles' });

    await expect(combobox).toHaveTextContent('Active');
    await expect(combobox).toHaveTextContent('Offline');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Active' }));
    await expect(combobox).not.toHaveTextContent('Active');
    await expect(combobox).toHaveTextContent('Offline');
  },
};
