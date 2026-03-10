import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Wizard from './Wizard';
import Button from '@/components/atoms/Button';
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
          <span className="text-slate-400">{k}</span>
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

const ValidationWizardStory = () => {
  const [attempt, setAttempt] = useState(0);

  const steps = [
    {
      id: 'check',
      title: 'Auth Check',
      description: 'Simulates async validation',
      content: (
        <p className="text-xs font-mono text-slate-400">
          Clicking Next runs a deterministic validation. The first attempt fails, the second passes.
        </p>
      ),
      onNext: () =>
        new Promise<boolean>((resolve) =>
          setTimeout(() => {
            const nextAttempt = attempt + 1;
            setAttempt(nextAttempt);
            resolve(nextAttempt > 1);
          }, 250)
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
};

const ControlledWizardStory = () => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
        Controlled mode: click wizard steps to navigate directly.
      </p>
      {done
        ? <Alert variant="success" title="Sequence complete">All steps authorized.</Alert>
        : <Wizard steps={deploySteps} activeStep={step} onStepChange={setStep} onComplete={() => setDone(true)} />
      }
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <div className="max-w-xl">
      <Wizard steps={deploySteps} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Step 1 / 4')).toBeVisible();
    await expect(canvas.getByText('Operator ID')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Back/i })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: /Next/i }));
    await expect(canvas.getByText('Step 2 / 4')).toBeVisible();
    await expect(canvas.getByText('Clearance Level')).toBeVisible();
  },
};

export const Vertical = {
  render: () => (
    <div className="max-w-2xl">
      <Wizard steps={deploySteps} orientation="vertical" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Identity')).toBeVisible();
    await expect(canvas.getByText('Clearance')).toBeVisible();
    await expect(canvas.getByText('Deploy')).toBeVisible();
    await expect(canvas.getByText('Confirm')).toBeVisible();
  },
};

export const WithValidation = {
  render: () => <ValidationWizardStory />,
};

export const WithValidationSpec = {
  tags: ['!dev'],
  render: () => <ValidationWizardStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole('button', { name: /Next/i });

    await expect(canvas.getByText('Step 1 / 2')).toBeVisible();
    await userEvent.click(next);
    await expect(next).toBeDisabled();
    await expect(canvas.getByText('Step 1 / 2')).toBeVisible();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(next).toBeEnabled();
    await userEvent.click(next);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(canvas.getByText('Step 2 / 2')).toBeVisible();
    await expect(canvas.getByText('Access granted')).toBeVisible();
  },
};

export const Controlled = {
  render: () => <ControlledWizardStory />,
};

export const ControlledFlowSpec = {
  tags: ['!dev'],
  render: () => <ControlledWizardStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Step 1 / 4')).toBeVisible();
    await expect(canvas.getByText('Operator ID')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Go to step 3: Deploy' }));
    await expect(canvas.getByText('Step 3 / 4')).toBeVisible();
    await expect(canvas.getByText('Deploy Tag')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Go to step 4: Confirm' }));
    await expect(canvas.getByText('Step 4 / 4')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: /Complete/i }));
    await expect(canvas.getByText('Sequence complete')).toBeVisible();
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Step 1 / 2')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: /Launch/i })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /Next/i }));
    await expect(canvas.getByRole('button', { name: /Launch/i })).toBeVisible();
  },
};
