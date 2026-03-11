import { createElement } from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/foundations/fonts.css';
import '../src/foundations/globals.css';

type MemoLikeComponent = {
  displayName?: string;
  type?: {
    displayName?: string;
    name?: string;
  };
};

const syncMemoDisplayName = (component: unknown) => {
  const candidate = component as MemoLikeComponent | undefined;

  if (!candidate || candidate.displayName) {
    return;
  }

  const inferredName = candidate.type?.displayName || candidate.type?.name;

  if (inferredName) {
    candidate.displayName = inferredName;
  }
};

// ─── Global theme decorator ───────────────────────────────────────────────────
// Applies the selected theme to <html data-theme="..."> so every story
// reflects the active theme.

const withTheme: Decorator = (Story, context) => {
  syncMemoDisplayName(context.component);
  Object.values(context.subcomponents ?? {}).forEach(syncMemoDisplayName);

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
      source: {
        transform: (source, context) => {
          syncMemoDisplayName(context.component);
          Object.values(context.subcomponents ?? {}).forEach(syncMemoDisplayName);
          return source;
        },
      },
    },
    layout: 'padded',
    options: {
      storySort: (a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
        || a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
    },
  },
};

export default preview;
