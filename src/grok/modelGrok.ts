export const ModelGrok = {
  grok1: 'grok-1',
  grok1Mini: 'grok-1-mini',
  grok1Vision: 'grok-1-vision',
  grok2: 'grok-2-1212',
  grok2Vision: 'grok-2-vision-1212',
} as const;

export type ModelGrok = (typeof ModelGrok)[keyof typeof ModelGrok];
