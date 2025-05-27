import { ModelOpenAiEmbedding } from '../openAi/ModelOpenAiEmbedding';
import { ModelGeminiEmbedding } from '../gemini/ModelGeminiEmbedding';

export type GlobalInstanceEmbeddingModel = ModelOpenAiEmbedding | ModelGeminiEmbedding | string;
