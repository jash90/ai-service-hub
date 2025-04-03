export const GlobalInstanceCompany = {
  openai: 'openai',
  ollama: 'ollama',
  deepseek: 'deepseek',
  lmstudio: 'lmstudio',
  perplexity: 'perplexity',
  grok: 'grok',
} as const;

export type GlobalInstanceCompany =
  (typeof GlobalInstanceCompany)[keyof typeof GlobalInstanceCompany];
