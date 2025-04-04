export const ModelOpenAiEmbedding = {
  textEmbedding3Small: 'text-embedding-3-small',
  textEmbedding3Large: 'text-embedding-3-large',
  textEmbeddingAda002: 'text-embedding-ada-002',
} as const;

export type ModelOpenAiEmbedding = (typeof ModelOpenAiEmbedding)[keyof typeof ModelOpenAiEmbedding];
