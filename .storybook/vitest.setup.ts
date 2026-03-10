import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import * as previewAnnotations from './preview';

const projectAnnotations = setProjectAnnotations([a11yAddonAnnotations, previewAnnotations]);

beforeAll(projectAnnotations.beforeAll);
