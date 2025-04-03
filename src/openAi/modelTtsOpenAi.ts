export const ModelTtsOpenAi = {
  tts1: 'tts-1',
  tts1Hd: 'tts-1-hd',
} as const;

export type ModelTtsOpenAi = (typeof ModelTtsOpenAi)[keyof typeof ModelTtsOpenAi];
