import { createElement } from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/foundations/fonts.css';
import '../src/foundations/globals.css';

type DocgenType = {
  name?: string;
  raw?: string;
  elements?: Array<{
    name?: string;
    value?: string;
  }>;
};

type DocgenProp = {
  description?: string;
  required?: boolean;
  tsType?: DocgenType;
  defaultValue?: {
    value?: string;
  };
};

type DocgenInfo = {
  props?: Record<string, DocgenProp>;
};

type MemoLikeComponent = {
  displayName?: string;
  __docgenInfo?: DocgenInfo;
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

const cleanLiteralValue = (value: string) => value.replace(/^['"]|['"]$/g, '');

const getUnionOptions = (tsType?: DocgenType) => {
  if (tsType?.name !== 'union' || !tsType.elements?.length) {
    return undefined;
  }

  const options = tsType.elements
    .filter((element) => element.name === 'literal' && typeof element.value === 'string')
    .map((element) => cleanLiteralValue(element.value as string));

  return options.length > 0 ? options : undefined;
};

const getControl = (prop: DocgenProp) => {
  const unionOptions = getUnionOptions(prop.tsType);

  if (unionOptions) {
    return { type: 'select' as const };
  }

  switch (prop.tsType?.name) {
    case 'boolean':
      return { type: 'boolean' as const };
    case 'number':
      return { type: 'number' as const };
    case 'string':
      return { type: 'text' as const };
    default:
      return undefined;
  }
};

const getTypeSummary = (prop: DocgenProp) => {
  if (prop.tsType?.raw) {
    return prop.tsType.raw;
  }

  return prop.tsType?.name;
};

const inferArgTypes = (component: unknown) => {
  const candidate = component as MemoLikeComponent | undefined;
  const props = candidate?.__docgenInfo?.props;

  if (!props) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(props).map(([name, prop]) => {
      const options = getUnionOptions(prop.tsType);

      return [
        name,
        {
          description: prop.description,
          required: prop.required,
          control: getControl(prop),
          options,
          table: {
            type: getTypeSummary(prop) ? { summary: getTypeSummary(prop) } : undefined,
            defaultValue: prop.defaultValue?.value ? { summary: prop.defaultValue.value } : undefined,
          },
        },
      ];
    }),
  );
};

export const argTypesEnhancers = [
  (context: { component?: unknown; argTypes?: Record<string, unknown> }) => ({
    ...inferArgTypes(context.component),
    ...context.argTypes,
  }),
];

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
    controls: {
      expanded: true,
      sort: 'alpha',
    },
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
