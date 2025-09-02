export const ModelGrok = {
  grok21212: 'grok-2-1212',
  grok2Image1212: 'grok-2-image-1212',
  grok2Vision1212: 'grok-2-vision-1212',
  grok3: 'grok-3',
  grok3Fast: 'grok-3-fast',
  grok3Mini: 'grok-3-mini',
  grok3MiniFast: 'grok-3-mini-fast',
} as const;

export type ModelGrok = (typeof ModelGrok)[keyof typeof ModelGrok];
