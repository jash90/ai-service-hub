import OpenAiInstance from "./openAi/OpenAiInstance";
import QdrantInstance from "./qdrant/QdrantInstance";
import OIlamaInstance from "./ollama/OIlamaInstance";
import DeepSeekInstance from "./deepSeek/DeepSeekInstance";
import GeminiInstance from "./gemini/GeminiInstance";
import LmStudioInstance from "./lmstudio/LmStudioInstance";
import PerplexityInstance from "./perplexity/PerplexityInstance";
import GrokInstance from "./grok/GrokInstance";
import { GlobalInstance } from "./global/GlobalInstance";
import { ModelOpenAi } from "./openAi/ModelOpenAi";
import { ModelDeepSeek } from "./deepSeek/modelDeepSeek";
import { ModelGemini } from "./gemini/modelGemini";
import { ModelPerplexity } from "./perplexity/modelPerplexity";
import { ModelGrok } from "./grok/modelGrok";

export { OpenAiInstance, QdrantInstance, OIlamaInstance, DeepSeekInstance, GeminiInstance, LmStudioInstance, PerplexityInstance, GrokInstance, GlobalInstance,};
export { ModelOpenAi, ModelDeepSeek, ModelGemini, ModelPerplexity, ModelGrok };