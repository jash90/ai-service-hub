import { ModelDeepSeek } from '../deepSeek/ModelDeepSeek';
import { ModelClaude } from '../claude/ModelClaude';
import { ModelGrok } from '../grok/modelGrok';
import { ModelOpenAi } from '../openAi/ModelOpenAi';
import { ModelPerplexity } from '../perplexity/ModelPerplexity';

export type GlobalInstanceModel =
  | ModelOpenAi
  | ModelDeepSeek
  | ModelPerplexity
  | ModelGrok
  | ModelClaude
  | string;
