export const ModelGeminiVison = {
  gemini10ProVisionLatest: 'gemini-1.0-pro-vision-latest',
  geminiProVision: 'gemini-pro-vision',
} as const;

export type ModelGeminiVison = (typeof ModelGeminiVison)[keyof typeof ModelGeminiVison];
