import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '@/foundations/ThemeContext';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="dark" disableStorage>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const ButtonVariant: Story = {
  args: { variant: 'button' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /Switch to (light|dark) mode/ });
    const initialTheme = document.documentElement.getAttribute('data-theme');

    await userEvent.click(toggle);
    await expect(document.documentElement).toHaveAttribute(
      'data-theme',
      initialTheme === 'light' ? 'dark' : 'light',
    );
    await expect(canvas.getByRole('button', { name: /Switch to (light|dark) mode/ })).toBeVisible();
  },
};

export const IconVariant: Story = {
  args: { variant: 'icon', size: 'sm' },
};

export const PillVariant: Story = {
  args: { variant: 'pill', size: 'lg' },
};
