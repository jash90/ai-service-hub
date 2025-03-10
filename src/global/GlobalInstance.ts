import { DeepSeekInstance, LmStudioInstance, OIlamaInstance, OpenAiInstance, PerplexityInstance } from "..";
import { ResponseFormat } from "../common/responseFormat";
import { ModelDeepSeek } from "../deepSeek/modelDeepSeek";
import { ModelOpenAi } from "../openAi/ModelOpenAi";
import { ModelOpenAiEmbedding } from "../openAi/modelOpenAiEmbedding";
import { ModelPerplexity } from "../perplexity/modelPerplexity";
import { GlobalInstanceCompany } from "./GlobalInstanceCompany";
import { GlobalInstanceEmbeddingModel } from "./GlobalInstanceEmbeddingModel";
import { GlobalInstanceModel } from "./GlobalInstanceModel";
import { GlobalInstanceParameters } from "./GlobalInstanceParameters";
import { GlobalInstanceVisionModel } from "./GlobalInstanceVisionModel";

export class GlobalInstance {
    private instances: Record<GlobalInstanceCompany, any>;

    private constructor({ openAiKey, ollamaUrl, deepSeekKey, lmstudioUrl, perplexityKey }: Partial<GlobalInstanceParameters>) {
        this.instances = {
            ...(openAiKey && { openai: new OpenAiInstance(openAiKey) }),
            ...(ollamaUrl && { ollama: new OIlamaInstance(ollamaUrl) }),
            ...(deepSeekKey && { deepseek: new DeepSeekInstance(deepSeekKey) }),
            ...(lmstudioUrl && { lmstudio: new LmStudioInstance(lmstudioUrl) }),
            ...(perplexityKey && { perplexity: new PerplexityInstance(perplexityKey) })
        } as Record<GlobalInstanceCompany, any>;
    }

    public chat({ prompt, systemPrompt, model, format, instance }: {
        prompt: string,
        systemPrompt: string | null,
        model: GlobalInstanceModel,
        format: ResponseFormat,
        instance?: GlobalInstanceCompany
    }): Promise<string | null> {
        // Auto-detect instance based on model if not explicitly provided
        if (!instance) {
            if (Object.values(ModelOpenAi).includes(model as ModelOpenAi)) {
                return this.instances.openai.chat(prompt, systemPrompt, model as ModelOpenAi, format);
            }
            // Use type assertion for comparison only, not for passing the value
            if (Object.values(ModelDeepSeek).includes(model as any)) {
                return this.instances.deepseek.chat(prompt, systemPrompt, model, format);
            }
            if (Object.values(ModelPerplexity).includes(model as any)) {
                return this.instances.perplexity.chat(prompt, systemPrompt, model, format);
            }
        }

        // Use specified instance
        const selectedInstance = instance as GlobalInstanceCompany;
        if (!this.instances[selectedInstance]) {
            throw new Error(`Unsupported instance: ${selectedInstance}`);
        }

        try {
            return this.instances[selectedInstance].chat(prompt, systemPrompt, model, format);
        } catch (error) {
            throw new Error(`Error with ${selectedInstance} chat: ${error}`);
        }
    }

    public embedding({ prompt, model, instance }: {
        prompt: string,
        model: GlobalInstanceEmbeddingModel,
        instance?: GlobalInstanceCompany
    }): Promise<number[]> {
        // Auto-detect for OpenAI embedding models
        if (Object.values(ModelOpenAiEmbedding).includes(model as ModelOpenAiEmbedding)) {
            return this.instances.openai.embedding(prompt, model as ModelOpenAiEmbedding);
        }

        // Check if instance supports embedding
        if (instance === "deepseek" || instance === "perplexity" || !instance) {
            throw new Error(`${instance} does not support embedding`);
        }

        try {
            return this.instances[instance].embedding(prompt, model);
        } catch (error) {
            throw new Error(`Error with ${instance} embedding: ${error}`);
        }
    }

    public vision({ prompt, base64Image, systemPrompt, model, instance }: {
        prompt: string,
        base64Image: string,
        systemPrompt: string,
        model: GlobalInstanceVisionModel,
        instance?: GlobalInstanceCompany
    }): Promise<string | null | undefined> {
        // Check if instance supports vision
        if (instance === "deepseek" || instance === "perplexity" || !instance) {
            throw new Error(`${instance} does not support vision`);
        }

        try {
            return this.instances[instance].vision(prompt, base64Image, systemPrompt, model);
        } catch (error) {
            throw new Error(`Error with ${instance} vision: ${error}`);
        }
    }
}
