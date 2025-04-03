export const ModelClaude = {
  claude3Opus: 'claude-3-opus-20240229',
  claude3Sonnet: 'claude-3-sonnet-20240229',
  claude3Haiku: 'claude-3-haiku-20240307',
  claude3_5Sonnet: 'claude-3-5-sonnet-20240620',
} as const;

export type ModelClaude = (typeof ModelClaude)[keyof typeof ModelClaude];
