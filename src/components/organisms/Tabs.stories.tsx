import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs, { TabList, TabTrigger, TabPanel } from './Tabs';
import Badge from '@/components/atoms/Badge';

const meta: Meta<typeof Tabs> = {
  title: 'Organisms/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const panelClass = 'pt-5 text-xs text-slate-400 font-mono leading-relaxed';

export const LineVariant: Story = {
  decorators: [
    () => (
      <Tabs defaultTab="overview" variant="line">
        <TabList>
          <TabTrigger id="overview" icon="dashboard">Overview</TabTrigger>
          <TabTrigger id="telemetry" icon="sensors">Telemetry</TabTrigger>
          <TabTrigger id="logs"      icon="terminal">Logs</TabTrigger>
          <TabTrigger id="settings" icon="settings" disabled>Settings</TabTrigger>
        </TabList>
        <TabPanel id="overview"  className={panelClass}>System nominal. All 14 endpoints monitored. Last sync: 02:14 UTC.</TabPanel>
        <TabPanel id="telemetry" className={panelClass}>Inbound: 1.2 GB/s · Outbound: 340 MB/s · Packet loss: 0.01%</TabPanel>
        <TabPanel id="logs"      className={panelClass}>[ 02:14:03 ] INFO  — Heartbeat received from UNIT-007{'\n'}[ 02:13:58 ] WARN  — Latency spike on subnet 10.0.4.x{'\n'}[ 02:13:44 ] INFO  — Session opened by GHOST</TabPanel>
      </Tabs>
    ),
  ],
};

export const PillVariant: Story = {
  decorators: [
    () => (
      <Tabs defaultTab="active" variant="pill">
        <TabList>
          <TabTrigger id="active"   icon="person">Active</TabTrigger>
          <TabTrigger id="standby"  icon="pause_circle">Standby</TabTrigger>
          <TabTrigger id="offline"  icon="cancel">Offline</TabTrigger>
        </TabList>
        <TabPanel id="active"  className={panelClass}>4 operators currently active in the field.</TabPanel>
        <TabPanel id="standby" className={panelClass}>2 operators on standby, awaiting deployment orders.</TabPanel>
        <TabPanel id="offline" className={panelClass}>1 operator offline — last contact 23:40 UTC.</TabPanel>
      </Tabs>
    ),
  ],
};

export const BoxedVariant: Story = {
  decorators: [
    () => (
      <Tabs defaultTab="intel" variant="boxed">
        <TabList>
          <TabTrigger id="intel"   icon="search_insights">Intel</TabTrigger>
          <TabTrigger id="ops"     icon="radar">Ops</TabTrigger>
          <TabTrigger id="archive" icon="inventory_2">Archive</TabTrigger>
        </TabList>
        <TabPanel id="intel"   className={`bg-panel-dark border border-t-0 border-border-dark p-5 ${panelClass}`}>Active intelligence reports: 7 flagged, 2 critical.</TabPanel>
        <TabPanel id="ops"     className={`bg-panel-dark border border-t-0 border-border-dark p-5 ${panelClass}`}>3 operations running. Next checkpoint: Alpha-7 at 04:00 UTC.</TabPanel>
        <TabPanel id="archive" className={`bg-panel-dark border border-t-0 border-border-dark p-5 ${panelClass}`}>312 archived missions. Oldest record: 2019-03-14.</TabPanel>
      </Tabs>
    ),
  ],
};

export const WithBadges: Story = {
  decorators: [
    () => (
      <Tabs defaultTab="alerts" variant="line">
        <TabList>
          <TabTrigger id="alerts">
            <span className="flex items-center gap-2">
              Alerts <Badge label="3" variant="alert" />
            </span>
          </TabTrigger>
          <TabTrigger id="warnings">
            <span className="flex items-center gap-2">
              Warnings <Badge label="7" variant="hazard" />
            </span>
          </TabTrigger>
          <TabTrigger id="info">
            <span className="flex items-center gap-2">
              Info <Badge label="12" variant="ghost" />
            </span>
          </TabTrigger>
        </TabList>
        <TabPanel id="alerts"   className={panelClass}>3 critical alerts require immediate operator response.</TabPanel>
        <TabPanel id="warnings" className={panelClass}>7 warnings detected — review recommended within 24 hours.</TabPanel>
        <TabPanel id="info"     className={panelClass}>12 informational notices. No action required.</TabPanel>
      </Tabs>
    ),
  ],
};
