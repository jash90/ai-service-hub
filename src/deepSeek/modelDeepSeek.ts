export const ModelDeepSeek = {
  deepseekChat: 'deepseek-chat',
  deepseekReasoner: 'deepseek-reasoner',
} as const;

export type ModelDeepSeek = (typeof ModelDeepSeek)[keyof typeof ModelDeepSeek];
