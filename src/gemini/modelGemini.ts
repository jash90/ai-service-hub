export const ModelGemini = {
  gemini25ProExp0325: 'gemini-2.5-pro-exp-03-25',
  gemini20Flash: 'gemini-2.0-flash',
  gemini20FlashLite: 'gemini-2.0-flash-lite',
  gemini15Flash: 'gemini-1.5-flash',
  gemini15Flash8b: 'gemini-1.5-flash-8b',
  gemini15Pro: 'gemini-1.5-pro',
  geminiEmbeddingExp: 'gemini-embedding-exp',
  imagen30Generate002: 'imagen-3.0-generate-002',
} as const;

export type ModelGemini = (typeof ModelGemini)[keyof typeof ModelGemini];
