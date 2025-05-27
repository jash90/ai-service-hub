export const ModelGrokVision = {
  grok2Image1212: 'grok-2-image-1212',
  grok2Vision1212: 'grok-2-vision-1212',
} as const;

export type ModelGrokVision = (typeof ModelGrokVision)[keyof typeof ModelGrokVision];
