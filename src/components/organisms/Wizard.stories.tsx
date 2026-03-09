import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import Wizard from './Wizard';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Toggle from '@/components/atoms/Toggle';
import Alert from '@/components/molecules/Alert';

const meta: Meta<typeof Wizard> = { title: 'Organisms/Wizard', component: Wizard };
export default meta;

// ─── Shared step content ──────────────────────────────────────────────────────

const StepIdentity = () => (
  <div className="flex flex-col gap-4">
    <Input label="Operator ID" placeholder="OPS-XXXX" />
    <Input label="Access Key" placeholder="••••••••" />
  </div>
);

const StepClearance = () => (
  <div className="flex flex-col gap-4">
    <Select
      label="Clearance Level"
      options={[
        { value: 'alpha', label: 'Alpha — Standard' },
        { value: 'beta',  label: 'Beta — Elevated' },
        { value: 'sigma', label: 'Sigma — Command' },
      ]}
    />
    <Toggle label="Enable Two-Factor Auth" defaultChecked />
  </div>
);

const StepDeploy = () => (
  <div className="flex flex-col gap-4">
    <Select
      label="Target Region"
      options={[
        { value: 'eu-west', label: 'EU-WEST' },
        { value: 'us-east', label: 'US-EAST' },
        { value: 'ap-south', label: 'AP-SOUTH' },
      ]}
    />
    <Input label="Deploy Tag" placeholder="v2.4.1-rc" />
  </div>
);

const StepConfirm = () => (
  <div className="flex flex-col gap-3">
    <Alert variant="warning" title="Pre-deployment check">
      Review all settings before issuing the deploy command. This action cannot be undone.
    </Alert>
    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
      {[['Operator', 'OPS-7734'], ['Clearance', 'Sigma'], ['Region', 'EU-WEST'], ['Tag', 'v2.4.1-rc']].map(([k, v]) => (
        <div key={k} className="flex justify-between bg-bg-dark border border-border-dark px-3 py-2">
          <span className="text-slate-600">{k}</span>
          <span className="text-primary/80">{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const deploySteps = [
  { id: 'identity',  title: 'Identity',  description: 'Verify operator',  content: <StepIdentity /> },
  { id: 'clearance', title: 'Clearance', description: 'Auth level',        content: <StepClearance /> },
  { id: 'deploy',    title: 'Deploy',    description: 'Configure target',  content: <StepDeploy /> },
  { id: 'confirm',   title: 'Confirm',   description: 'Final review',      content: <StepConfirm /> },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <div className="max-w-xl">
      <Wizard steps={deploySteps} />
    </div>
  ),
};

export const Vertical = {
  render: () => (
    <div className="max-w-xl">
      <Wizard steps={deploySteps} orientation="vertical" />
    </div>
  ),
};

export const WithValidation = {
  render: () => {
    const steps = [
      {
        id: 'check',
        title: 'Auth Check',
        description: 'Simulates async validation',
        content: (
          <p className="text-xs font-mono text-slate-400">
            Clicking Next will simulate a 1-second validation. It randomly passes or fails — retry if needed.
          </p>
        ),
        onNext: () =>
          new Promise<boolean>((resolve) =>
            setTimeout(() => resolve(Math.random() > 0.4), 1000)
          ),
      },
      {
        id: 'done',
        title: 'Authorized',
        content: (
          <Alert variant="success" title="Access granted">
            Validation passed. Proceed to complete the sequence.
          </Alert>
        ),
      },
    ];
    return (
      <div className="max-w-xl">
        <Wizard steps={steps} completeLabel="Authorize" />
      </div>
    );
  },
};

export const Controlled = {
  render: () => {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    return (
      <div className="max-w-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <span>Controlled step:</span>
          {deploySteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={['px-2 py-0.5 border transition-colors', i === step ? 'border-primary text-primary' : 'border-border-dark text-slate-600 hover:text-slate-300'].join(' ')}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {done
          ? <Alert variant="success" title="Sequence complete">All steps authorized.</Alert>
          : <Wizard steps={deploySteps} activeStep={step} onStepChange={setStep} onComplete={() => setDone(true)} />
        }
      </div>
    );
  },
};

export const TwoStep = {
  render: () => (
    <div className="max-w-sm">
      <Wizard
        completeLabel="Launch"
        steps={[
          { id: 'cfg',    title: 'Configure', content: <StepDeploy /> },
          { id: 'review', title: 'Review',    content: <StepConfirm /> },
        ]}
      />
    </div>
  ),
};
