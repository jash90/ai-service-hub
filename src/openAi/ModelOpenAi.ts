export const ModelOpenAi = {
  gpt4oMini: 'gpt-4o-mini',
  gpt4o: 'gpt-4o',
  gpt35Turbo: 'gpt-3.5-turbo',
  gpt45Preview: 'gpt-4.5-preview',
  gpt4: 'gpt-4',
  gpt4Turbo: 'gpt-4-turbo',
  gpt4TurboPreview: 'gpt-4-turbo-preview',
  gpt4VisionPreview: 'gpt-4-vision-preview',
  o1: 'o1',
  o1Mini: 'o1-mini',
  o1Preview: 'o1-preview',
  o3Mini: 'o3-mini',
  chatgpt4oLatest: 'chatgpt-4o-latest',
  chatgpt4oMini: 'chatgpt-4o-mini',
} as const;

export type ModelOpenAi = (typeof ModelOpenAi)[keyof typeof ModelOpenAi];
