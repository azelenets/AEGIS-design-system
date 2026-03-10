import type { Meta } from '@storybook/react-vite';
import { ThemeProvider, useTheme } from './ThemeContext';
import ThemeToggle from '@/components/atoms/ThemeToggle';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/molecules/Card';
import Alert from '@/components/molecules/Alert';
import Input from '@/components/atoms/Input';
import Stack from '@/components/layout/Stack';
import Divider from '@/components/atoms/Divider';

const meta: Meta = { title: 'Foundations/Themes' };
export default meta;

// ─── Token swatch ─────────────────────────────────────────────────────────────

const Swatch = ({ varName, label }: { varName: string; label: string }) => (
  <Card>
    <CardBody className="flex items-center gap-3">
    <span
      className="w-8 h-8 border border-border-dark shrink-0"
      style={{ backgroundColor: `rgb(var(${varName}))` }}
    />
    <div>
      <p className="text-[10px] font-mono text-slate-300">{label}</p>
      <p className="text-[9px] font-mono text-slate-400">{varName}</p>
    </div>
    </CardBody>
  </Card>
);

// ─── Live demo wrapped in its own ThemeProvider ───────────────────────────────

const LiveDemo = () => {
  const { theme } = useTheme();

  return (
    <Card className="max-w-xl transition-colors duration-300">
      <CardHeader
        title={`${theme.toUpperCase()} MODE`}
        eyebrow="Active theme"
        variant="primary"
        action={<ThemeToggle variant="pill" />}
      />
      <CardBody className="space-y-6 bg-bg-dark">
      <div className="flex items-center justify-between">
        <div>
          <Badge label={theme} variant="primary" dot />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Swatch varName="--color-primary"          label="Primary"     />
        <Swatch varName="--color-hazard"            label="Hazard"      />
        <Swatch varName="--color-alert"             label="Alert"       />
        <Swatch varName="--color-bg-dark"           label="Background"  />
        <Swatch varName="--color-panel-dark"        label="Panel"       />
        <Swatch varName="--color-surface-terminal"  label="Surface"     />
        <Swatch varName="--color-border-dark"       label="Border"      />
      </div>

      <Divider />

      <Stack gap={4}>
        <div className="flex flex-wrap gap-2">
          <Badge label="Primary"  variant="primary" dot />
          <Badge label="Hazard"   variant="hazard"  dot />
          <Badge label="Alert"    variant="alert"   dot />
          <Badge label="Ghost"    variant="ghost"       />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary"   size="sm">Primary</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="ghost"     size="sm">Ghost</Button>
          <Button variant="danger"    size="sm">Danger</Button>
        </div>
        <Input label="Operator ID" placeholder="Enter your ID…" />
        <Alert variant="info" title="Theme system">
          All design tokens are CSS custom properties. Switching themes updates
          every token instantly with no component-level changes required.
        </Alert>
        <Card variant="primary" hoverable>
          <CardHeader title="Signal Trace" eyebrow="LAB-001" variant="primary" />
          <CardBody>
            <p className="text-xs text-slate-400 font-mono">
              This card adapts to the active theme automatically.
            </p>
          </CardBody>
          <CardFooter>
            <Button variant="primary" size="sm">View</Button>
          </CardFooter>
        </Card>
      </Stack>
      </CardBody>
    </Card>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Interactive = {
  render: () => (
    <ThemeProvider>
      <LiveDemo />
    </ThemeProvider>
  ),
};

export const SideBySide = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {(['dark', 'light'] as const).map(theme => (
        <div key={theme} data-theme={theme} className="flex-1 min-w-[280px]">
          <Card className="transition-colors">
            <CardHeader title={`${theme} theme`} eyebrow="Theme preview" variant="primary" />
            <CardBody className="flex flex-col gap-3 bg-bg-dark">
              <div className="flex flex-wrap gap-2">
              <Badge label="Primary" variant="primary" dot />
              <Badge label="Hazard"  variant="hazard"  dot />
              <Badge label="Alert"   variant="alert"   dot />
              </div>
              <div className="flex flex-wrap gap-2">
              <Button variant="primary"   size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              </div>
              <Alert variant="warning" title="Caution">Sector boundary breach detected.</Alert>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  ),
};

export const ToggleVariants = {
  render: () => (
    <ThemeProvider>
      <Card>
        <CardHeader title="ThemeToggle variants" eyebrow="Foundations" variant="primary" />
        <CardBody className="bg-bg-dark">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[9px] font-mono text-slate-400">icon</p>
            <ThemeToggle variant="icon" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[9px] font-mono text-slate-400">button (sm)</p>
            <ThemeToggle variant="button" size="sm" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[9px] font-mono text-slate-400">button (md)</p>
            <ThemeToggle variant="button" size="md" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[9px] font-mono text-slate-400">button (lg)</p>
            <ThemeToggle variant="button" size="lg" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[9px] font-mono text-slate-400">pill</p>
            <ThemeToggle variant="pill" />
          </div>
        </div>
        </CardBody>
      </Card>
    </ThemeProvider>
  ),
};
