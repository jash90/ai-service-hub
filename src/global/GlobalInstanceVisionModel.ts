import { ModelClaude } from '../claude/ModelClaude';
import { ModelGrokVision } from '../grok/modelGrokVision';
import { ModelOpenAIVision } from '../openAi/ModelOpenAIVision';
import { ModelGeminiVison } from '../gemini/ModelGeminiVison';

export type GlobalInstanceVisionModel =
  | ModelOpenAIVision
  | ModelGrokVision
  | ModelClaude
  | ModelGeminiVison
  | string;
