export const ModelOpenAiEmbedding = {
  textEmbedding3Large: 'text-embedding-3-large',
  textEmbedding3Small: 'text-embedding-3-small',
  textEmbeddingAda002: 'text-embedding-ada-002',
} as const;

export type ModelOpenAiEmbedding = (typeof ModelOpenAiEmbedding)[keyof typeof ModelOpenAiEmbedding];
