export const ModelClaude = {
  claude37SonnetLatest: 'claude-3-7-sonnet-latest',
  claude35HaikuLatest: 'claude-3-5-haiku-latest',
  claude35SonnetLatest: 'claude-3-5-sonnet-latest',
  claude35Sonnet20240620: 'claude-3-5-sonnet-20240620',
  claude3OpusLatest: 'claude-3-opus-latest',
  claude3Sonnet20240229: 'claude-3-sonnet-20240229',
  claude3Haiku20240307: 'claude-3-haiku-20240307',
} as const;

export type ModelClaude = (typeof ModelClaude)[keyof typeof ModelClaude];
