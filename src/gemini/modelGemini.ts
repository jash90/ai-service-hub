const ModelGemini = {
  gemini20ProExp0205: 'gemini-2.0-pro-exp-02-05',
  gemini20FlashThinkingExp0121: 'gemini-2.0-flash-thinking-exp-01-21',
  learnlm15ProExperimental: 'learnlm-1.5-pro-experimental',
} as const;

export type ModelGemini = (typeof ModelGemini)[keyof typeof ModelGemini];
