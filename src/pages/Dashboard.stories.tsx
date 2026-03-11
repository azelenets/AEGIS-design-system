import { useCallback, useMemo, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import type { Meta } from '@storybook/react-vite';

// ─── Foundations ──────────────────────────────────────────────────────────────
import { ThemeProvider } from '@/foundations/ThemeContext';

// ─── Organisms ────────────────────────────────────────────────────────────────
import Navbar                                               from '@/components/organisms/Navbar';
import type { SidebarGroup }                                from '@/components/organisms/Sidebar';
import type { FooterGroup }                                 from '@/components/organisms/Footer';
import Dropdown, { DropdownItem, DropdownSeparator, DropdownGroup } from '@/components/organisms/Dropdown';
import Sidebar                                             from '@/components/organisms/Sidebar';
import Tabs, { TabList, TabTrigger, TabPanel }             from '@/components/organisms/Tabs';
import Table                                               from '@/components/organisms/Table';
import DataGrid, { type DataGridColumn }                   from '@/components/organisms/DataGrid';
import Modal, { ModalHeader, ModalBody, ModalFooter }      from '@/components/organisms/Modal';
import Carousel, { CarouselSlide }                         from '@/components/organisms/Carousel';
import Stepper                                             from '@/components/organisms/Stepper';
import Wizard                                              from '@/components/organisms/Wizard';
import Footer                                              from '@/components/organisms/Footer';
import { ToastProvider, Toaster, useToast }                from '@/components/organisms/Toast';
import Map                                                  from '@/components/organisms/Map';

// ─── Layout ───────────────────────────────────────────────────────────────────
import PageHeader                                          from '@/components/layout/PageHeader';
import Container                                           from '@/components/layout/Container';
import Grid, { GridItem }                                  from '@/components/layout/Grid';
import Overlay                                             from '@/components/layout/Overlay';
import { HStack, VStack, ZStack, Spacer, Center }          from '@/components/layout/Stack';

// ─── Molecules ────────────────────────────────────────────────────────────────
import Card, { CardHeader, CardBody, CardFooter }          from '@/components/molecules/Card';
import Accordion                                           from '@/components/molecules/Accordion';
import Alert                                               from '@/components/molecules/Alert';
import AvatarGroup                                         from '@/components/molecules/AvatarGroup';
import Breadcrumbs                                         from '@/components/molecules/Breadcrumbs';
import Form, { FormSection, FormRow, FormActions }         from '@/components/molecules/Form';
import Pagination                                          from '@/components/molecules/Pagination';
import ProgressBar                                         from '@/components/molecules/ProgressBar';
import ProgressCircle                                      from '@/components/molecules/ProgressCircle';

// ─── Atoms ────────────────────────────────────────────────────────────────────
import Avatar                                              from '@/components/atoms/Avatar';
import Badge                                               from '@/components/atoms/Badge';
import Button                                              from '@/components/atoms/Button';
import Checkbox                                            from '@/components/atoms/Checkbox';
import Divider                                             from '@/components/atoms/Divider';
import Input                                               from '@/components/atoms/Input';
import Kbd                                                 from '@/components/atoms/Kbd';
import RadioGroup, { RadioOption }                         from '@/components/atoms/Radio';
import Rating                                              from '@/components/atoms/Rating';
import SearchInput                                         from '@/components/atoms/SearchInput';
import Select                                              from '@/components/atoms/Select';
import Skeleton                                            from '@/components/atoms/Skeleton';
import Slider                                              from '@/components/atoms/Slider';
import Spinner                                             from '@/components/atoms/Spinner';
import MaterialIcon                                        from '@/components/atoms/MaterialIcon';
import Tag                                                 from '@/components/atoms/Tag';
import Textarea                                            from '@/components/atoms/Textarea';
import ThemeToggle                                         from '@/components/atoms/ThemeToggle';
import Toggle                                              from '@/components/atoms/Toggle';
import Tooltip                                             from '@/components/atoms/Tooltip';

// ─── Domain ───────────────────────────────────────────────────────────────────
import StatCard                                            from '@/components/dashboard/StatCard';
import StatBlock                                           from '@/components/dashboard/StatBlock';
import FilterButton                                        from '@/components/arsenal/FilterButton';
import SpecCard                                            from '@/components/arsenal/SpecCard';
import StatusItem                                          from '@/components/arsenal/StatusItem';
import EntryCard                                           from '@/components/credentials/EntryCard';
import TagGroup                                            from '@/components/credentials/TagGroup';
import TimelineEntry                                       from '@/components/credentials/TimelineEntry';
import LabCard                                             from '@/components/laboratory/LabCard';
import MissionItem                                         from '@/components/mission-log/MissionItem';

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta = {
  title: 'Pages/Dashboard',
  parameters: { layout: 'fullscreen' },
};
export default meta;

// ─── Types ────────────────────────────────────────────────────────────────────
type Operator = Record<string, unknown> & {
  id: string; callsign: string; role: string; status: string; clearance: string; ops: number; lastSeen: string; notes: string;
};

type DGRow = {
  id: string; callsign: string; role: string; clearance: string; status: string; ops: number; lastSeen: string; notes: string;
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const operators: Operator[] = [
  { id: 'OP-001', callsign: 'PHANTOM',  role: 'Lead Engineer',    status: 'ACTIVE',  clearance: 'ALPHA-2', ops: 148, lastSeen: '02:14', notes: 'Primary grid coordinator. Authorized for all sectors.' },
  { id: 'OP-002', callsign: 'VORTEX',   role: 'Backend Systems',  status: 'ACTIVE',  clearance: 'BETA-1',  ops: 92,  lastSeen: '02:08', notes: 'Handling backend API gateway configuration.' },
  { id: 'OP-003', callsign: 'CIPHER',   role: 'Security Analyst', status: 'STANDBY', clearance: 'ALPHA-1', ops: 217, lastSeen: '01:47', notes: 'On standby. Monitoring encrypted traffic logs.' },
  { id: 'OP-004', callsign: 'WRAITH',   role: 'Infra & DevOps',   status: 'OFFLINE', clearance: 'GAMMA-3', ops: 63,  lastSeen: '23:40', notes: 'Last check-in failed. Equipment failure suspected.' },
  { id: 'OP-005', callsign: 'SPECTER',  role: 'Frontend Systems', status: 'ACTIVE',  clearance: 'BETA-2',  ops: 104, lastSeen: '02:19', notes: 'Deployed to frontend systems observation post.' },
];

const STATUS_BADGE: Record<string, ReactNode> = {
  ACTIVE:  <Badge label="Active"  variant="success" dot />,
  STANDBY: <Badge label="Standby" variant="hazard"  dot />,
  OFFLINE: <Badge label="Offline" variant="ghost"   />,
};

const operatorColumns = [
  { key: 'id',        header: 'ID',       width: '80px' },
  { key: 'callsign',  header: 'Callsign', render: (_: unknown, row: Operator) => <span className="font-bold text-slate-200 font-mono">{row.callsign}</span> },
  { key: 'role',      header: 'Role' },
  { key: 'clearance', header: 'Clearance', render: (_: unknown, row: Operator) => <Tag label={row.clearance} variant="primary" /> },
  { key: 'ops',       header: 'Ops', align: 'right' as const, render: (_: unknown, row: Operator) => <span className="tabular-nums text-primary font-mono">{row.ops}</span> },
  { key: 'status',    header: 'Status', align: 'center' as const, render: (_: unknown, row: Operator) => STATUS_BADGE[row.status] ?? null },
];

const dgColumns: DataGridColumn<DGRow>[] = [
  { key: 'id',        header: 'ID',        width: '90px',  sortable: true },
  { key: 'callsign',  header: 'Call Sign',                 sortable: true, filterable: true },
  { key: 'role',      header: 'Role',                      sortable: true },
  { key: 'clearance', header: 'Clearance',                 filterable: true },
  { key: 'status',    header: 'Status',    width: '110px', filterable: true, render: (val) => STATUS_BADGE[String(val)] ?? null },
  { key: 'ops',       header: 'Ops',       align: 'right', sortable: true, width: '80px' },
  { key: 'lastSeen',  header: 'Last Seen', align: 'right', width: '100px' },
];

const stack = [
  { name: 'TypeScript',    detail: 'v5.x',  status: 'PRODUCTION',    isCritical: false },
  { name: 'Ruby on Rails', detail: 'v8.x',  status: 'PRIMARY_STACK', isCritical: true  },
  { name: 'NestJS',        detail: 'v10.x', status: 'PRODUCTION',    isCritical: false },
  { name: 'PostgreSQL',    detail: 'v16',   status: 'PRIMARY_STACK', isMaster:   true  },
  { name: 'Redis',         detail: 'v7.x',  status: 'PRODUCTION',    isCritical: false },
];

const avatars = [
  { src: 'https://i.pravatar.cc/150?img=1' }, { src: 'https://i.pravatar.cc/150?img=2' },
  { src: 'https://i.pravatar.cc/150?img=3' }, { src: 'https://i.pravatar.cc/150?img=4' },
  { src: 'https://i.pravatar.cc/150?img=5' }, { src: 'https://i.pravatar.cc/150?img=6' },
  { src: 'https://i.pravatar.cc/150?img=7' },
];

const zoneOptions = [
  { value: 'alpha', label: 'Zone Alpha' }, { value: 'beta',  label: 'Zone Beta'  },
  { value: 'gamma', label: 'Zone Gamma' }, { value: 'delta', label: 'Zone Delta' },
];

const accordionBulletins = [
  { id: 'b1', trigger: 'Scheduled Maintenance — Zone Gamma',  content: 'Planned downtime 2025-03-15 03:00–05:00 UTC. All active sessions will be terminated. Operators should complete current assignments beforehand.' },
  { id: 'b2', trigger: 'Security Advisory — Elevated Threat', content: 'Anomalous traffic on subnet 10.0.4.x. Enable heightened scanning protocols and report suspicious activity to CIPHER immediately.' },
  { id: 'b3', trigger: 'Deployment Notice — v2.4.1 Release',  content: 'Update v2.4.1 includes API gateway performance improvements and patches 3 critical CVEs. Rollout begins in Zone Alpha at 06:00 UTC.' },
];

const sectorSlides = [
  { id: 'alpha',   label: 'Alpha Sector',   eyebrow: 'SECTOR-01', status: 'ACTIVE',  threat: 'LOW',  color: 'text-primary',   bg: 'bg-primary/5',        border: 'border-primary/20',    risk: 12, badge: 'primary'  as const },
  { id: 'bravo',   label: 'Bravo Sector',   eyebrow: 'SECTOR-02', status: 'STANDBY', threat: 'MED',  color: 'text-hazard',    bg: 'bg-hazard/5',         border: 'border-hazard/20',     risk: 67, badge: 'hazard'   as const },
  { id: 'charlie', label: 'Charlie Sector', eyebrow: 'SECTOR-03', status: 'ALERT',   threat: 'HIGH', color: 'text-alert',     bg: 'bg-alert/5',          border: 'border-alert/20',      risk: 88, badge: 'alert'    as const },
  { id: 'delta',   label: 'Delta Sector',   eyebrow: 'SECTOR-04', status: 'OFFLINE', threat: 'NONE', color: 'text-slate-500', bg: 'bg-surface-terminal', border: 'border-border-dark',   risk: 0,  badge: 'ghost'    as const },
];

const opsMarkers = [
  { lat: 51.505,  lng: -0.090, title: 'Alpha Sector — HQ',    popup: 'SECTOR-01 // ALPHA — Status: ACTIVE' },
  { lat: 52.520,  lng: 13.405, title: 'Bravo Sector — Berlin', popup: 'SECTOR-02 // BRAVO — Status: STANDBY' },
  { lat: 52.237,  lng: 21.017, title: 'Charlie Sector — Warsaw', popup: 'SECTOR-03 // CHARLIE — Status: ALERT' },
  { lat: 50.075,  lng: 14.437, title: 'Delta Sector — Prague',  popup: 'SECTOR-04 // DELTA — Status: OFFLINE' },
];

const stepperSteps = [
  { id: '1', title: 'Initialize', description: 'System bootstrap',  status: 'complete' as const },
  { id: '2', title: 'Authorize',  description: 'Operator verified', status: 'complete' as const },
  { id: '3', title: 'Deploy',     description: 'Target configured', status: 'active'   as const },
  { id: '4', title: 'Confirm',    description: 'Final review',      status: 'pending'  as const },
];

const footerGroups: FooterGroup[] = [
  { id: 'system',    label: 'System',    links: [{ id: 'dash', label: 'Dashboard', href: '#', icon: 'dashboard' }, { id: 'ops', label: 'Operations', href: '#', icon: 'radar' }, { id: 'lab', label: 'Laboratory', href: '#', icon: 'science' }] },
  { id: 'resources', label: 'Resources', links: [{ id: 'docs', label: 'Documentation', href: '#', icon: 'description' }, { id: 'api', label: 'API Reference', href: '#', icon: 'api' }, { id: 'changes', label: 'Changelog', href: '#' }] },
];

const sidebarGroups: SidebarGroup[] = [
  { items: [
    { id: 'dashboard',   label: 'Dashboard',   icon: 'dashboard', active: true },
    { id: 'operators',   label: 'Operators',   icon: 'group',     badge: '5'   },
    { id: 'missions',    label: 'Missions',    icon: 'radar',     badge: '3'   },
  ]},
  { label: 'Config', items: [
    { id: 'arsenal',     label: 'Arsenal',     icon: 'inventory_2' },
    { id: 'credentials', label: 'Credentials', icon: 'badge'       },
    { id: 'lab',         label: 'Laboratory',  icon: 'science'     },
  ]},
];

// ─── Wizard step content (static, defined outside component) ──────────────────
const WizardStepIdentity = () => (
  <div className="flex flex-col gap-4">
    <Input label="Operator ID" placeholder="OPS-XXXX" />
    <Input label="Access Key"  placeholder="••••••••" type="password" />
  </div>
);

const WizardStepClearance = () => (
  <div className="flex flex-col gap-4">
    <Select label="Clearance Level" options={[
      { value: 'alpha', label: 'Alpha — Standard' },
      { value: 'beta',  label: 'Beta — Elevated'  },
      { value: 'sigma', label: 'Sigma — Command'  },
    ]} />
    <Toggle label="Enable Two-Factor Authentication" defaultChecked />
  </div>
);

const WizardStepConfirm = () => (
  <div className="flex flex-col gap-3">
    <Alert variant="warning" title="Pre-authorization check">
      Confirm all settings before completing operator authorization.
    </Alert>
    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
      {[['Operator', 'OPS-XXXX'], ['Clearance', 'Beta'], ['2FA', 'Enabled'], ['Zone', 'Alpha']].map(([k, v]) => (
        <div key={k} className="flex justify-between bg-bg-dark border border-border-dark px-3 py-2">
          <span className="text-slate-600">{k}</span>
          <span className="text-primary/80">{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const wizardSteps = [
  { id: 'identity',  title: 'Identity',  description: 'Verify credentials', content: <WizardStepIdentity  /> },
  { id: 'clearance', title: 'Clearance', description: 'Set auth level',     content: <WizardStepClearance /> },
  { id: 'confirm',   title: 'Confirm',   description: 'Final review',        content: <WizardStepConfirm   /> },
];

// ─── Lab tag helper ───────────────────────────────────────────────────────────
const LabTags = ({ items, rating: r }: { items: string[]; rating: number }) => (
  <div className="flex flex-col gap-2">
    <Rating defaultValue={r} readOnly />
    <div className="flex flex-wrap gap-1.5">
      {items.map(t => (
        <span key={t} className="px-2 py-0.5 bg-primary/5 border border-primary/15 text-primary/60 text-[9px] font-mono tracking-wider">{t}</span>
      ))}
    </div>
  </div>
);

const SidebarToggleButton = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    icon={collapsed ? 'chevron_right' : 'chevron_left'}
    onClick={onToggle}
    className="w-full justify-start border-0 px-3 py-2 text-slate-600 hover:text-slate-300"
  >
    {!collapsed ? 'Collapse' : undefined}
  </Button>
);

const OperatorMenuTrigger = (props: ComponentPropsWithoutRef<typeof Button>) => (
  <Button
    variant="ghost"
    size="sm"
    className="gap-2 border-0 px-2 py-1 normal-case tracking-normal hover:bg-primary/5"
    {...props}
  >
    <Avatar src="https://i.pravatar.cc/150?img=12" size="sm" />
    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-200 tracking-widest uppercase hidden sm:block">PHANTOM</span>
    <MaterialIcon name="expand_more" className="text-[14px] text-slate-600" />
  </Button>
);

const DashboardMetricCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <Card className="bg-surface-terminal">
    <CardBody className="p-3">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
    </CardBody>
  </Card>
);

const AssetArchiveSlide = ({ label, index }: { label: string; index: number }) => (
  <CarouselSlide>
    <div className="relative bg-surface-terminal border border-border-dark overflow-hidden h-40 flex items-center justify-center">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="relative flex flex-col items-center gap-2">
        <span className="font-display text-3xl font-bold text-primary/20 tracking-widest">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  </CarouselSlide>
);

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardContent = () => {
  const { toast } = useToast();

  const [search,          setSearch]          = useState('');
  const [zone,            setZone]            = useState('alpha');
  const [sensitivity,     setSensitivity]     = useState(72);
  const [scanEnabled,     setScanEnabled]     = useState(true);
  const [autoSync,        setAutoSync]        = useState(false);
  const [alertEnabled,    setAlertEnabled]    = useState(true);
  const [missionModalOpen,setMissionModalOpen]= useState(false);
  const [missionName,     setMissionName]     = useState('');
  const [missionType,     setMissionType]     = useState('recon');
  const [missionNotes,    setMissionNotes]    = useState('');
  const [sidebarCollapsed,setSidebarCollapsed]= useState(false);
  const [tablePage,       setTablePage]       = useState(1);
  const [opsFilter,       setOpsFilter]       = useState('all');
  const [labFilter,       setLabFilter]       = useState('all');
  const [missionMode,     setMissionMode]     = useState('recon');
  const [rating,          setRating]          = useState(4);
  const [overlayVisible,  setOverlayVisible]  = useState(false);

  const PAGE_SIZE = 3;
  const normalizedSearch = search.toLowerCase();
  const filteredOperators = useMemo(() => operators.filter((operator) =>
    (opsFilter === 'all' || operator.status === opsFilter) &&
    (operator.callsign.toLowerCase().includes(normalizedSearch) || operator.role.toLowerCase().includes(normalizedSearch))
  ), [normalizedSearch, opsFilter]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredOperators.length / PAGE_SIZE)), [filteredOperators.length]);
  const pagedOps = useMemo(
    () => filteredOperators.slice((tablePage - 1) * PAGE_SIZE, tablePage * PAGE_SIZE),
    [filteredOperators, tablePage],
  );
  const dgRows: DGRow[] = useMemo(() => operators.map((operator) => ({
    id: operator.id,
    callsign: operator.callsign,
    role: operator.role,
    clearance: operator.clearance,
    status: operator.status,
    ops: operator.ops,
    lastSeen: operator.lastSeen,
    notes: operator.notes,
  })), []);
  const assignOperatorOptions = useMemo(
    () => operators.map((operator) => ({ value: operator.id, label: `${operator.callsign} — ${operator.role}` })),
    [],
  );

  const sidebarBrand = useMemo(() => (
    sidebarCollapsed
      ? <MaterialIcon name="shield" className="text-primary text-[20px]" />
      : <span className="flex items-center gap-2"><MaterialIcon name="shield" className="text-primary text-[18px]" /><span className="font-display font-bold text-white text-xs tracking-widest">AEGIS</span></span>
  ), [sidebarCollapsed]);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((value) => !value), []);
  const openMissionModal = useCallback(() => setMissionModalOpen(true), []);
  const closeMissionModal = useCallback(() => setMissionModalOpen(false), []);
  const showOverlay = useCallback(() => setOverlayVisible(true), []);
  const hideOverlay = useCallback(() => setOverlayVisible(false), []);
  const launchMission = useCallback(() => {
    setMissionModalOpen(false);
    toast({ title: 'Mission initiated', message: `${missionName || 'New mission'} is now active.`, variant: 'success' });
  }, [missionName, toast]);

  return (
    <ThemeProvider>
      <div className="h-screen flex overflow-hidden bg-bg-dark font-mono">
        <Toaster position="top-right" />

        {/* ── Sidebar ── */}
            <Sidebar
          brand={sidebarBrand}
          groups={sidebarGroups}
          collapsed={sidebarCollapsed}
          footer={
            <SidebarToggleButton
              collapsed={sidebarCollapsed}
              onToggle={toggleSidebar}
            />
          }
        />

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col overflow-auto">

          {/* ── Navbar ── */}
          <Navbar
            brand={
              <span className="flex items-center gap-2">
                <MaterialIcon name="shield" className="text-primary text-[18px]" />
                <span className="text-sm font-bold font-display text-white tracking-widest">AEGIS</span>
                <Badge label="v2.4.1" variant="ghost" />
              </span>
            }
            items={[
              { id: 'dashboard',   label: 'Dashboard',   active: true },
              { id: 'operators',   label: 'Operators' },
              { id: 'protocols',   label: 'Protocols', badge: '3' },
              { id: 'arsenal',     label: 'Arsenal'   },
            ]}
            actions={
              <HStack gap={2} className="items-center">
                <Badge label="SYSTEM NOMINAL" variant="success" dot />
                <ThemeToggle variant="icon" size="sm" />
                <Dropdown align="right" width="220px" trigger={
                  <OperatorMenuTrigger />
                }>
                  <DropdownGroup label="Operator">
                    <DropdownItem icon="person"    label="Profile"     hint="View operator record" />
                    <DropdownItem icon="tune"      label="Preferences" hint="System settings"      />
                  </DropdownGroup>
                  <DropdownSeparator />
                  <DropdownGroup label="Session">
                    <DropdownItem icon="swap_horiz" label="Switch Zone" hint="Change active zone" />
                    <DropdownItem icon="lock"        label="Lock Screen" />
                  </DropdownGroup>
                  <DropdownSeparator />
                  <DropdownItem icon="logout" label="Sign Out" variant="danger" />
                </Dropdown>
              </HStack>
            }
          />

          {/* ── Breadcrumbs ── */}
          <div className="px-6 py-2 border-b border-border-dark">
            <Breadcrumbs
              items={[{ label: 'AEGIS' }, { label: 'Operations', href: '#' }, { label: 'Dashboard' }]}
              separator="chevron"
            />
          </div>

          {/* ── Content ── */}
          <main className="flex-1 px-6 py-6 flex flex-col gap-6">

            {/* ── Page Header ── */}
            <HStack className="items-end gap-4 flex-wrap">
              <PageHeader
                eyebrow="AEGIS // COMMAND INTERFACE"
                titleMain="Operations"
                titleAccent="Center"
                description="Real-time monitoring and management of active operations, system protocols, and operator assignments."
              />
              <Spacer />
              <HStack gap={2} className="shrink-0 pb-16">
                <Tooltip content="Trigger a test notification">
                  <Button variant="ghost" size="sm" icon="notifications" onClick={() => toast({ title: 'System notice', message: 'All endpoints nominal.', variant: 'info' })}>
                    Alert
                  </Button>
                </Tooltip>
                <Button variant="ghost"   size="sm" icon="refresh"      onClick={() => toast({ title: 'Sync complete', message: 'All 14 endpoints confirmed.', variant: 'success' })}>Sync</Button>
                <Button variant="primary" size="sm" icon="add"           onClick={openMissionModal}>New Mission</Button>
              </HStack>
            </HStack>

            {/* ── Alert variants ── */}
            <VStack gap={2}>
              <Alert variant="warning" title="Scheduled Maintenance Window">
                System downtime scheduled 03:00–04:00 UTC. Operators should complete active sessions beforehand.
              </Alert>
              <Alert variant="danger" title="Breach Detected — Sector Charlie">
                Unauthorized access attempt on subnet 10.0.4.x. CIPHER has been dispatched.
              </Alert>
            </VStack>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard id="01" label="Years Experience"  value="8+ YRS"  progress={80} />
              <StatCard id="02" label="Projects Shipped"  value="200+"    progress={70} />
              <StatCard id="03" label="Uptime SLA"        value="99.9%"   progress={99} />
              <StatCard id="04" label="Clearance Level"   value="ALPHA-2" progress={60} segmented />
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

              {/* ── Left column ── */}
              <div className="flex flex-col gap-6">
                <Tabs defaultTab="overview">
                  <TabList>
                    <TabTrigger id="overview"     icon="dashboard" >Overview</TabTrigger>
                    <TabTrigger id="operators"    icon="group"     >Operators</TabTrigger>
                    <TabTrigger id="credentials"  icon="badge"     >Credentials</TabTrigger>
                    <TabTrigger id="lab"          icon="science"   >Laboratory</TabTrigger>
                    <TabTrigger id="config"       icon="settings"  >Configure</TabTrigger>
                  </TabList>

                  {/* ══ Overview ══ */}
                  <TabPanel id="overview">
                    <VStack gap={4} className="pt-4">

                      {/* Sector Carousel */}
                      <Carousel indicators="bars" autoPlay interval={4000}>
                        {sectorSlides.map(s => (
                          <div key={s.id} className={`${s.bg} border ${s.border} p-8 flex flex-col gap-4`}>
                            <HStack className="justify-between">
                              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{s.eyebrow}</span>
                              <Badge label={s.status} variant={s.badge} dot />
                            </HStack>
                            <h2 className={`font-display text-2xl font-bold tracking-widest uppercase ${s.color}`}>{s.label}</h2>
                            <HStack gap={2}>
                              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Threat Level</span>
                              <span className={`text-[11px] font-bold font-mono ${s.color}`}>{s.threat}</span>
                            </HStack>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              {['PERIMETER', 'INTEL', 'COMMS'].map(label => (
                                <div key={label} className="bg-bg-dark border border-border-dark p-2 text-center">
                                  <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{label}</p>
                                  <p className={`text-[11px] font-bold font-mono mt-1 ${s.color}`}>NOMINAL</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </Carousel>

                      {/* Health + Ops cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card variant="primary">
                          <CardHeader eyebrow="SYSTEM" title="Infrastructure Health" variant="primary" />
                          <CardBody>
                            <VStack gap={3}>
                              <ProgressBar label="API Gateway"      value={97} variant="primary" showValue />
                              <ProgressBar label="Database Cluster" value={84} variant="primary" showValue />
                              <ProgressBar label="Message Queue"    value={61} variant="hazard"  showValue />
                              <ProgressBar label="Cache Layer"      value={92} variant="primary" showValue />
                            </VStack>
                          </CardBody>
                          <CardFooter align="right">
                            <span className="text-[10px] font-mono text-slate-500">Last checked 02:22 UTC</span>
                            <Badge label="3/4 Nominal" variant="success" />
                          </CardFooter>
                        </Card>

                        <Card variant="default">
                          <CardHeader eyebrow="METRICS" title="Mission Summary" />
                          <CardBody>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {[
                                { label: 'Active',    value: '12',  color: 'text-primary'    },
                                { label: 'Completed', value: '148', color: 'text-emerald-400' },
                                { label: 'Pending',   value: '7',   color: 'text-hazard'     },
                                { label: 'Critical',  value: '2',   color: 'text-alert'      },
                              ].map(({ label, value, color }) => (
                                <DashboardMetricCard key={label} label={label} value={value} color={color} />
                              ))}
                            </div>
                            <div className="my-2">
                              <Divider />
                            </div>
                            <HStack className="justify-between items-center mt-2">
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Operators</span>
                              <AvatarGroup avatars={avatars} max={5} size="sm" />
                            </HStack>
                            {/* ZStack badge overlay demo */}
                            <Divider label="ZStack Demo" className="mt-4 mb-3" />
                            <HStack gap={4}>
                              {(['success', 'hazard', 'alert'] as const).map(v => (
                                <ZStack key={v} className="relative inline-flex">
                                  <div className="w-10 h-10 bg-surface-terminal border border-primary/20 flex items-center justify-center">
                                    <MaterialIcon name="shield" className="text-primary text-[18px]" />
                                  </div>
                                  <div className="absolute -top-1.5 -right-1.5">
                                    <Badge label="2" variant={v} solid={true} />
                                  </div>
                                </ZStack>
                              ))}
                            </HStack>
                          </CardBody>
                        </Card>
                      </div>

                      {/* Threat circles */}
                      <Card>
                        <CardHeader eyebrow="THREAT ANALYSIS" title="Sector Risk Assessment" action={<Badge label="Live" variant="alert" dot />} />
                        <CardBody>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { sector: 'ALPHA', risk: 12 }, { sector: 'BETA',  risk: 67 },
                              { sector: 'GAMMA', risk: 88 }, { sector: 'DELTA', risk: 34 },
                            ].map(({ sector, risk }) => (
                              <div key={sector} className="flex flex-col items-center gap-2 p-3 bg-surface-terminal border border-border-dark">
                                <ProgressCircle
                                  value={risk}
                                  variant={risk > 80 ? 'alert' : risk > 50 ? 'hazard' : 'primary'}
                                  size="md"
                                  label={`${risk}%`}
                                />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sector}</p>
                                <Badge label={risk > 80 ? 'HIGH' : risk > 50 ? 'MODERATE' : 'LOW'} variant={risk > 80 ? 'alert' : risk > 50 ? 'hazard' : 'success'} />
                              </div>
                            ))}
                          </div>
                        </CardBody>
                      </Card>

                      {/* Geo Intelligence Map */}
                      <Card>
                        <CardHeader
                          eyebrow="GEO INTELLIGENCE"
                          title="Operational Sector Map"
                          action={<Badge label="Live" variant="alert" dot />}
                        />
                        <CardBody className="p-0">
                          <Map
                            center={[51.8, 10.5]}
                            zoom={4}
                            height={360}
                            markers={opsMarkers}
                          />
                        </CardBody>
                      </Card>

                      {/* StatBlock row */}
                      <Container size="full">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <StatBlock label="Years Experience" value="8+ YRS"  barColor="bg-primary" width="80%" />
                          <StatBlock label="Projects Shipped" value="200+"    barColor="bg-hazard"  width="70%" />
                          <StatBlock label="Uptime SLA"       value="99.9%"   barColor="bg-primary" width="99%" />
                        </div>
                      </Container>

                      {/* Accordion bulletins */}
                      <Card>
                        <CardHeader eyebrow="BULLETINS" title="Operational Notices" />
                        <CardBody>
                          <Accordion items={accordionBulletins} defaultOpen={['b1']} />
                        </CardBody>
                      </Card>

                    </VStack>
                  </TabPanel>

                  {/* ══ Operators ══ */}
                  <TabPanel id="operators">
                    <VStack gap={4} className="pt-4">

                      {/* Filter buttons */}
                      <HStack gap={2} className="flex-wrap">
                        {(['all', 'ACTIVE', 'STANDBY', 'OFFLINE'] as const).map(f => (
                          <FilterButton key={f} label={f === 'all' ? 'All Operators' : f} active={opsFilter === f} onClick={() => { setOpsFilter(f); setTablePage(1); }} />
                        ))}
                      </HStack>

                      {/* SearchInput + Table + Pagination */}
                      <Card>
                        <CardHeader eyebrow="ROSTER" title="Operator Table" />
                        <CardBody>
                          <VStack gap={3}>
                            <HStack gap={2}>
                              <div className="flex-1">
                                <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by callsign or role..." />
                              </div>
                              <Button variant="ghost" size="sm" icon="filter_list">Filter</Button>
                              <Button variant="ghost" size="sm" icon="download">Export</Button>
                            </HStack>
                            <Table columns={operatorColumns} data={pagedOps} keyField="id" striped emptyLabel="No operators match the search criteria" />
                            <HStack className="justify-between items-center">
                              <span className="text-[10px] text-slate-500 font-mono">{filteredOperators.length} of {operators.length} operators</span>
                              <Pagination page={tablePage} total={totalPages} onChange={setTablePage} />
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* DataGrid */}
                      <Card>
                        <CardHeader eyebrow="ADVANCED VIEW" title="Operator DataGrid" action={<Badge label="Sortable · Filterable · Expandable" variant="ghost" />} />
                        <CardBody className="p-0">
                          <DataGrid
                            columns={dgColumns}
                            data={dgRows}
                            keyField="id"
                            searchable
                            striped
                            density="compact"
                            pageSize={4}
                            selectionMode="multi"
                            renderExpanded={(row) => (
                              <div className="px-4 py-2 text-[11px] font-mono text-slate-400 bg-bg-dark border-t border-border-dark">
                                <span className="text-primary/60 mr-2">NOTES:</span>{row.notes}
                              </div>
                            )}
                            actions={(row) => (
                              <Button
                                variant="danger"
                                size="sm"
                                icon="delete"
                                onClick={() => toast({ title: `${row.callsign} removed`, variant: 'warning', message: 'Action recorded in audit log.' })}
                              >
                                Remove
                              </Button>
                            )}
                          />
                        </CardBody>
                      </Card>

                    </VStack>
                  </TabPanel>

                  {/* ══ Credentials ══ */}
                  <TabPanel id="credentials">
                    <VStack gap={6} className="pt-4">

                      {/* Timeline */}
                      <Card>
                        <CardHeader eyebrow="EDUCATION" title="Academic Timeline" />
                        <CardBody>
                          <VStack gap={8}>
                            <TimelineEntry
                              level="LEVEL-6"
                              title="Master of Information Security"
                              organization='National Technical University of Ukraine "KPI"'
                              period="2016 — 2018"
                              distinguished
                              fields={[
                                { label: 'Specialisation', value: 'Cybersecurity & Cryptography' },
                                { label: 'Thesis',         value: 'Zero-Trust Architecture in Distributed Systems' },
                                { label: 'GPA',            value: '5.0 / 5.0' },
                                { label: 'Format',         value: 'Full-time' },
                              ]}
                            />
                            <TimelineEntry
                              level="LEVEL-5"
                              title="Bachelor of Computer Science"
                              organization='National Technical University of Ukraine "KPI"'
                              period="2012 — 2016"
                              fields={[
                                { label: 'Specialisation', value: 'Software Engineering' },
                                { label: 'GPA',            value: '4.8 / 5.0' },
                                { label: 'Format',         value: 'Full-time' },
                              ]}
                            />
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Entry cards */}
                      <div>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-3">Certifications</p>
                        <Grid cols={1} colsMd={2} gap={3}>
                          <GridItem><EntryCard id="01" code="AWS_CSA_PRO"   title="AWS Solutions Architect Professional" full /></GridItem>
                          <GridItem><EntryCard id="02" code="CKA_2024"      title="Certified Kubernetes Administrator"  full /></GridItem>
                          <GridItem><EntryCard id="03" code="OSCP_2023"     title="Offensive Security Certified Professional" /></GridItem>
                          <GridItem><EntryCard id="04" code="CISSP_2022"    title="Certified Information Systems Security Professional" /></GridItem>
                        </Grid>
                      </div>

                      {/* Tag groups */}
                      <HStack gap={4} className="flex-wrap items-start">
                        <div className="flex-1 min-w-[200px]">
                          <TagGroup title="Languages" items={['TypeScript', 'Ruby', 'Python', 'Go', 'SQL', 'Bash']} />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <TagGroup title="Technologies" items={['React', 'NestJS', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes', 'Terraform']} />
                        </div>
                      </HStack>

                      {/* Mission log */}
                      <Card>
                        <CardHeader eyebrow="MISSION LOG" title="Field Operations" />
                        <CardBody>
                          <MissionItem
                            date="2023 — 2025"
                            title="Operation Blacksite"
                            missionRole="Lead Engineer"
                            scanId="SC-4891"
                            objective="Architect and ship a zero-downtime microservices migration for a high-traffic SaaS platform."
                            tactics={[
                              'Decomposed Rails monolith into 6 NestJS services',
                              'Implemented Kafka-based event bus for async communication',
                              'Blue/green deployment with feature-flagged rollout',
                            ]}
                            tools={['NestJS', 'Kafka', 'Kubernetes', 'AWS', 'Terraform']}
                            outcome="MISSION_SUCCESS"
                            status="COMPLETED"
                            statusColor="text-primary bg-primary/10"
                            align="left"
                            imageUrl="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80"
                          />
                        </CardBody>
                      </Card>

                    </VStack>
                  </TabPanel>

                  {/* ══ Laboratory ══ */}
                  <TabPanel id="lab">
                    <VStack gap={4} className="pt-4">

                      {/* Category filters */}
                      <HStack gap={2} className="flex-wrap">
                        {(['all', 'active', 'archived', 'research'] as const).map(f => (
                          <FilterButton key={f} label={f.toUpperCase()} active={labFilter === f} onClick={() => setLabFilter(f)} />
                        ))}
                      </HStack>

                      {/* Lab cards */}
                      <Grid cols={1} colsMd={2} colsLg={3} gap={4}>
                        <GridItem>
                          <LabCard
                            id="LAB-001" codename="SIGNAL_TRACE" title="Signal Trace"
                            desc="Real-time distributed tracing for microservice architectures."
                            status="ACTIVE" statusColor="text-primary border border-primary/30" color="primary"
                            stats="14 ENDPOINTS" action="VIEW" icon="open_in_new" link="#"
                          >
                            <LabTags items={['React', 'TypeScript', 'NestJS']} rating={5} />
                          </LabCard>
                        </GridItem>
                        <GridItem>
                          <LabCard
                            id="LAB-002" codename="CIPHER_VAULT" title="Cipher Vault"
                            desc="Encrypted secrets management with zero-knowledge proofs."
                            status="IN PROGRESS" statusColor="text-hazard border border-hazard/30" color="hazard"
                            stats="3 MODULES" action="VIEW" icon="open_in_new" link="#"
                          >
                            <LabTags items={['Go', 'PostgreSQL', 'Redis']} rating={4} />
                          </LabCard>
                        </GridItem>
                        <GridItem>
                          <LabCard
                            id="LAB-003" codename="GRID_WATCHER" title="Grid Watcher"
                            desc="Anomaly detection across network segments using ML models."
                            status="RESEARCH" statusColor="text-alert border border-alert/30" color="alert"
                            stats="7 MODELS" action="VIEW" icon="open_in_new" link="#"
                          >
                            <LabTags items={['Python', 'TensorFlow', 'Kafka']} rating={3} />
                          </LabCard>
                        </GridItem>
                      </Grid>

                      {/* Spec cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SpecCard
                          title="Visual Language"
                          subtitle="HUD :: TERMINAL :: OPS"
                          img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&q=80"
                        />
                        <SpecCard
                          title="Infrastructure Layer"
                          subtitle="CLOUD :: MESH :: DEPLOY"
                          img="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80"
                        />
                      </div>

                      {/* Media carousel */}
                      <Card>
                        <CardHeader eyebrow="GALLERY" title="Asset Archive" />
                        <CardBody>
                          <Carousel indicators="bars" transition="fade">
                            {['Alpha Grid', 'Bravo Node', 'Charlie Hub', 'Delta Relay'].map((label, i) => (
                              <AssetArchiveSlide key={label} label={label} index={i} />
                            ))}
                          </Carousel>
                        </CardBody>
                      </Card>

                    </VStack>
                  </TabPanel>

                  {/* ══ Configure ══ */}
                  <TabPanel id="config">
                    <VStack gap={6} className="pt-4">

                      {/* Stepper — deployment progress */}
                      <Card>
                        <CardHeader eyebrow="DEPLOYMENT" title="Mission Phase Progress" />
                        <CardBody>
                          <Stepper steps={stepperSteps} />
                        </CardBody>
                      </Card>

                      {/* Wizard — operator onboarding */}
                      <Card>
                        <CardHeader eyebrow="ONBOARDING" title="Operator Authorization Wizard" />
                        <CardBody>
                          <Wizard steps={wizardSteps} completeLabel="Authorize" onComplete={() => toast({ title: 'Operator authorized', message: 'Access granted. Credentials stored securely.', variant: 'success' })} />
                        </CardBody>
                      </Card>

                      {/* Form — mission parameters */}
                      <Card>
                        <CardHeader eyebrow="FORM" title="Mission Parameters" />
                        <CardBody>
                          <Form>
                            <FormSection title="Operator Identity" description="Primary identification credentials.">
                              <FormRow cols={2}>
                                <Input label="Call Sign" placeholder="Enter call sign..." defaultValue="PHANTOM" />
                                <Input label="Unit ID"   placeholder="UNIT-007" defaultValue="UNIT-042" />
                              </FormRow>
                              <Textarea label="Operator Bio" placeholder="Brief operator background..." hint="Visible to command team only" rows={3} />
                            </FormSection>
                            <FormSection title="Mission Parameters" description="Configure the deployment objective.">
                              <Select label="Assigned Zone" options={zoneOptions} value={zone} onChange={setZone} />
                              <FormRow cols={2}>
                                <Input label="Sector Code"     placeholder="e.g. ALPHA-7" />
                                <Input label="Duration (hrs)"  placeholder="48" type="number" />
                              </FormRow>
                              <RadioGroup name="mission-mode" label="Operation Mode" hint="Determines network exposure.">
                                <RadioOption name="mission-mode" value="recon"      label="Reconnaissance" hint="Passive observation only" checked={missionMode === 'recon'}      onChange={() => setMissionMode('recon')} />
                                <RadioOption name="mission-mode" value="active"     label="Active Ops"    hint="Full network access"     checked={missionMode === 'active'}     onChange={() => setMissionMode('active')} />
                                <RadioOption name="mission-mode" value="broadcast"  label="Broadcast"     hint="Public beacon enabled"   checked={missionMode === 'broadcast'}  onChange={() => setMissionMode('broadcast')} />
                              </RadioGroup>
                              <Slider
                                label="Detection Sensitivity"
                                value={sensitivity}
                                min={0} max={100}
                                onChange={e => setSensitivity(Number(e.target.value))}
                                hint="Higher values increase false positive rate"
                                formatValue={v => `${v}%`}
                              />
                            </FormSection>
                            <Divider label="Access Flags" />
                            <VStack gap={3}>
                              <Toggle label="Enable Active Scanning"       hint="Continuously monitor for anomalies"  checked={scanEnabled}  onChange={e => setScanEnabled(e.target.checked)} />
                              <Toggle label="Auto-Sync with HQ"            hint="Push updates every 60 seconds"       checked={autoSync}     onChange={e => setAutoSync(e.target.checked)}     variant="hazard" />
                              <Toggle label="Critical Alert Notifications" checked={alertEnabled} onChange={e => setAlertEnabled(e.target.checked)} variant="alert" />
                            </VStack>
                            <Divider label="Permissions" />
                            <VStack gap={2}>
                              <Checkbox label="Read system logs"    defaultChecked hint="View-only access to all log streams" />
                              <Checkbox label="Execute protocols"   defaultChecked />
                              <Checkbox label="Manage operators"    />
                              <Checkbox label="Modify threat rules" indeterminate />
                            </VStack>
                            <FormActions>
                              <Button variant="ghost">Reset</Button>
                              <Button variant="primary" icon="save">Save Configuration</Button>
                            </FormActions>
                          </Form>
                        </CardBody>
                      </Card>

                      {/* Components showcase */}
                      <Card>
                        <CardHeader eyebrow="SHOWCASE" title="UI Components" />
                        <CardBody>
                          <VStack gap={6}>

                            {/* Rating */}
                            <div>
                              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-3">Rating</p>
                              <VStack gap={2}>
                                <Rating label="Operator Reliability" value={rating} onChange={setRating} />
                                <Rating label="Mission Difficulty"   defaultValue={3} variant="hazard" />
                                <Rating label="Threat Assessment"    defaultValue={5} variant="hazard" readOnly />
                              </VStack>
                            </div>

                            <Divider />

                            {/* Spinners */}
                            <div>
                              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-3">Spinners</p>
                              <HStack gap={6} className="flex-wrap">
                                <Center className="flex-col gap-1">
                                  <Spinner size="sm" variant="primary" />
                                  <span className="text-[9px] text-slate-600 font-mono">sm / primary</span>
                                </Center>
                                <Center className="flex-col gap-1">
                                  <Spinner size="md" variant="hazard" />
                                  <span className="text-[9px] text-slate-600 font-mono">md / hazard</span>
                                </Center>
                                <Center className="flex-col gap-1">
                                  <Spinner size="lg" variant="alert" label="Loading..." />
                                  <span className="text-[9px] text-slate-600 font-mono">lg / alert</span>
                                </Center>
                                <Center className="flex-col gap-1">
                                  <Spinner size="md" variant="ghost" />
                                  <span className="text-[9px] text-slate-600 font-mono">md / ghost</span>
                                </Center>
                              </HStack>
                            </div>

                            <Divider />

                            {/* Skeleton */}
                            <div>
                              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-3">Skeleton</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <VStack gap={2}>
                                  <Skeleton shape="text" lines={3} />
                                </VStack>
                                <VStack gap={2}>
                                  <HStack gap={2}>
                                    <Skeleton shape="avatar" />
                                    <VStack gap={1} className="flex-1">
                                      <Skeleton shape="text" lines={1} />
                                      <Skeleton shape="text" lines={1} width="60%" />
                                    </VStack>
                                  </HStack>
                                  <Skeleton shape="box" height="60px" />
                                </VStack>
                              </div>
                            </div>

                            <Divider />

                            {/* Tooltip + Kbd */}
                            <div>
                              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-3">Tooltip & Keyboard Shortcuts</p>
                              <HStack gap={4} className="flex-wrap items-start">
                                <VStack gap={2}>
                                  <Tooltip content="Open command palette" placement="top">
                                    <Button variant="ghost" size="sm" icon="terminal">Command Palette</Button>
                                  </Tooltip>
                                  <Tooltip content="Download operator report" placement="right">
                                    <Button variant="ghost" size="sm" icon="download">Export Report</Button>
                                  </Tooltip>
                                </VStack>
                                <VStack gap={2}>
                                  <p className="text-xs font-mono text-slate-400">
                                    Open palette: <span className="inline-flex items-center gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
                                  </p>
                                  <p className="text-xs font-mono text-slate-400">
                                    Save config: <span className="inline-flex items-center gap-0.5"><Kbd>Ctrl</Kbd><span className="text-slate-600 text-[10px]">+</span><Kbd>S</Kbd></span>
                                  </p>
                                  <p className="text-xs font-mono text-slate-400">
                                    New mission: <span className="inline-flex items-center gap-0.5"><Kbd>Ctrl</Kbd><span className="text-slate-600 text-[10px]">+</span><Kbd>N</Kbd></span>
                                  </p>
                                </VStack>
                              </HStack>
                            </div>

                            <Divider />

                            {/* Overlay trigger */}
                            <div>
                              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-3">Overlay</p>
                              <Button variant="secondary" size="sm" icon="blur_on" onClick={showOverlay}>
                                Show Full-Screen Overlay
                              </Button>
                              <p className="text-[10px] text-slate-600 font-mono mt-1">Click overlay to dismiss.</p>
                            </div>

                          </VStack>
                        </CardBody>
                      </Card>

                    </VStack>
                  </TabPanel>

                </Tabs>
              </div>

              {/* ── Right sidebar ── */}
              <div className="flex flex-col gap-4">
                <Divider label="Tech Stack" />

                <ul className="flex flex-col gap-1.5">
                  {stack.map(t => <StatusItem key={t.name} {...t} />)}
                </ul>

                <Divider label="Alert Feed" />

                <VStack gap={2}>
                  <Alert variant="info"    title="v2.4.1 deployed">Gateway performance improved 18%.</Alert>
                  <Alert variant="success" title="All zones nominal">No active threats detected.</Alert>
                </VStack>
              </div>

            </div>
          </main>

          {/* ── Footer ── */}
          <Footer
            brand={
              <div className="flex items-center gap-2">
                <MaterialIcon name="shield" className="text-primary text-[18px]" />
                <span className="font-display text-sm font-bold tracking-widest text-primary uppercase">AEGIS</span>
              </div>
            }
            tagline="Advanced Engagement & Grid Intelligence System"
            groups={footerGroups}
            copyright="© 2026 AEGIS OPS · All systems classified"
            bottom={<Badge label="SYSTEM NOMINAL" variant="primary" dot />}
          />
        </div>

        {/* ── New Mission Modal ── */}
        <Modal open={missionModalOpen} onClose={closeMissionModal} size="md">
          <ModalHeader eyebrow="AEGIS // COMMAND" title="Initiate New Mission" onClose={closeMissionModal} />
          <ModalBody>
            <VStack gap={4}>
              <Input
                label="Mission Designation"
                placeholder="e.g. OPERATION NIGHTFALL"
                value={missionName}
                onChange={e => setMissionName(e.target.value)}
              />
              <Select
                label="Mission Type"
                value={missionType}
                onChange={v => setMissionType(v)}
                options={[
                  { value: 'recon',     label: 'Reconnaissance'   },
                  { value: 'extract',   label: 'Data Extraction'  },
                  { value: 'intercept', label: 'Signal Intercept' },
                  { value: 'defend',    label: 'System Defense'   },
                  { value: 'audit',     label: 'Security Audit'   },
                ]}
              />
              <Select label="Assign Operator" options={assignOperatorOptions} />
              <Slider label="Priority Level" min={1} max={5} defaultValue={3} hint="1 = Routine  ·  5 = Critical" />
              <Textarea
                label="Mission Notes"
                placeholder="Describe the objective, constraints, and success criteria..."
                value={missionNotes}
                onChange={e => setMissionNotes(e.target.value)}
                rows={3}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost"   size="sm" onClick={closeMissionModal}>Cancel</Button>
            <Button variant="primary" size="sm" icon="rocket_launch" onClick={launchMission}>
              Launch Mission
            </Button>
          </ModalFooter>
        </Modal>

        {/* ── Full-screen Overlay ── */}
        <Overlay visible={overlayVisible} onClick={hideOverlay} blur />

      </div>
    </ThemeProvider>
  );
};

export const AegisDashboard = {
  name: 'AEGIS Ops Dashboard',
  render: () => (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  ),
};
