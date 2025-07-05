import {
  ClaudeInstance,
  DeepSeekInstance,
  GrokInstance,
  LmStudioInstance,
  OIlamaInstance,
  OpenAiInstance,
  PerplexityInstance,
  GeminiInstance,
} from '..';
import {
  ResponseFormat,
  AIServiceError,
  IAIServiceInstance,
  IEmbeddingServiceInstance,
  IVisionServiceInstance,
} from '../types';
import { ModelRegistry } from '../utils/ModelRegistry';
import { GlobalInstanceCompany } from './GlobalInstanceCompany';
import { GlobalInstanceEmbeddingModel } from './GlobalInstanceEmbeddingModel';
import { GlobalInstanceModel } from './GlobalInstanceModel';
import { GlobalInstanceParameters } from './GlobalInstanceParameters';
import { GlobalInstanceVisionModel } from './GlobalInstanceVisionModel';
export default class GlobalInstance {
  private instances: Record<GlobalInstanceCompany, IAIServiceInstance>;
  private modelRegistry: ModelRegistry;

  constructor({
    openAiKey,
    ollamaUrl,
    deepSeekKey,
    lmstudioUrl,
    perplexityKey,
    grokKey,
    claudeKey,
    geminiKey,
  }: Partial<GlobalInstanceParameters>) {
    this.modelRegistry = ModelRegistry.getInstance();

    this.instances = {
      ...(openAiKey && { openai: new OpenAiInstance(openAiKey) }),
      ...(ollamaUrl && { ollama: new OIlamaInstance(ollamaUrl) }),
      ...(deepSeekKey && { deepseek: new DeepSeekInstance(deepSeekKey) }),
      ...(lmstudioUrl && { lmstudio: new LmStudioInstance(lmstudioUrl) }),
      ...(perplexityKey && { perplexity: new PerplexityInstance(perplexityKey) }),
      ...(grokKey && { grok: new GrokInstance(grokKey) }),
      ...(claudeKey && { claude: new ClaudeInstance(claudeKey) }),
      ...(geminiKey && { gemini: new GeminiInstance(geminiKey) }),
    } as Record<GlobalInstanceCompany, IAIServiceInstance>;
  }

  public chat({
    prompt,
    systemPrompt,
    model,
    format,
    instance,
  }: {
    prompt: string;
    model: GlobalInstanceModel;
    systemPrompt?: string;
    format?: ResponseFormat;
    instance?: GlobalInstanceCompany;
  }): Promise<string | null> {
    try {
      // Auto-detect instance based on model if not explicitly provided
      const targetService = instance || this.modelRegistry.getServiceForModel(model);

      if (!targetService) {
        throw new AIServiceError(
          `Model ${model} is not supported by any available service`,
          'global',
          'chat'
        );
      }

      // Check if the service instance is available
      if (!this.instances[targetService as GlobalInstanceCompany]) {
        throw new AIServiceError(
          `Service ${targetService} is not configured or available`,
          targetService,
          'chat'
        );
      }

      return this.instances[targetService as GlobalInstanceCompany].chat(
        prompt,
        systemPrompt,
        model,
        format
      );
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error;
      }
      throw new AIServiceError(
        `Unexpected error in chat operation: ${error}`,
        instance || 'global',
        'chat',
        error instanceof Error ? error : undefined
      );
    }
  }

  public embedding({
    prompt,
    model,
    instance,
  }: {
    prompt: string;
    model: GlobalInstanceEmbeddingModel;
    instance?: GlobalInstanceCompany;
  }): Promise<number[]> {
    try {
      // Auto-detect service based on model
      const targetService = instance || this.modelRegistry.getServiceForModel(model);

      if (!targetService) {
        throw new AIServiceError(
          `Model ${model} is not supported by any available service`,
          'global',
          'embedding'
        );
      }

      // Check if the service instance is available
      const serviceInstance = this.instances[targetService as GlobalInstanceCompany];
      if (!serviceInstance) {
        throw new AIServiceError(
          `Service ${targetService} is not configured or available`,
          targetService,
          'embedding'
        );
      }

      // Check if the service supports embedding
      if (!('embedding' in serviceInstance)) {
        throw new AIServiceError(
          `Service ${targetService} does not support embedding`,
          targetService,
          'embedding'
        );
      }

      return (serviceInstance as IEmbeddingServiceInstance).embedding(prompt, model);
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error;
      }
      throw new AIServiceError(
        `Unexpected error in embedding operation: ${error}`,
        instance || 'global',
        'embedding',
        error instanceof Error ? error : undefined
      );
    }
  }

  public vision({
    prompt,
    base64Image,
    systemPrompt,
    model,
    instance,
  }: {
    prompt: string;
    model: GlobalInstanceVisionModel;
    base64Image?: string;
    systemPrompt?: string;
    instance?: GlobalInstanceCompany;
  }): Promise<string | null | undefined> {
    try {
      // Auto-detect service based on model
      const targetService = instance || this.modelRegistry.getServiceForModel(model);

      if (!targetService) {
        throw new AIServiceError(
          `Model ${model} is not supported by any available service`,
          'global',
          'vision'
        );
      }

      // Check if the service instance is available
      const serviceInstance = this.instances[targetService as GlobalInstanceCompany];
      if (!serviceInstance) {
        throw new AIServiceError(
          `Service ${targetService} is not configured or available`,
          targetService,
          'vision'
        );
      }

      // Check if the service supports vision
      if (!('vision' in serviceInstance)) {
        throw new AIServiceError(
          `Service ${targetService} does not support vision`,
          targetService,
          'vision'
        );
      }

      return (serviceInstance as IVisionServiceInstance).vision(
        prompt,
        base64Image,
        systemPrompt,
        model
      );
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error;
      }
      throw new AIServiceError(
        `Unexpected error in vision operation: ${error}`,
        instance || 'global',
        'vision',
        error instanceof Error ? error : undefined
      );
    }
  }
}
