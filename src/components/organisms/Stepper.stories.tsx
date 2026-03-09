import type { Meta } from '@storybook/react-vite';
import Stepper from './Stepper';

const meta: Meta<typeof Stepper> = { title: 'Organisms/Stepper', component: Stepper };
export default meta;

const stepsPartial = [
  { id: '1', title: 'Identity',    description: 'Verify operator ID',   status: 'complete' as const },
  { id: '2', title: 'Clearance',   description: 'Auth level check',     status: 'complete' as const },
  { id: '3', title: 'Deploy',      description: 'Configure deployment', status: 'active' as const },
  { id: '4', title: 'Confirm',     description: 'Final review',         status: 'pending' as const },
];

const stepsError = [
  { id: '1', title: 'Identity',  status: 'complete' as const },
  { id: '2', title: 'Clearance', status: 'error' as const, description: 'Auth failed' },
  { id: '3', title: 'Deploy',    status: 'pending' as const },
  { id: '4', title: 'Confirm',   status: 'pending' as const },
];

export const Horizontal = { render: () => <div className="max-w-xl"><Stepper steps={stepsPartial} /></div> };
export const HorizontalWithError = { render: () => <div className="max-w-xl"><Stepper steps={stepsError} /></div> };
export const Vertical = { render: () => <div className="max-w-xs"><Stepper steps={stepsPartial} orientation="vertical" /></div> };
export const VerticalWithError = { render: () => <div className="max-w-xs"><Stepper steps={stepsError} orientation="vertical" /></div> };

export const WithContent = {
  render: () => (
    <div className="max-w-xl">
      <Stepper steps={stepsPartial} orientation="vertical">
        <div className="bg-surface-terminal border border-primary/20 p-4 text-xs font-mono text-slate-400">
          Active step content — configure your deployment parameters here.
        </div>
      </Stepper>
    </div>
  ),
};
