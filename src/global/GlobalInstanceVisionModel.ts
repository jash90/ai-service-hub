import { ModelClaude } from '../claude/ModelClaude';
import { ModelGrok } from '../grok/modelGrok';
import { ModelOpenAIVision } from '../openAi/ModelOpenAIVision';

export type GlobalInstanceVisionModel =
  | ModelOpenAIVision
  | typeof ModelGrok.claudes3Opus
  | ModelClaude
  | string;
