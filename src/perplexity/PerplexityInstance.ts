import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ModelPerplexity } from './ModelPerplexity';
import { ResponseFormat } from '../common/responseFormat';

export default class PerplexityInstance {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.perplexity.ai',
      dangerouslyAllowBrowser: true,
    });
  }

  async chat(
    prompt: string,
    systemPrompt: string | null = null,
    model: ModelPerplexity = 'sonar-reasoning-pro',
    format: ResponseFormat = { type: 'text' }
  ): Promise<string | null> {
    try {
      const messages = [{ role: 'user', content: prompt }];

      if (systemPrompt) {
        messages.unshift({ role: 'system', content: systemPrompt });
      }

      const response = await this.openai.chat.completions.create({
        model: model,
        messages: messages as ChatCompletionMessageParam[],
        response_format: format,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat completion:', error);
      throw error;
    }
  }
}
