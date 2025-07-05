import {
  GlobalInstance,
  GlobalInstanceCompany,
  GlobalInstanceEmbeddingModel,
  GlobalInstanceModel,
  GlobalInstanceParameters,
  GlobalInstanceVisionModel,
} from './global';
import {
  ModelOpenAi,
  ModelOpenAiEmbedding,
  ModelOpenAIVision,
  OpenAiInstance,
  ModelOpenAiVoice,
  ModelTtsOpenAi,
} from './openAi';
import { GeminiInstance, ModelGemini } from './gemini';
import { DeepSeekInstance, ModelDeepSeek, TemperatureDeepSeek } from './deepSeek';
import { ModelPerplexity, PerplexityInstance } from './perplexity';
import { GrokInstance, ModelGrok } from './grok';
import { ClaudeInstance, ModelClaude } from './claude';
import LmStudioInstance from './lmstudio/LmStudioInstance';
import OIlamaInstance from './ollama/OIlamaInstance';
import QdrantInstance from './qdrant/QdrantInstance';
import { ResponseFormat } from './common/responseFormat';
export {
  OpenAiInstance,
  QdrantInstance,
  OIlamaInstance,
  DeepSeekInstance,
  GeminiInstance,
  LmStudioInstance,
  PerplexityInstance,
  GrokInstance,
  ClaudeInstance,
  GlobalInstance,
  GlobalInstanceCompany,
  GlobalInstanceEmbeddingModel,
  GlobalInstanceModel,
  GlobalInstanceParameters,
  GlobalInstanceVisionModel,
  ModelOpenAi,
  ModelOpenAiEmbedding,
  ModelOpenAIVision,
  ModelOpenAiVoice,
  ModelTtsOpenAi,
  ModelPerplexity,
  ModelGrok,
  ModelDeepSeek,
  ModelGemini,
  ModelClaude,
  ResponseFormat,
  TemperatureDeepSeek,
};

// Export new types and utilities
export * from './types';
export { ModelRegistry } from './utils/ModelRegistry';
