import type { Meta } from '@storybook/react-vite';
import AvatarGroup from './AvatarGroup';

const meta: Meta<typeof AvatarGroup> = { title: 'Molecules/AvatarGroup', component: AvatarGroup };
export default meta;

const team = [
  { initials: 'GH', variant: 'primary' as const },
  { initials: 'RV', variant: 'ghost' as const },
  { initials: 'WR', variant: 'primary' as const },
  { initials: 'CP', variant: 'ghost' as const },
  { initials: 'VP', variant: 'hazard' as const },
  { initials: 'SX', variant: 'alert' as const },
  { initials: 'AZ', variant: 'primary' as const },
];

export const Default = { render: () => <AvatarGroup avatars={team} max={4} /> };
export const NoOverflow = { render: () => <AvatarGroup avatars={team.slice(0, 3)} max={5} /> };
export const SmallSize = { render: () => <AvatarGroup avatars={team} max={4} size="sm" /> };
export const LargeSize = { render: () => <AvatarGroup avatars={team} max={4} size="lg" /> };
export const WithIcons = {
  render: () => (
    <AvatarGroup avatars={[
      { icon: 'person', variant: 'primary' as const },
      { icon: 'shield', variant: 'hazard' as const },
      { icon: 'verified_user', variant: 'alert' as const },
    ]} max={5} />
  ),
};
