export const ModelClaude = {
  claude20: 'claude-2.0',
  claude21: 'claude-2.1',
  claude35Haiku20241022: 'claude-3-5-haiku-20241022',
  claude35Sonnet20240620: 'claude-3-5-sonnet-20240620',
  claude35Sonnet20241022: 'claude-3-5-sonnet-20241022',
  claude37Sonnet20250219: 'claude-3-7-sonnet-20250219',
  claude3Haiku20240307: 'claude-3-haiku-20240307',
  claude3Opus20240229: 'claude-3-opus-20240229',
  claude3Sonnet20240229: 'claude-3-sonnet-20240229',
  claudeOpus420250514: 'claude-opus-4-20250514',
  claudeSonnet420250514: 'claude-sonnet-4-20250514',
} as const;

export type ModelClaude = (typeof ModelClaude)[keyof typeof ModelClaude];
