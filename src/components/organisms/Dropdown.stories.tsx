import type { Meta } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Actions/ }));
    await expect(within(document.body).getByRole('menu')).toBeVisible();
    await expect(within(document.body).getByRole('menuitem', { name: /Delete/ })).toBeVisible();
  },
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

export const KeyboardFlowSpec = {
  tags: ['!dev'],
  render: () => (
    <Dropdown trigger={<Button variant="secondary" icon="tune">Keyboard Menu</Button>} width="220px">
      <DropdownItem label="Alpha" icon="radar" />
      <DropdownItem label="Bravo" icon="radar" disabled hint="Disabled option" />
      <DropdownItem label="Charlie" icon="radar" />
      <DropdownSeparator />
      <DropdownItem label="Delta" icon="radar" />
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Keyboard Menu' });

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    const menu = within(document.body).getByRole('menu');
    await expect(menu).toBeVisible();
    await waitFor(async () => {
      await expect(within(document.body).getByRole('menuitem', { name: /Alpha/ })).toHaveFocus();
    });

    await userEvent.keyboard('{ArrowDown}');
    await expect(within(document.body).getByRole('menuitem', { name: /Charlie/ })).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(within(document.body).getByRole('menuitem', { name: /Delta/ })).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(within(document.body).getByRole('menuitem', { name: /Alpha/ })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};

export const OutsideDismissSpec = {
  tags: ['!dev'],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
        <button type="button">Outside area</button>
      </div>
    ),
  ],
  render: () => (
    <Dropdown trigger={<Button variant="secondary">Dismiss Test</Button>}>
      <DropdownItem label="Inspect" icon="search" />
      <DropdownItem label="Archive" icon="inventory_2" />
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss Test' }));
    await expect(within(document.body).getByRole('menu')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Outside area' }));
    await expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument();
  },
};
