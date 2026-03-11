import type { Meta } from '@storybook/react-vite';
import Card, { CardHeader, CardBody, CardFooter } from './Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const meta: Meta<typeof Card> = { title: 'Molecules/Card', component: Card, decorators: [(S) => <div className="max-w-sm"><S /></div>] };
export default meta;

export const Default = {
  render: () => (
    <Card>
      <CardHeader title="Signal Trace" eyebrow="LAB-001" />
      <CardBody><p className="text-xs text-slate-400 font-mono">Real-time distributed tracing for microservice architectures.</p></CardBody>
      <CardFooter><Button variant="secondary" size="sm">View Project</Button></CardFooter>
    </Card>
  ),
};

export const WithHint = {
  render: () => (
    <Card>
      <CardHeader
        title="Signal Trace"
        eyebrow="LAB-001"
        hint="Real-time distributed tracing for microservice architectures."
      />
      <CardBody><p className="text-xs text-slate-400 font-mono">Telemetry spans, latency heatmaps, and failure paths in one place.</p></CardBody>
      <CardFooter><Button variant="secondary" size="sm">View Project</Button></CardFooter>
    </Card>
  ),
};

export const PrimaryVariant = {
  render: () => (
    <Card variant="primary" hoverable>
      <CardHeader title="Anomaly Scanner" eyebrow="LAB-002" variant="primary" action={<Badge label="Active" variant="primary" dot />} />
      <CardBody><p className="text-xs text-slate-400 font-mono">Detects irregular traffic patterns across all monitored subnets.</p></CardBody>
      <CardFooter align="between">
        <span className="text-[10px] text-slate-400 font-mono">14 endpoints</span>
        <Button variant="primary" size="sm" icon="open_in_new">Open</Button>
      </CardFooter>
    </Card>
  ),
};

export const HazardVariant = {
  render: () => (
    <Card variant="hazard">
      <CardHeader title="Override Lockout" eyebrow="PROTOCOL-07" variant="hazard" action={<Badge label="Warning" variant="hazard" dot />} />
      <CardBody><p className="text-xs text-slate-400 font-mono">Bypasses safety interlocks. Requires command-level authorization.</p></CardBody>
      <CardFooter><Button variant="secondary" size="sm">Authorize</Button></CardFooter>
    </Card>
  ),
};

export const AlertVariant = {
  render: () => (
    <Card variant="alert">
      <CardHeader title="Breach Detected" eyebrow="ALERT-003" variant="alert" action={<Badge label="Critical" variant="alert" dot />} />
      <CardBody><p className="text-xs text-slate-400 font-mono">Sector 7 firewall breached. Immediate response required.</p></CardBody>
      <CardFooter><Button variant="danger" size="sm" icon="emergency_home">Lockdown</Button></CardFooter>
    </Card>
  ),
};

export const BodyOnly = {
  render: () => (
    <Card>
      <CardBody><p className="text-xs text-slate-400 font-mono">A minimal card with body content only.</p></CardBody>
    </Card>
  ),
};
