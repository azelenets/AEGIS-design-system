import type { Meta, StoryObj } from '@storybook/react-vite';
import Skeleton from './Skeleton';

const meta: Meta<typeof Skeleton> = { title: 'Atoms/Skeleton', component: Skeleton, decorators: [(S) => <div className="max-w-xs"><S /></div>] };
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLines: Story = { args: { shape: 'text', lines: 3 } };
export const SingleLine: Story = { args: { shape: 'text', lines: 1 } };
export const Box: Story = { args: { shape: 'box', height: '6rem' } };
export const Circle: Story = { args: { shape: 'circle', size: 48 } };
export const AvatarShape: Story = { args: { shape: 'avatar' } };

export const CardSkeleton = {
  render: () => (
    <div className="bg-panel-dark border border-border-dark p-5 flex flex-col gap-4 max-w-xs">
      <div className="flex items-center gap-3">
        <Skeleton shape="avatar" size={36} />
        <div className="flex-1">
          <Skeleton shape="text" lines={1} />
        </div>
      </div>
      <Skeleton shape="box" height="8rem" />
      <Skeleton shape="text" lines={3} />
      <div className="flex gap-2">
        <Skeleton shape="box" width="80px" height="28px" />
        <Skeleton shape="box" width="80px" height="28px" />
      </div>
    </div>
  ),
};

export const TableSkeleton = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton shape="circle" size={28} />
          <div className="flex-1">
            <Skeleton shape="text" lines={1} width={i % 2 === 0 ? '80%' : '60%'} />
          </div>
          <Skeleton shape="box" width="50px" height="18px" />
        </div>
      ))}
    </div>
  ),
};
