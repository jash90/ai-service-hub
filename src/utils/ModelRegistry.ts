import { IModelRegistry } from '../types';
import { ModelOpenAi } from '../openAi/ModelOpenAi';
import { ModelDeepSeek } from '../deepSeek/ModelDeepSeek';
import { ModelPerplexity } from '../perplexity/ModelPerplexity';
import { ModelGrok } from '../grok/modelGrok';
import { ModelClaude } from '../claude/ModelClaude';
import { ModelGemini } from '../gemini/ModelGemini';
import { ModelOpenAiEmbedding } from '../openAi/ModelOpenAiEmbedding';

export class ModelRegistry implements IModelRegistry {
  private static instance: ModelRegistry;
  private modelToServiceMap: Map<string, string>;
  private serviceToModelsMap: Map<string, string[]>;

  private constructor() {
    this.modelToServiceMap = new Map();
    this.serviceToModelsMap = new Map();
    this.initializeRegistry();
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  private initializeRegistry(): void {
    // OpenAI models
    Object.values(ModelOpenAi).forEach(model => {
      this.addModel(model, 'openai');
    });

    // OpenAI embedding models
    Object.values(ModelOpenAiEmbedding).forEach(model => {
      this.addModel(model, 'openai');
    });

    // DeepSeek models
    Object.values(ModelDeepSeek).forEach(model => {
      this.addModel(model, 'deepseek');
    });

    // Perplexity models
    Object.values(ModelPerplexity).forEach(model => {
      this.addModel(model, 'perplexity');
    });

    // Grok models
    Object.values(ModelGrok).forEach(model => {
      this.addModel(model, 'grok');
    });

    // Claude models
    Object.values(ModelClaude).forEach(model => {
      this.addModel(model, 'claude');
    });

    // Gemini models
    Object.values(ModelGemini).forEach(model => {
      this.addModel(model, 'gemini');
    });
  }

  private addModel(model: string, service: string): void {
    this.modelToServiceMap.set(model, service);

    if (!this.serviceToModelsMap.has(service)) {
      this.serviceToModelsMap.set(service, []);
    }
    this.serviceToModelsMap.get(service)!.push(model);
  }

  public getServiceForModel(model: string): string | null {
    return this.modelToServiceMap.get(model) || null;
  }

  public isValidModel(model: string): boolean {
    return this.modelToServiceMap.has(model);
  }

  public getModelsForService(service: string): string[] {
    return this.serviceToModelsMap.get(service) || [];
  }

  public getAllServices(): string[] {
    return Array.from(this.serviceToModelsMap.keys());
  }

  public getAllModels(): string[] {
    return Array.from(this.modelToServiceMap.keys());
  }
}
