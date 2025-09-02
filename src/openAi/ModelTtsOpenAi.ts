export const ModelTtsOpenAi = {
  gpt4oMiniTts: 'gpt-4o-mini-tts',
  tts1: 'tts-1',
  tts11106: 'tts-1-1106',
  tts1Hd: 'tts-1-hd',
  tts1Hd1106: 'tts-1-hd-1106',
} as const;

export type ModelTtsOpenAi = (typeof ModelTtsOpenAi)[keyof typeof ModelTtsOpenAi];
