import axios, { AxiosInstance } from 'axios';
import { ResponseFormat } from '../common/responseFormat';
import { ModelGrok } from './modelGrok';

export default class GrokInstance {
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: 'https://api.grok.ai/v1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async chat(
    prompt: string,
    systemPrompt: string | null = null,
    model: ModelGrok = ModelGrok.grok1,
    format: ResponseFormat = { type: 'text' }
  ): Promise<string | null> {
    try {
      const messages = [{ role: 'user', content: prompt }];

      if (systemPrompt) {
        messages.unshift({ role: 'system', content: systemPrompt });
      }

      const response = await this.client.post('/chat/completions', {
        model: model,
        messages: messages,
        response_format: format,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat completion with Grok:', error);
      throw error;
    }
  }

  async embedding(text: string, model: string = 'grok-embedding'): Promise<number[]> {
    try {
      const response = await this.client.post('/embeddings', {
        model: model,
        input: text,
      });

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding with Grok:', error);
      throw error;
    }
  }

  async vision(
    prompt: string,
    base64Image: string,
    systemPrompt: string,
    model: string = ModelGrok.grok1Vision
  ): Promise<string | null | undefined> {
    try {
      const messages = [
        {
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
        },
      ];

      if (systemPrompt) {
        messages.unshift({
          role: 'system',
          content: [{ type: 'text', text: systemPrompt }],
        });
      }

      const response = await this.client.post('/chat/completions', {
        model: model,
        messages: messages,
        max_tokens: 1000,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error with Grok vision:', error);
      throw error;
    }
  }
}
