/// <reference lib="dom" />

// Base interface for all AI service instances
export interface IAIServiceInstance {
  chat(
    prompt: string,
    systemPrompt?: string | null,
    model?: string,
    format?: ResponseFormat
  ): Promise<string | null>;
}

// Extended interface for services that support embeddings
export interface IEmbeddingServiceInstance extends IAIServiceInstance {
  embedding(text: string, model?: string): Promise<number[]>;
}

// Extended interface for services that support vision
export interface IVisionServiceInstance extends IAIServiceInstance {
  vision(
    prompt: string,
    base64Image?: string,
    systemPrompt?: string,
    model?: string
  ): Promise<string | null | undefined>;
}

// Extended interface for services that support audio
export interface IAudioServiceInstance extends IAIServiceInstance {
  transcript?(file: File): Promise<string>;
  tts?(text: string, voice?: string, model?: string): Promise<Buffer>;
}

// Response format interface - using OpenAI compatible format
export type ResponseFormat = {
  type: 'text' | 'json_object';
};

// Service configuration interface
export interface ServiceConfig {
  apiKey?: string;
  baseUrl?: string;
}

// Error types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public service: string,
    public operation: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

// Model registry interface
export interface IModelRegistry {
  getServiceForModel(model: string): string | null;
  isValidModel(model: string): boolean;
  getModelsForService(service: string): string[];
}
