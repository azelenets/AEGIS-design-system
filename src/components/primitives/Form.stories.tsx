import type { Meta, StoryObj } from '@storybook/react-vite';
import Form, { FormSection, FormRow, FormActions } from './Form';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Button from './Button';

const meta: Meta<typeof Form> = {
  title: 'Primitives/Form',
  component: Form,
  decorators: [(Story) => <div className="max-w-lg"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Form>;

const clearanceOptions = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'omega', label: 'Omega' },
];

export const SimpleForm: Story = {
  decorators: [
    () => (
      <div className="max-w-sm">
        <Form>
          <Input label="Operator ID" placeholder="Enter ID..." />
          <Input label="Passphrase" type="password" placeholder="••••••••" />
          <FormActions>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary" icon="login">Authenticate</Button>
          </FormActions>
        </Form>
      </div>
    ),
  ],
};

export const WithSections: Story = {
  decorators: [
    () => (
      <Form>
        <FormSection title="Operator Identity" description="Primary identification credentials.">
          <FormRow cols={2}>
            <Input label="Call Sign" placeholder="Enter call sign..." />
            <Input label="Unit ID" placeholder="e.g. UNIT-007" />
          </FormRow>
          <Input label="Email" type="email" placeholder="operator@aegis.io" icon="mail" />
        </FormSection>
        <FormSection title="Mission Parameters" description="Configure the deployment objective.">
          <Select label="Clearance Level" options={clearanceOptions} placeholder="Select level..." />
          <FormRow cols={2}>
            <Input label="Sector" placeholder="Sector code..." />
            <Input label="Duration (hrs)" type="number" placeholder="0" />
          </FormRow>
          <Textarea label="Objective Brief" placeholder="Describe the mission objective..." />
        </FormSection>
        <FormActions>
          <Button variant="ghost">Abort</Button>
          <Button variant="secondary">Save Draft</Button>
          <Button variant="primary" icon="rocket_launch">Deploy</Button>
        </FormActions>
      </Form>
    ),
  ],
};

export const SingleColumnSection: Story = {
  decorators: [
    () => (
      <div className="max-w-sm">
        <Form>
          <FormSection title="Access Request">
            <FormRow cols={1}>
              <Input label="Full Name" placeholder="Operator name..." />
              <Input label="Badge Number" placeholder="B-0000" />
              <Select label="Department" options={clearanceOptions} placeholder="Select..." />
              <Textarea label="Reason for Access" placeholder="Explain the requirement..." />
            </FormRow>
          </FormSection>
          <FormActions align="right">
            <Button variant="primary">Submit Request</Button>
          </FormActions>
        </Form>
      </div>
    ),
  ],
};

export const FourColumnRow: Story = {
  decorators: [
    () => (
      <div className="max-w-2xl">
        <Form>
          <FormSection title="Coordinates">
            <FormRow cols={4}>
              <Input label="Zone" placeholder="Z-1" />
              <Input label="Grid X" placeholder="0000" />
              <Input label="Grid Y" placeholder="0000" />
              <Input label="Altitude" placeholder="m" />
            </FormRow>
          </FormSection>
          <FormActions>
            <Button variant="primary" icon="my_location">Lock Target</Button>
          </FormActions>
        </Form>
      </div>
    ),
  ],
};
