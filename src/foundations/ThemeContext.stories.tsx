import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card, { CardBody, CardHeader } from '@/components/molecules/Card';
import { ThemeProvider, useTheme } from './ThemeContext';

const meta: Meta = {
  title: 'Foundations/Theme Context',
};

export default meta;
type Story = StoryObj;

const STORAGE_KEY = 'theme-context-story';

const ThemeContextHarness = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <Card className="max-w-md">
      <CardHeader title="Theme Context" eyebrow="Foundations" variant="primary" />
      <CardBody className="flex flex-col gap-4 bg-bg-dark">
        <Badge label={theme} variant="primary" dot />
        <p className="text-[10px] font-mono text-slate-400">Current theme: {theme}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setTheme('light')}>Set Light</Button>
          <Button size="sm" variant="secondary" onClick={() => setTheme('dark')}>Set Dark</Button>
          <Button size="sm" variant="primary" onClick={toggleTheme}>Toggle Theme</Button>
        </div>
      </CardBody>
    </Card>
  );
};

export const DefaultDark: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      return (
        <ThemeProvider defaultTheme="dark" storageKey={STORAGE_KEY} disableStorage>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  render: () => <ThemeContextHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currentTheme = canvas.getByText(/Current theme:/);

    await expect(currentTheme).toHaveTextContent('Current theme: dark');
    await expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await expect(document.documentElement).toHaveClass('dark');
    await expect(document.documentElement).not.toHaveClass('light');
  },
};

export const DefaultLight: Story = {
  decorators: [
    (Story) => {
      localStorage.removeItem(STORAGE_KEY);
      return (
        <ThemeProvider defaultTheme="light" storageKey={STORAGE_KEY} disableStorage>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  render: () => <ThemeContextHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currentTheme = canvas.getByText(/Current theme:/);

    await expect(currentTheme).toHaveTextContent('Current theme: light');
    await expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await expect(document.documentElement).toHaveClass('light');
    await expect(document.documentElement).not.toHaveClass('dark');
  },
};

export const ToggleAndSetTheme: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      return (
        <ThemeProvider defaultTheme="dark" storageKey={STORAGE_KEY} disableStorage>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  render: () => <ThemeContextHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currentTheme = () => canvas.getByText(/Current theme:/);

    await userEvent.click(canvas.getByRole('button', { name: 'Toggle Theme' }));
    await expect(currentTheme()).toHaveTextContent('Current theme: light');
    await expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await userEvent.click(canvas.getByRole('button', { name: 'Set Dark' }));
    await expect(currentTheme()).toHaveTextContent('Current theme: dark');
    await expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  },
};

export const PersistsTheme: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      return (
        <ThemeProvider defaultTheme="dark" storageKey={STORAGE_KEY}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  render: () => <ThemeContextHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currentTheme = canvas.getByText(/Current theme:/);

    await expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    await userEvent.click(canvas.getByRole('button', { name: 'Set Light' }));
    await expect(currentTheme).toHaveTextContent('Current theme: light');
    await expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  },
};

export const RespectsStoredTheme: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem(STORAGE_KEY, 'light');
      return (
        <ThemeProvider defaultTheme="dark" storageKey={STORAGE_KEY}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  render: () => <ThemeContextHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currentTheme = canvas.getByText(/Current theme:/);

    await expect(canvas.getByText('Current theme: light')).toBeVisible();
    await expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  },
};

export const DisableStorage: Story = {
  decorators: [
    (Story) => {
      localStorage.removeItem(STORAGE_KEY);
      return (
        <ThemeProvider defaultTheme="dark" storageKey={STORAGE_KEY} disableStorage>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  render: () => <ThemeContextHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currentTheme = canvas.getByText(/Current theme:/);

    await expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Set Light' }));
    await expect(currentTheme).toHaveTextContent('Current theme: light');
    await expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  },
};
