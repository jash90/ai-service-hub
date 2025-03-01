import { ModelDeepSeek } from "../deepSeek/modelDeepSeek";
import { ModelGemini } from "../gemini/modelGemini";
import { ModelOpenAi } from "../openAi/ModelOpenAi";
import { ModelPerplexity } from "../perplexity/modelPerplexity";

export type GlobalInstanceModel = ModelDeepSeek | ModelGemini | ModelOpenAi | ModelPerplexity | string