const ModelOpenAiVoice = {
  nova: 'nova',
  alloy: 'alloy',
  echo: 'echo',
  fable: 'fable',
  onyx: 'onyx',
  shimmer: 'shimmer',
} as const;

export type ModelOpenAiVoice = (typeof ModelOpenAiVoice)[keyof typeof ModelOpenAiVoice];
