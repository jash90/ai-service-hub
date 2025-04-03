export const ModelGrok = {
  grok2Vision1212: 'grok-2-vision-1212',
  grok2Vision: 'grok-2-vision',
  grok2VisionLatest: 'grok-2-vision-latest',
  grok2Image1212: 'grok-2-image-1212',
  grok2Image: 'grok-2-image',
  grok2ImageLatest: 'grok-2-image-latest',
  grok21212: 'grok-2-1212',
  grok2: 'grok-2',
  grok2Latest: 'grok-2-latest',
  grokVisionBeta: 'grok-vision-beta',
  grokBeta: 'grok-beta',
} as const;

export type ModelGrok = (typeof ModelGrok)[keyof typeof ModelGrok];
