import axios from 'axios';
import { ResponseFormat } from '../common/responseFormat';
import { ModelClaude } from './ModelClaude';

export default class ClaudeInstance {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    prompt: string,
    systemPrompt: string | null = null,
    model: ModelClaude = ModelClaude.claude3Haiku20240307,
    format: ResponseFormat = { type: 'text' }
  ): Promise<string | null> {
    try {
      const messages = [{ role: 'user', content: prompt }];

      const requestBody: any = {
        model,
        messages,
        max_tokens: 4000,
      };

      if (systemPrompt) {
        requestBody.system = systemPrompt;
      }

      if (format.type === 'json_object') {
        requestBody.response_format = { type: 'json' };
      }

      const response = await axios.post(`${this.baseUrl}/messages`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
      });

      return response.data.content[0].text;
    } catch (error) {
      console.error('Error generating chat completion:', error);
      throw error;
    }
  }

  async vision(
    prompt: string,
    base64Image: string,
    systemPrompt: string,
    model: ModelClaude = ModelClaude.claude3Opus20240229
  ): Promise<string | null> {
    try {
      const requestBody = {
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 4000,
        system: systemPrompt,
      };

      const response = await axios.post(`${this.baseUrl}/messages`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
      });

      return response.data.content[0].text;
    } catch (error) {
      console.error('Error processing image with Claude:', error);
      throw error;
    }
  }
}
