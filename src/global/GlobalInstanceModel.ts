import { ModelDeepSeek } from "../deepSeek/ModelDeepSeek";
import { ModelGrok } from "../grok/modelGrok";
import { ModelOpenAi } from "../openAi/ModelOpenAi";
import { ModelPerplexity } from "../perplexity/ModelPerplexity";

export type GlobalInstanceModel = ModelOpenAi | ModelDeepSeek | ModelPerplexity | ModelGrok | string;