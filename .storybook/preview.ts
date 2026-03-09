import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/foundations/globals.css';

// ─── Global theme decorator ───────────────────────────────────────────────────
// Applies the selected theme to <html data-theme="..."> so every story
// reflects the active theme. No JSX needed — we just mutate the DOM.

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] ?? 'dark') as string;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark',  theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  return Story();
};

// ─── Preview config ───────────────────────────────────────────────────────────

const preview: Preview = {
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
    backgrounds: { disable: true }, // theme handles bg via CSS vars
    layout: 'padded',
  },
};

export default preview;
