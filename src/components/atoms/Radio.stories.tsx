import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import RadioGroup, { RadioOption } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Atoms/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  decorators: [
    () => (
      <RadioGroup name="clearance" label="Clearance Level">
        <RadioOption name="clearance" value="alpha" label="Alpha" />
        <RadioOption name="clearance" value="beta" label="Beta" defaultChecked />
        <RadioOption name="clearance" value="omega" label="Omega" />
      </RadioGroup>
    ),
  ],
};

export const WithHints: Story = {
  decorators: [
    () => (
      <RadioGroup name="mode" label="Operation Mode" hint="Determines network exposure during the mission.">
        <RadioOption name="mode" value="silent" label="Silent" hint="No outbound traffic" defaultChecked />
        <RadioOption name="mode" value="active" label="Active" hint="Full network access" />
        <RadioOption name="mode" value="broadcast" label="Broadcast" hint="Public beacon enabled" />
      </RadioGroup>
    ),
  ],
};

export const Horizontal: Story = {
  decorators: [
    () => (
      <RadioGroup name="priority" label="Priority" orientation="horizontal">
        <RadioOption name="priority" value="low" label="Low" />
        <RadioOption name="priority" value="medium" label="Medium" defaultChecked />
        <RadioOption name="priority" value="high" label="High" />
        <RadioOption name="priority" value="critical" label="Critical" />
      </RadioGroup>
    ),
  ],
};

export const WithDisabled: Story = {
  decorators: [
    () => (
      <RadioGroup name="zone" label="Target Zone">
        <RadioOption name="zone" value="alpha" label="Alpha-7" defaultChecked />
        <RadioOption name="zone" value="delta" label="Delta-3" />
        <RadioOption name="zone" value="sigma" label="Sigma-1" hint="Restricted — clearance required" disabled />
      </RadioGroup>
    ),
  ],
};

export const Controlled: Story = {
  decorators: [
    () => {
      const options = [
        { value: 'recon', label: 'Reconnaissance', hint: 'Passive observation only' },
        { value: 'intercept', label: 'Intercept', hint: 'Active signal capture' },
        { value: 'neutralize', label: 'Neutralize', hint: 'Full engagement authorized' },
      ];
      const [selected, setSelected] = useState('recon');

      return (
        <RadioGroup name="mission-type" label="Mission Type">
          {options.map((opt) => (
            <RadioOption
              key={opt.value}
              name="mission-type"
              value={opt.value}
              label={opt.label}
              hint={opt.hint}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
            />
          ))}
        </RadioGroup>
      );
    },
  ],
};
