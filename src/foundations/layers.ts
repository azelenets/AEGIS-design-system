export const aegisLayers = {
  mapScanline: 201,
  mapHud: 1001,
  navbar: 1100,
  overlay: 1200,
  modal: 1300,
  toast: 1400,
} as const;

export type AegisLayerName = keyof typeof aegisLayers;
