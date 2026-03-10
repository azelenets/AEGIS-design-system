import type { Meta } from '@storybook/react-vite';
import Badge from '@/components/atoms/Badge';
import { CardBody, CardHeader, default as Card } from '@/components/molecules/Card';
import Stack from '@/components/layout/Stack';
import { aegisTokens } from './aegisTheme';

const meta: Meta = { title: 'Foundations/Colors' };
export default meta;

const SwatchCard = ({
  name,
  value,
  role,
}: {
  name: string;
  value: string;
  role: string;
}) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <span className="w-12 h-12 border border-border-dark shrink-0" style={{ backgroundColor: value }} />
      <Stack gap={1} className="min-w-0">
        <p className="text-xs font-bold font-mono text-white">{name}</p>
        <p className="text-[10px] font-mono text-slate-400">{value}</p>
        <p className="text-[10px] font-mono text-slate-400">{role}</p>
      </Stack>
    </CardBody>
  </Card>
);

const palette = [
  { name: 'primary', value: aegisTokens.dark.primary, role: 'Main accent // cyan' },
  { name: 'hazard', value: aegisTokens.dark.hazard, role: 'Warning // yellow' },
  { name: 'alert', value: aegisTokens.dark.alert, role: 'Critical / danger // red' },
  { name: 'background', value: aegisTokens.dark.background, role: 'Page background' },
  { name: 'panel', value: aegisTokens.dark.panel, role: 'Card / panel surface' },
  { name: 'surface', value: aegisTokens.dark.surface, role: 'Input / terminal surface' },
  { name: 'border', value: aegisTokens.dark.border, role: 'Default border' },
  { name: 'text', value: aegisTokens.dark.text, role: 'Body text' },
  { name: 'emerald (success)', value: '#34d399', role: 'Success state' },
  { name: 'slate-400', value: '#94a3b8', role: 'Secondary text' },
  { name: 'slate-600', value: '#475569', role: 'Muted / hint text' },
];

export const AllColors = {
  render: () => (
    <Stack gap={5} className="max-w-5xl p-6">
      <Card variant="primary">
        <CardHeader title="AEGIS Color Tokens" eyebrow="Foundations" variant="primary" />
        <CardBody className="flex items-center gap-3">
          <Badge label="Dark Theme" variant="primary" dot />
          <p className="text-[10px] font-mono text-slate-400">
            Semantic color tokens used across atoms, molecules, and organisms.
          </p>
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {palette.map((swatch) => <SwatchCard key={swatch.name} {...swatch} />)}
      </div>
    </Stack>
  ),
};
