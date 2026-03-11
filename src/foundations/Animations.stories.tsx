import type { Meta } from '@storybook/react-vite';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import Skeleton from '@/components/atoms/Skeleton';
import { CardBody, CardHeader, default as Card } from '@/components/molecules/Card';
import Stack from '@/components/layout/Stack';

const meta: Meta = { title: 'Foundations/Animations' };
export default meta;

const DemoCard = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) => (
  <Card className="min-h-[132px]">
    <CardHeader title={label} eyebrow={hint} variant="primary" />
    <CardBody className="flex min-h-[72px] items-center justify-center">
      {children}
    </CardBody>
  </Card>
);

export const AllAnimations = {
  render: () => (
    <Stack gap={5} className="max-w-4xl p-6">
      <div className="flex items-center gap-3">
        <Badge label="Foundations" variant="primary" dot />
        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono">
          AEGIS // Motion Tokens
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DemoCard label="animate-spin" hint="Tailwind built-in // 1s">
          <MaterialIcon name="refresh" className="text-primary text-[24px] animate-spin" />
        </DemoCard>

        <DemoCard label="animate-spin-slow" hint="Custom // 20s linear infinite">
          <MaterialIcon name="radar" className="text-primary/60 text-[24px] animate-spin-slow" />
        </DemoCard>

        <DemoCard label="animate-pulse" hint="Tailwind built-in // 2s">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        </DemoCard>

        <DemoCard label="animate-pulse-fast" hint="Custom // 1s">
          <span className="w-3 h-3 rounded-full bg-hazard animate-pulse-fast" />
        </DemoCard>

        <DemoCard label="aegis-scan" hint="globals.css // indeterminate bar sweep">
          <span className="relative w-full h-1.5 bg-primary/10 overflow-hidden">
            <span
              className="absolute inset-y-0 w-1/3 bg-primary opacity-80"
              style={{ animation: 'aegis-scan 1.4s ease-in-out infinite' }}
            />
          </span>
        </DemoCard>

        <DemoCard label="aegis-spin-progress" hint="globals.css // circular spinner">
          <MaterialIcon
            name="progress_activity"
            className="text-primary text-[24px]"
            style={{ animation: 'aegis-spin-progress 1.4s linear infinite' }}
          />
        </DemoCard>

        <DemoCard label="aegis-shimmer" hint="globals.css // skeleton shimmer">
          <Skeleton shape="box" height="24px" className="w-full" />
        </DemoCard>

        <DemoCard label="transition-colors" hint="Tailwind // 150ms default">
          <Button variant="ghost" size="sm">
            Hover me
          </Button>
        </DemoCard>
      </div>
    </Stack>
  ),
};
