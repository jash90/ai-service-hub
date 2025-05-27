export const ModelGeminiEmbedding = {
  embedding001: 'embedding-001',
  textEmbedding004: 'text-embedding-004',
} as const;

export type ModelGeminiEmbedding = (typeof ModelGeminiEmbedding)[keyof typeof ModelGeminiEmbedding];
