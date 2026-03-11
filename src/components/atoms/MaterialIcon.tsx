import {
  AccountTree,
  Add,
  Adjust,
  Api,
  Architecture,
  ArrowBack,
  ArrowDownward,
  ArrowForward,
  ArrowUpward,
  Badge,
  Block,
  BlurOn,
  Cancel,
  Check,
  CheckBox,
  CheckBoxOutlineBlank,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Close,
  Code,
  ContentCopy,
  DarkMode,
  Dashboard,
  Delete,
  DensityLarge,
  DensityMedium,
  DensitySmall,
  Description,
  Download,
  Edit,
  EmergencyHome,
  Error,
  FilterList,
  Flag,
  Group,
  Inbox,
  Info,
  Inventory2,
  KeyboardArrowDown,
  LightMode,
  Link,
  Lock,
  Login,
  Logout,
  Mail,
  Memory,
  MilitaryTech,
  MoreVert,
  MyLocation,
  Notifications,
  OpenInNew,
  PauseCircle,
  Person,
  PersonOff,
  PriorityHigh,
  ProgressActivity,
  Radar,
  RadioButtonUnchecked,
  Refresh,
  RocketLaunch,
  Save,
  Science,
  Search,
  SearchInsights,
  Sensors,
  Settings,
  Shield,
  ShieldLock,
  Star,
  StarFill,
  SwapHoriz,
  Terminal,
  Tune,
  UnfoldMore,
  Verified,
  VerifiedUser,
  ViewColumn,
  Visibility,
  Warning,
} from '@material-symbols-svg/react';
import { memo, type ComponentType, type SVGProps } from 'react';

type MaterialSymbolComponent = ComponentType<SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  fill?: string;
}>;

const ICONS = {
  account_tree: AccountTree,
  add: Add,
  adjust: Adjust,
  api: Api,
  architecture: Architecture,
  arrow_back: ArrowBack,
  arrow_downward: ArrowDownward,
  arrow_forward: ArrowForward,
  arrow_upward: ArrowUpward,
  badge: Badge,
  block: Block,
  blur_on: BlurOn,
  cancel: Cancel,
  check: Check,
  check_box: CheckBox,
  check_box_outline_blank: CheckBoxOutlineBlank,
  check_circle: CheckCircle,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  close: Close,
  code: Code,
  content_copy: ContentCopy,
  dark_mode: DarkMode,
  dashboard: Dashboard,
  delete: Delete,
  density_large: DensityLarge,
  density_medium: DensityMedium,
  density_small: DensitySmall,
  description: Description,
  download: Download,
  edit: Edit,
  emergency_home: EmergencyHome,
  error: Error,
  expand_more: KeyboardArrowDown,
  filter_list: FilterList,
  flag: Flag,
  group: Group,
  inbox: Inbox,
  info: Info,
  inventory_2: Inventory2,
  keyboard_arrow_down: KeyboardArrowDown,
  light_mode: LightMode,
  link: Link,
  lock: Lock,
  login: Login,
  logout: Logout,
  mail: Mail,
  memory: Memory,
  military_tech: MilitaryTech,
  more_vert: MoreVert,
  my_location: MyLocation,
  notifications: Notifications,
  open_in_new: OpenInNew,
  pause_circle: PauseCircle,
  person: Person,
  person_off: PersonOff,
  priority_high: PriorityHigh,
  progress_activity: ProgressActivity,
  radar: Radar,
  radio_button_unchecked: RadioButtonUnchecked,
  refresh: Refresh,
  rocket_launch: RocketLaunch,
  save: Save,
  science: Science,
  search: Search,
  search_insights: SearchInsights,
  sensors: Sensors,
  settings: Settings,
  shield: Shield,
  shield_lock: ShieldLock,
  star: Star,
  swap_horiz: SwapHoriz,
  terminal: Terminal,
  tune: Tune,
  unfold_more: UnfoldMore,
  verified: Verified,
  verified_user: VerifiedUser,
  view_column: ViewColumn,
  visibility: Visibility,
  warning: Warning,
} satisfies Record<string, MaterialSymbolComponent>;

export type MaterialIconName = keyof typeof ICONS;

export interface MaterialIconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: MaterialIconName;
  filled?: boolean;
}

const FILLED_ICONS: Partial<Record<MaterialIconName, MaterialSymbolComponent>> = {
  star: StarFill,
};

const FallbackIcon = Info;
const warnedNames = new Set<string>();

const MaterialIcon = ({ name, filled = false, className = '', ...rest }: MaterialIconProps) => {
  const outlinedIcon = ICONS[name];
  const Icon = (filled ? FILLED_ICONS[name] : undefined) ?? outlinedIcon ?? FallbackIcon;

  if (!outlinedIcon && !warnedNames.has(name)) {
    warnedNames.add(name);
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn(`[AEGIS] Unknown MaterialIcon name: ${name}`);
    }
  }

  return (
    <Icon
      aria-hidden={rest['aria-label'] ? undefined : true}
      size="1em"
      className={['inline-block shrink-0 align-middle', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
};

const MemoMaterialIcon = memo(MaterialIcon);
MemoMaterialIcon.displayName = 'MaterialIcon';

export default MemoMaterialIcon;
