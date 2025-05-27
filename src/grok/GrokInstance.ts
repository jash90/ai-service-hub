import { ChatCompletionMessageParam } from 'openai/resources';
import { ResponseFormat } from '../common/responseFormat';
import { ModelGrok } from './modelGrok';
import OpenAI from 'openai';
import { ModelGrokVision } from './modelGrokVision';

export default class GrokInstance {
  private grok: OpenAI;

  constructor(apiKey: string) {
    this.grok = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      baseURL: 'https://api.x.ai/v1',
    });
  }

  async chat(
    prompt: string,
    systemPrompt: string | null = null,
    model: ModelGrok = ModelGrok.grok21212,
    format: ResponseFormat = { type: 'text' }
  ): Promise<string | null> {
    try {
      const messages = [{ role: 'user', content: prompt }];

      if (systemPrompt) {
        messages.unshift({ role: 'system', content: systemPrompt });
      }

      const requestBody: any = {
        model: model,
        messages: messages,
      };

      if (format.type === 'json_object') {
        requestBody.response_format = { type: 'json_object' };
      }

      const response = await this.grok.chat.completions.create({
        model: model,
        messages: messages as ChatCompletionMessageParam[],
        response_format: format,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat completion with Grok:', error);
      throw error;
    }
  }

  async embedding(text: string, model: string = 'llama-3-embedding-v1'): Promise<number[]> {
    try {
      const response = await this.grok.embeddings.create({
        model: model,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding with Grok:', error);
      throw error;
    }
  }

  async vision(
    prompt: string,
    base64Image: string,
    systemPrompt: string,
    model: ModelGrokVision = ModelGrokVision.grok2Vision1212
  ): Promise<string | null | undefined> {
    try {
      const messages = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      });

      const completion = await this.grok.chat.completions.create({
        model: model,
        messages: messages as ChatCompletionMessageParam[],
        max_tokens: 1000,
        stream: false,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error with Grok vision:', error);
      throw error;
    }
  }
}
