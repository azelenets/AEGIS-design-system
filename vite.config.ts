import fs from 'node:fs/promises';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const FONT_FILES = [
  'jetbrains-mono-latin-400-normal.woff2',
  'jetbrains-mono-latin-700-normal.woff2',
  'jetbrains-mono-latin-800-normal.woff2',
  'orbitron-latin-400-normal.woff2',
  'orbitron-latin-700-normal.woff2',
  'orbitron-latin-900-normal.woff2',
] as const;

const FONT_CSS = `@font-face {
  font-family: 'JetBrains Mono';
  src: url('./fonts/jetbrains-mono-latin-400-normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('./fonts/jetbrains-mono-latin-700-normal.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('./fonts/jetbrains-mono-latin-800-normal.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/orbitron-latin-400-normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/orbitron-latin-700-normal.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Orbitron';
  src: url('./fonts/orbitron-latin-900-normal.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
`;

const bundleFontsPlugin = () => ({
  name: 'bundle-font-assets',
  apply: 'build' as const,
  async writeBundle() {
    const distDir = path.resolve(__dirname, 'dist');
    const distFontsDir = path.join(distDir, 'fonts');
    const srcFontsDir = path.resolve(__dirname, 'src/assets/fonts');

    await fs.mkdir(distFontsDir, { recursive: true });
    await Promise.all(
      FONT_FILES.map((file) =>
        fs.copyFile(path.join(srcFontsDir, file), path.join(distFontsDir, file)),
      ),
    );
    await fs.writeFile(path.join(distDir, 'fonts.css'), FONT_CSS);
  },
});

export default defineConfig({
  plugins: [
    react(),
    bundleFontsPlugin(),
    dts({
      include: ['src'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/App.tsx',
        'src/main.tsx',
        'src/pages/**',
        '.storybook/**',
      ],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    assetsInlineLimit: 0,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@material-symbols-svg/react', 'leaflet'],
    },
  },
  server: {
    port: 3001,
    host: '0.0.0.0',
  },
});
