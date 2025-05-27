export const ModelGemini = {
  embedding001: 'embedding-001',
  gemini10ProVisionLatest: 'gemini-1.0-pro-vision-latest',
  gemini15Flash: 'gemini-1.5-flash',
  gemini15Flash001: 'gemini-1.5-flash-001',
  gemini15Flash001Tuning: 'gemini-1.5-flash-001-tuning',
  gemini15Flash002: 'gemini-1.5-flash-002',
  gemini15Flash8b: 'gemini-1.5-flash-8b',
  gemini15Flash8b001: 'gemini-1.5-flash-8b-001',
  gemini15Pro: 'gemini-1.5-pro',
  gemini15Pro001: 'gemini-1.5-pro-001',
  gemini15Pro002: 'gemini-1.5-pro-002',
  gemini20Flash: 'gemini-2.0-flash',
  gemini20Flash001: 'gemini-2.0-flash-001',
  gemini20FlashLite: 'gemini-2.0-flash-lite',
  gemini20FlashLite001: 'gemini-2.0-flash-lite-001',
  geminiProVision: 'gemini-pro-vision',
  textEmbedding004: 'text-embedding-004',
} as const;

export type ModelGemini = (typeof ModelGemini)[keyof typeof ModelGemini];
