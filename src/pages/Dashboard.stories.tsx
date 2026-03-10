import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';

import Navbar                                from '@/components/organisms/Navbar';
import PageHeader                            from '@/components/layout/PageHeader';
import Card, { CardHeader, CardBody }        from '@/components/molecules/Card';
import Tabs, { TabList, TabTrigger, TabPanel } from '@/components/organisms/Tabs';
import Table                                 from '@/components/organisms/Table';
import Alert                                 from '@/components/molecules/Alert';
import ProgressBar                           from '@/components/molecules/ProgressBar';
import ProgressCircle                        from '@/components/molecules/ProgressCircle';
import Badge                                 from '@/components/atoms/Badge';
import Button                                from '@/components/atoms/Button';
import Input                                 from '@/components/atoms/Input';
import Select                                from '@/components/atoms/Select';
import Slider                                from '@/components/atoms/Slider';
import Toggle                                from '@/components/atoms/Toggle';
import Checkbox                              from '@/components/atoms/Checkbox';
import Avatar                                from '@/components/atoms/Avatar';
import AvatarGroup                           from '@/components/molecules/AvatarGroup';
import Tag                                   from '@/components/atoms/Tag';
import Divider                               from '@/components/atoms/Divider';

import SearchInput                           from '@/components/atoms/SearchInput';
import StatCard                              from '@/components/dashboard/StatCard';
import StatusItem                            from '@/components/arsenal/StatusItem';
import FeatureCard                           from '@/components/protocols/FeatureCard';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Pages/Dashboard',
  parameters: { layout: 'fullscreen' },
};
export default meta;

// ─── Data ─────────────────────────────────────────────────────────────────────

type Operator = Record<string, unknown> & {
  id: string; callsign: string; role: string; status: string; clearance: string; ops: number;
};

const operators: Operator[] = [
  { id: 'OP-001', callsign: 'PHANTOM',  role: 'Lead Engineer',    status: 'ACTIVE',    clearance: 'ALPHA-2', ops: 148 },
  { id: 'OP-002', callsign: 'VORTEX',   role: 'Backend Systems',  status: 'ACTIVE',    clearance: 'BETA-1',  ops: 92  },
  { id: 'OP-003', callsign: 'CIPHER',   role: 'Security Analyst', status: 'STANDBY',   clearance: 'ALPHA-1', ops: 217 },
  { id: 'OP-004', callsign: 'WRAITH',   role: 'Infra & DevOps',   status: 'OFFLINE',   clearance: 'GAMMA-3', ops: 63  },
  { id: 'OP-005', callsign: 'SPECTER',  role: 'Frontend Systems', status: 'ACTIVE',    clearance: 'BETA-2',  ops: 104 },
];

const STATUS_BADGE: Record<string, JSX.Element> = {
  ACTIVE:  <Badge label="Active"  variant="success" dot />,
  STANDBY: <Badge label="Standby" variant="hazard"  dot />,
  OFFLINE: <Badge label="Offline" variant="ghost"   />,
};

const operatorColumns = [
  { key: 'id',        header: 'ID',       width: '80px' },
  { key: 'callsign',  header: 'Callsign', render: (_: unknown, row: Operator) => (
    <span className="font-bold text-slate-200 font-mono">{row.callsign}</span>
  )},
  { key: 'role',      header: 'Role' },
  { key: 'clearance', header: 'Clearance', render: (_: unknown, row: Operator) => (
    <Tag label={row.clearance} variant="primary" />
  )},
  { key: 'ops',       header: 'Ops',    align: 'right' as const,
    render: (_: unknown, row: Operator) => (
      <span className="tabular-nums text-primary font-mono">{row.ops}</span>
    ),
  },
  { key: 'status',    header: 'Status', align: 'center' as const,
    render: (_: unknown, row: Operator) => STATUS_BADGE[row.status] ?? null,
  },
];

const stack = [
  { name: 'TypeScript',    detail: 'v5.x',   status: 'PRODUCTION',    isCritical: false },
  { name: 'Ruby on Rails', detail: 'v8.x',   status: 'PRIMARY_STACK', isCritical: true  },
  { name: 'NestJS',        detail: 'v10.x',  status: 'PRODUCTION',    isCritical: false },
  { name: 'PostgreSQL',    detail: 'v16',    status: 'PRIMARY_STACK', isMaster:   true  },
  { name: 'Redis',         detail: 'v7.x',   status: 'PRODUCTION',    isCritical: false },
];

const avatars = [
  { src: 'https://i.pravatar.cc/150?img=1' },
  { src: 'https://i.pravatar.cc/150?img=2' },
  { src: 'https://i.pravatar.cc/150?img=3' },
  { src: 'https://i.pravatar.cc/150?img=4' },
  { src: 'https://i.pravatar.cc/150?img=5' },
  { src: 'https://i.pravatar.cc/150?img=6' },
  { src: 'https://i.pravatar.cc/150?img=7' },
];

const zoneOptions = [
  { value: 'alpha', label: 'Zone Alpha' },
  { value: 'beta',  label: 'Zone Beta'  },
  { value: 'gamma', label: 'Zone Gamma' },
  { value: 'delta', label: 'Zone Delta' },
];

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export const AegisDashboard = {
  name: 'AEGIS Ops Dashboard',
  render: () => {
    const [search, setSearch]         = useState('');
    const [zone, setZone]             = useState('alpha');
    const [sensitivity, setSensitivity] = useState(72);
    const [scanEnabled, setScanEnabled] = useState(true);
    const [autoSync, setAutoSync]     = useState(false);
    const [alertEnabled, setAlertEnabled] = useState(true);

    const filtered = operators.filter(
      (o) => o.callsign.toLowerCase().includes(search.toLowerCase()) ||
             o.role.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <div className="min-h-screen bg-bg-dark font-mono">

        {/* ── Navbar ── */}
        <Navbar
          brand={
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
              <span className="text-sm font-bold font-display text-white tracking-widest">AEGIS</span>
              <Badge label="v2.4.1" variant="ghost" />
            </span>
          }
          items={[
            { id: 'dashboard', label: 'Dashboard', active: true },
            { id: 'operators', label: 'Operators' },
            { id: 'protocols', label: 'Protocols', badge: '3' },
            { id: 'arsenal',   label: 'Arsenal'   },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Badge label="SYSTEM NOMINAL" variant="success" dot />
              <Avatar src="https://i.pravatar.cc/150?img=12" size="sm" />
            </div>
          }
        />

        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-6">

          {/* ── Page Header ── */}
          <div className="flex items-end justify-between gap-4">
            <PageHeader
              eyebrow="AEGIS // COMMAND INTERFACE"
              titleMain="Operations"
              titleAccent="Center"
              description="Real-time monitoring and management of active operations, system protocols, and operator assignments."
            />
            <div className="flex items-center gap-2 shrink-0 pb-16">
              <Button variant="ghost" size="sm" icon="refresh">Sync</Button>
              <Button variant="primary" size="sm" icon="add">New Mission</Button>
            </div>
          </div>

          {/* ── Alert ── */}
          <Alert variant="warning" title="Scheduled Maintenance Window">
            System downtime scheduled 03:00–04:00 UTC. Operators should complete active sessions beforehand.
          </Alert>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard id="01" label="Years Experience"  value="8+ YRS"  progress={80} />
            <StatCard id="02" label="Projects Shipped"  value="200+"    progress={70} />
            <StatCard id="03" label="Uptime SLA"        value="99.9%"   progress={99} />
            <StatCard id="04" label="Clearance Level"   value="ALPHA-2" progress={0} segmented />
          </div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

            {/* ── Left column ── */}
            <div className="flex flex-col gap-6">

              {/* ── Tabs: Overview / Operators / Config ── */}
              <Tabs defaultTab="overview">
                <TabList>
                  <TabTrigger id="overview"  icon="dashboard">Overview</TabTrigger>
                  <TabTrigger id="operators" icon="group">Operators</TabTrigger>
                  <TabTrigger id="config"    icon="settings">Configuration</TabTrigger>
                </TabList>

                {/* ── Overview tab ── */}
                <TabPanel id="overview">
                  <div className="flex flex-col gap-4 pt-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* System Health */}
                      <Card variant="primary">
                        <CardHeader eyebrow="SYSTEM" title="Infrastructure Health" variant="primary" />
                        <CardBody>
                          <div className="flex flex-col gap-3">
                            <ProgressBar label="API Gateway"       value={97} variant="primary" showValue />
                            <ProgressBar label="Database Cluster"  value={84} variant="primary" showValue />
                            <ProgressBar label="Message Queue"     value={61} variant="hazard"  showValue />
                            <ProgressBar label="Cache Layer"       value={92} variant="primary" showValue />
                          </div>
                        </CardBody>
                      </Card>

                      {/* Ops Summary */}
                      <Card variant="default">
                        <CardHeader eyebrow="METRICS" title="Mission Summary" />
                        <CardBody>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: 'Active',    value: '12', color: 'text-primary' },
                              { label: 'Completed', value: '148', color: 'text-emerald-400' },
                              { label: 'Pending',   value: '7',  color: 'text-hazard' },
                              { label: 'Critical',  value: '2',  color: 'text-alert' },
                            ].map(({ label, value, color }) => (
                              <div key={label} className="bg-surface-terminal border border-border-dark p-3">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                                <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
                              </div>
                            ))}
                          </div>
                          <Divider className="my-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Operators</span>
                            <AvatarGroup avatars={avatars} max={5} size="sm" />
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Threat analysis */}
                    <Card>
                      <CardHeader
                        eyebrow="THREAT ANALYSIS"
                        title="Sector Risk Assessment"
                        action={<Badge label="Live" variant="alert" dot />}
                      />
                      <CardBody>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { sector: 'ALPHA', risk: 12,  level: 'LOW'      },
                            { sector: 'BETA',  risk: 67,  level: 'MODERATE' },
                            { sector: 'GAMMA', risk: 88,  level: 'HIGH'     },
                            { sector: 'DELTA', risk: 34,  level: 'LOW'      },
                          ].map(({ sector, risk, level }) => (
                            <div key={sector} className="flex flex-col items-center gap-2 p-3 bg-surface-terminal border border-border-dark">
                              <ProgressCircle
                                value={risk}
                                variant={risk > 80 ? 'alert' : risk > 50 ? 'hazard' : 'primary'}
                                size="md"
                                label={`${risk}%`}
                              />
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sector}</p>
                              <Badge
                                label={level}
                                variant={risk > 80 ? 'alert' : risk > 50 ? 'hazard' : 'success'}
                              />
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </TabPanel>

                {/* ── Operators tab ── */}
                <TabPanel id="operators">
                  <div className="flex flex-col gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <SearchInput
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search by callsign or role..."
                        />
                      </div>
                      <Button variant="ghost" size="sm" icon="filter_list">Filter</Button>
                      <Button variant="ghost" size="sm" icon="download">Export</Button>
                    </div>
                    <Table
                      columns={operatorColumns}
                      data={filtered}
                      keyField="id"
                      striped
                      emptyLabel="No operators match the search criteria"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{filtered.length} of {operators.length} operators</span>
                      <div className="flex items-center gap-2">
                        <Badge label="3 Active" variant="success" dot />
                        <Badge label="1 Standby" variant="hazard" dot />
                        <Badge label="1 Offline" variant="ghost" />
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* ── Config tab ── */}
                <TabPanel id="config">
                  <div className="flex flex-col gap-5 pt-4 max-w-lg">
                    <Input
                      label="Operator Callsign"
                      placeholder="Enter callsign..."
                      defaultValue="PHANTOM"
                      hint="Unique identifier for this operator profile"
                    />
                    <Select
                      label="Assigned Zone"
                      options={zoneOptions}
                      value={zone}
                      onChange={setZone}
                    />
                    <Slider
                      label="Detection Sensitivity"
                      value={sensitivity}
                      min={0}
                      max={100}
                      onChange={(e) => setSensitivity(Number(e.target.value))}
                      hint="Higher values increase false positive rate"
                      formatValue={(v) => `${v}%`}
                    />
                    <Divider label="Permissions" />
                    <div className="flex flex-col gap-3">
                      <Toggle
                        label="Enable Active Scanning"
                        hint="Continuously monitor for anomalies"
                        checked={scanEnabled}
                        onChange={(e) => setScanEnabled(e.target.checked)}
                      />
                      <Toggle
                        label="Auto-Sync with HQ"
                        hint="Push updates every 60 seconds"
                        checked={autoSync}
                        onChange={(e) => setAutoSync(e.target.checked)}
                        variant="hazard"
                      />
                      <Toggle
                        label="Critical Alert Notifications"
                        checked={alertEnabled}
                        onChange={(e) => setAlertEnabled(e.target.checked)}
                        variant="alert"
                      />
                    </div>
                    <Divider label="Access Flags" />
                    <div className="flex flex-col gap-2">
                      <Checkbox label="Read system logs"    defaultChecked hint="View-only access to all log streams" />
                      <Checkbox label="Execute protocols"   defaultChecked />
                      <Checkbox label="Manage operators"    />
                      <Checkbox label="Modify threat rules" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="primary" icon="save">Save Configuration</Button>
                      <Button variant="ghost">Reset</Button>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>

            {/* ── Right sidebar ── */}
            <div className="flex flex-col gap-4">

              {/* Active protocols */}
              <FeatureCard id="P-01" icon="memory" title="BACKEND SYSTEMS" status="ACTIVE_PROTOCOL" dots={5}>
                High-throughput APIs, event-driven microservices, and distributed data pipelines.
              </FeatureCard>
              <FeatureCard id="P-02" icon="security" title="THREAT DETECTION" status="MONITORING" dots={3}>
                Real-time anomaly detection across all network segments and endpoints.
              </FeatureCard>

              <Divider label="Tech Stack" />

              {/* Tech stack */}
              <ul className="flex flex-col gap-1.5">
                {stack.map((t) => (
                  <StatusItem key={t.name} {...t} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
