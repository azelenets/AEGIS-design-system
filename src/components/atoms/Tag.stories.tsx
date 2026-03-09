import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Tag from './Tag';

const meta: Meta<typeof Tag> = { title: 'Atoms/Tag', component: Tag };
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { label: 'React', variant: 'primary' } };
export const Hazard: Story = { args: { label: 'Unstable', variant: 'hazard' } };
export const Alert: Story = { args: { label: 'Deprecated', variant: 'alert' } };
export const Success: Story = { args: { label: 'Verified', variant: 'success' } };
export const Ghost: Story = { args: { label: 'Draft', variant: 'ghost' } };
export const WithIcon: Story = { args: { label: 'NestJS', variant: 'primary', icon: 'code' } };
export const Removable: Story = { args: { label: 'PostgreSQL', variant: 'primary', onRemove: () => {} } };

export const TagCloud = {
  render: () => {
    const all = ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Docker', 'Redis', 'GraphQL'];
    const [tags, setTags] = useState(all);
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Tag key={t} label={t} variant="primary" onRemove={() => setTags((prev) => prev.filter((x) => x !== t))} />
        ))}
      </div>
    );
  },
};
