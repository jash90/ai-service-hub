import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { type ModelOpenAi } from './ModelOpenAi';
import { type ModelTtsOpenAi } from './ModelTtsOpenAi';
import { type ModelOpenAiVoice } from './ModelOpenAiVoice';
import { type ResponseFormat } from '../common/responseFormat';
import { type ModelOpenAiEmbedding } from './ModelOpenAiEmbedding';
import { type ModelOpenAIVision } from './ModelOpenAIVision';
import { 
  IAIServiceInstance, 
  IEmbeddingServiceInstance, 
  IVisionServiceInstance, 
  IAudioServiceInstance,
  AIServiceError 
} from '../types';
import logger from '../utils/Logger';
import performanceMonitor from '../utils/PerformanceMonitor';
import config from '../utils/Config';

export default class OpenAiInstance implements IAIServiceInstance, IEmbeddingServiceInstance, IVisionServiceInstance, IAudioServiceInstance {
  private openai: OpenAI;
  private serviceName = 'openai';
  private serviceConfig: any;

  constructor(apiKey: string) {
    try {
      this.serviceConfig = config.getServiceConfig('openai');
      this.openai = new OpenAI({ 
        apiKey, 
        dangerouslyAllowBrowser: true,
        timeout: this.serviceConfig?.timeout || 30000,
        maxRetries: this.serviceConfig?.retryAttempts || 3,
      });
      
      logger.serviceInit(this.serviceName, true);
    } catch (error) {
      logger.serviceInit(this.serviceName, false, error as Error);
      throw new AIServiceError(
        'Failed to initialize OpenAI service',
        this.serviceName,
        'initialization',
        error as Error
      );
    }
  }

  async chat(
    prompt: string,
    systemPrompt: string | null = null,
    model: ModelOpenAi = 'gpt-4o-mini',
    format: ResponseFormat = { type: 'text' }
  ): Promise<string | null> {
    const requestId = performanceMonitor.startRequest(this.serviceName, 'chat', model);
    
    try {
      logger.debug('Starting chat request', {
        service: this.serviceName,
        operation: 'chat',
        model,
        promptLength: prompt.length,
        hasSystemPrompt: !!systemPrompt,
        format: format.type,
        requestId,
      });

      const messages = [{ role: 'user', content: prompt }];

      if (systemPrompt) {
        messages.unshift({ role: 'system', content: systemPrompt });
      }

      const response = await this.openai.chat.completions.create({
        model: model,
        messages: messages as ChatCompletionMessageParam[],
        response_format: format,
      });

      const result = response.choices[0]?.message?.content || null;
      
      performanceMonitor.endRequest(requestId, true);
      
      logger.info('Chat request completed successfully', {
        service: this.serviceName,
        operation: 'chat',
        model,
        requestId,
        hasResult: !!result,
        resultLength: result?.length || 0,
      });

      return result;
    } catch (error) {
      performanceMonitor.endRequest(requestId, false, error as Error);
      
      const aiError = new AIServiceError(
        'Failed to generate chat completion',
        this.serviceName,
        'chat',
        error as Error
      );
      
      logger.error('Chat request failed', {
        service: this.serviceName,
        operation: 'chat',
        model,
        requestId,
      }, aiError);
      
      throw aiError;
    }
  }

  async embedding(
    text: string,
    model: ModelOpenAiEmbedding = 'text-embedding-3-large'
  ): Promise<number[]> {
    const requestId = performanceMonitor.startRequest(this.serviceName, 'embedding', model);
    
    try {
      logger.debug('Starting embedding request', {
        service: this.serviceName,
        operation: 'embedding',
        model,
        textLength: text.length,
        requestId,
      });

      const response = await this.openai.embeddings.create({
        model: model,
        input: text,
      });

      const result = response.data[0]?.embedding || [];
      
      performanceMonitor.endRequest(requestId, true);
      
      logger.info('Embedding request completed successfully', {
        service: this.serviceName,
        operation: 'embedding',
        model,
        requestId,
        embeddingLength: result.length,
      });

      return result;
    } catch (error) {
      performanceMonitor.endRequest(requestId, false, error as Error);
      
      const aiError = new AIServiceError(
        'Failed to generate embedding',
        this.serviceName,
        'embedding',
        error as Error
      );
      
      logger.error('Embedding request failed', {
        service: this.serviceName,
        operation: 'embedding',
        model,
        requestId,
      }, aiError);
      
      throw aiError;
    }
  }

  async transcript(file: File): Promise<string> {
    const requestId = performanceMonitor.startRequest(this.serviceName, 'transcript', 'whisper-1');
    
    try {
      logger.debug('Starting transcript request', {
        service: this.serviceName,
        operation: 'transcript',
        model: 'whisper-1',
        fileName: file.name,
        fileSize: file.size,
        requestId,
      });

      const transcription = await this.openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
      });

      const result = transcription.text;
      
      performanceMonitor.endRequest(requestId, true);
      
      logger.info('Transcript request completed successfully', {
        service: this.serviceName,
        operation: 'transcript',
        model: 'whisper-1',
        requestId,
        resultLength: result.length,
      });

      return result;
    } catch (error) {
      performanceMonitor.endRequest(requestId, false, error as Error);
      
      const aiError = new AIServiceError(
        'Failed to generate transcript',
        this.serviceName,
        'transcript',
        error as Error
      );
      
      logger.error('Transcript request failed', {
        service: this.serviceName,
        operation: 'transcript',
        model: 'whisper-1',
        requestId,
      }, aiError);
      
      throw aiError;
    }
  }

  async tts(text: string, voice: ModelOpenAiVoice = 'nova', model: ModelTtsOpenAi = 'tts-1'): Promise<Buffer> {
    const requestId = performanceMonitor.startRequest(this.serviceName, 'tts', model);
    
    try {
      logger.debug('Starting TTS request', {
        service: this.serviceName,
        operation: 'tts',
        model,
        voice,
        textLength: text.length,
        requestId,
      });

      const mp3 = await this.openai.audio.speech.create({
        model: model,
        voice: voice,
        input: text,
      });

      const result = Buffer.from(await mp3.arrayBuffer());
      
      performanceMonitor.endRequest(requestId, true);
      
      logger.info('TTS request completed successfully', {
        service: this.serviceName,
        operation: 'tts',
        model,
        requestId,
        audioSize: result.length,
      });

      return result;
    } catch (error) {
      performanceMonitor.endRequest(requestId, false, error as Error);
      
      const aiError = new AIServiceError(
        'Failed to generate TTS audio',
        this.serviceName,
        'tts',
        error as Error
      );
      
      logger.error('TTS request failed', {
        service: this.serviceName,
        operation: 'tts',
        model,
        requestId,
      }, aiError);
      
      throw aiError;
    }
  }

  async vision(
    prompt: string,
    base64Image?: string,
    systemPrompt?: string,
    model: ModelOpenAIVision = 'gpt-4o-mini'
  ): Promise<string | null | undefined> {
    const requestId = performanceMonitor.startRequest(this.serviceName, 'vision', model);
    
    try {
      logger.debug('Starting vision request', {
        service: this.serviceName,
        operation: 'vision',
        model,
        promptLength: prompt.length,
        hasImage: !!base64Image,
        hasSystemPrompt: !!systemPrompt,
        requestId,
      });

      const messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            ...(base64Image ? [{
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            }] : []),
          ],
        },
      ];

      if (systemPrompt) {
        messages.unshift({ role: 'system', content: [{ type: 'text', text: systemPrompt }] });
      }

      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: messages as ChatCompletionMessageParam[],
        max_tokens: 1000,
        stream: false,
      });

      const result = completion.choices[0]?.message?.content || null;
      
      performanceMonitor.endRequest(requestId, true);
      
      logger.info('Vision request completed successfully', {
        service: this.serviceName,
        operation: 'vision',
        model,
        requestId,
        hasResult: !!result,
        resultLength: result?.length || 0,
      });

      return result;
    } catch (error) {
      performanceMonitor.endRequest(requestId, false, error as Error);
      
      const aiError = new AIServiceError(
        'Failed to process vision request',
        this.serviceName,
        'vision',
        error as Error
      );
      
      logger.error('Vision request failed', {
        service: this.serviceName,
        operation: 'vision',
        model,
        requestId,
      }, aiError);
      
      throw aiError;
    }
  }
}
