import { ModelClaude } from '../claude/ModelClaude';
import { ModelGrok } from '../grok/modelGrok';
import { ModelOpenAIVision } from '../openAi/ModelOpenAIVision';

export type GlobalInstanceVisionModel =
  | ModelOpenAIVision
  | typeof ModelGrok.grok2VisionLatest
  | typeof ModelGrok.grok2Vision
  | typeof ModelGrok.grok2Vision1212
  | ModelClaude
  | string;
