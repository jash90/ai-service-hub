import { ModelGrok } from "../grok/modelGrok";
import { ModelOpenAIVision } from "../openAi/ModelOpenAIVision";

export type GlobalInstanceVisionModel = ModelOpenAIVision | ModelGrok.grok1Vision | string;

