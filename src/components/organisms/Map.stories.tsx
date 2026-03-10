import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Map, { type MapMarker } from './Map';
import Button from '@/components/atoms/Button';

const meta: Meta<typeof Map> = {
  title: 'Organisms/Map',
  component: Map,
  parameters: { layout: 'padded' },
  args: {
    ariaLabel: 'AEGIS mission map',
    height: 400,
  },
};

export default meta;
type Story = StoryObj<typeof Map>;

const londonMarkers: MapMarker[] = [
  { id: 'big-ben', lat: 51.5007, lng: -0.1246, title: 'Big Ben', popup: 'Big Ben - Westminster' },
  { id: 'tower-bridge', lat: 51.5081, lng: -0.0759, title: 'Tower Bridge', popup: 'Tower Bridge - Thames crossing' },
  { id: 'british-museum', lat: 51.5194, lng: -0.127, title: 'British Museum', popup: 'British Museum - Bloomsbury' },
  { id: 'tate-modern', lat: 51.5033, lng: -0.1196, title: 'Tate Modern', popup: 'Tate Modern - Bankside' },
];

const tokyoMarkers: MapMarker[] = [
  { id: 'shibuya', lat: 35.6595, lng: 139.7005, title: 'Shibuya Crossing', popup: 'Shibuya Crossing - High-density pedestrian junction' },
  { id: 'skytree', lat: 35.7101, lng: 139.8107, title: 'Tokyo Skytree', popup: 'Tokyo Skytree - Broadcast tower' },
];

const newYorkMarkers: MapMarker[] = [
  { id: 'empire-state', lat: 40.7484, lng: -73.9857, title: 'Empire State', popup: 'Empire State Building - Midtown relay' },
  { id: 'liberty', lat: 40.6892, lng: -74.0445, title: 'Statue of Liberty', popup: 'Statue of Liberty - Harbor approach' },
];

const ViewportSyncStory = () => {
  const [scenario, setScenario] = useState<'london' | 'tokyo'>('london');

  const config = scenario === 'london'
    ? { center: [51.505, -0.09] as [number, number], zoom: 12, markers: londonMarkers }
    : { center: [35.6762, 139.6503] as [number, number], zoom: 11, markers: tokyoMarkers };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => setScenario('london')}>
          Load London
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setScenario('tokyo')}>
          Load Tokyo
        </Button>
      </div>
      <Map
        ariaLabel="AEGIS dynamic viewport map"
        center={config.center}
        zoom={config.zoom}
        markers={config.markers}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    center: [51.505, -0.09],
    zoom: 12,
    markers: londonMarkers,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('region', { name: 'AEGIS mission map' })).toBeVisible();
    await expect(canvas.getByLabelText('Big Ben marker')).toBeVisible();
    await expect(canvas.getByLabelText('Tower Bridge marker')).toBeVisible();
    await expect(canvasElement.querySelectorAll('.leaflet-marker-icon').length).toBe(4);
    await expect(canvasElement.querySelector('.leaflet-control-attribution')).toBeTruthy();
  },
};

export const AutoFitMarkers: Story = {
  args: {
    center: [40.7128, -74.006],
    zoom: 13,
    fitMarkers: true,
    markers: newYorkMarkers,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Empire State marker')).toBeVisible();
    await expect(canvas.getByLabelText('Statue of Liberty marker')).toBeVisible();
  },
};

export const ReadOnly: Story = {
  args: {
    center: [40.7128, -74.006],
    zoom: 12,
    interactive: false,
    markers: newYorkMarkers,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('button', { name: '+' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: '-' })).not.toBeInTheDocument();
    await expect(canvas.getByLabelText('Empire State marker')).toBeVisible();
  },
};

export const EmptyState: Story = {
  args: {
    center: [48.8566, 2.3522],
    zoom: 11,
    markers: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('region', { name: 'AEGIS mission map' })).toBeVisible();
    await expect(canvas.queryByLabelText(/marker$/i)).not.toBeInTheDocument();
  },
};

export const ViewportSync: Story = {
  render: () => <ViewportSyncStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Big Ben marker')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Load Tokyo' }));

    await waitFor(async () => {
      await expect(canvas.getByLabelText('Shibuya Crossing marker')).toBeVisible();
    });

    await expect(canvas.queryByLabelText('Big Ben marker')).not.toBeInTheDocument();
  },
};
