import type { Meta, StoryObj } from '@storybook/react-vite';
import CertCard from './CertCard';

const meta: Meta<typeof CertCard> = {
  title: 'Credentials/CertCard',
  component: CertCard,
};

export default meta;
type Story = StoryObj<typeof CertCard>;

export const Default: Story = {
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
  args: {
    id: '01',
    hash: 'AWS_CSA_PRO',
    title: 'AWS Solutions Architect Professional',
  },
};
