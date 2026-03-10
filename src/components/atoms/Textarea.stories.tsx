import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { label: 'Mission Briefing', placeholder: 'Describe the objective...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText('Mission Briefing');

    await userEvent.type(textarea, 'Secure the relay and extract telemetry.');
    await expect(textarea).toHaveValue('Secure the relay and extract telemetry.');
  },
};

export const WithHint: Story = {
  args: { label: 'Tactical Notes', placeholder: 'Enter notes...', hint: 'Markdown supported' },
};

export const WithError: Story = {
  args: { label: 'Report', placeholder: 'Enter report...', error: 'Field is required' },
};

export const Disabled: Story = {
  args: { label: 'Archived Log', value: 'Operation complete. All objectives met.', disabled: true },
};
