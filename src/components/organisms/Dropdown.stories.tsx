import type { Meta } from '@storybook/react-vite';
import Dropdown, { DropdownItem, DropdownSeparator, DropdownGroup } from './Dropdown';
import Button from '@/components/atoms/Button';

const meta: Meta<typeof Dropdown> = { title: 'Organisms/Dropdown', component: Dropdown, parameters: { layout: 'centered' } };
export default meta;

export const Default = {
  render: () => (
    <Dropdown trigger={<Button variant="secondary" icon="expand_more">Actions</Button>}>
      <DropdownItem label="View Details"  icon="visibility" />
      <DropdownItem label="Edit Record"   icon="edit" />
      <DropdownItem label="Duplicate"     icon="content_copy" />
      <DropdownSeparator />
      <DropdownItem label="Delete"        icon="delete" variant="danger" />
    </Dropdown>
  ),
};

export const WithGroups = {
  render: () => (
    <Dropdown trigger={<Button variant="secondary" icon="more_vert">Menu</Button>} width="220px">
      <DropdownGroup label="Operator">
        <DropdownItem label="Profile"      icon="person"       hint="View your record" />
        <DropdownItem label="Preferences"  icon="tune" />
      </DropdownGroup>
      <DropdownSeparator />
      <DropdownGroup label="Session">
        <DropdownItem label="Switch Unit"  icon="swap_horiz" />
        <DropdownItem label="Sign Out"     icon="logout" variant="danger" />
      </DropdownGroup>
    </Dropdown>
  ),
};

export const AlignRight = {
  render: () => (
    <Dropdown trigger={<Button variant="ghost" icon="expand_more">Right-aligned</Button>} align="right">
      <DropdownItem label="Alpha Sector" icon="radar" />
      <DropdownItem label="Beta Sector"  icon="radar" />
      <DropdownItem label="Omega Sector" icon="radar" />
    </Dropdown>
  ),
};

export const WithDisabledItems = {
  render: () => (
    <Dropdown trigger={<Button variant="secondary">Options</Button>}>
      <DropdownItem label="Available"  icon="check_circle" />
      <DropdownItem label="Locked"     icon="lock" disabled hint="Omega clearance required" />
      <DropdownItem label="Restricted" icon="block" disabled />
    </Dropdown>
  ),
};
