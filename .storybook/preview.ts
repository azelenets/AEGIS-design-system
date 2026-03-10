import { createElement } from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/foundations/globals.css';

// ─── Global theme decorator ───────────────────────────────────────────────────
// Applies the selected theme to <html data-theme="..."> so every story
// reflects the active theme.

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] ?? 'dark') as string;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark',  theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  return createElement(Story);
};

// ─── Preview config ───────────────────────────────────────────────────────────

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Global color theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'dark',  icon: 'circle',       title: 'Dark'  },
          { value: 'light', icon: 'circlehollow',  title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [withTheme],

  parameters: {
    a11y: {
      test: 'todo',
    },
    backgrounds: { disable: true }, // theme handles bg via CSS vars
    docs: {
      toc: true,
    },
    layout: 'padded',
    options: {
      storySort: (a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
        || a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
    },
  },
};

export default preview;
