import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { type ModelOpenAi } from './ModelOpenAi';
import { type ModelTtsOpenAi } from './ModelTtsOpenAi';
import { type ModelOpenAiVoice } from './ModelOpenAiVoice';
import { type ResponseFormat } from '../common/responseFormat';
import { type ModelOpenAiEmbedding } from './ModelOpenAiEmbedding';
import { type ModelOpenAIVision } from './ModelOpenAIVision';

export default class OpenAiInstance {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

  async chat(
    prompt: string,
    systemPrompt: string | null = null,
    model: ModelOpenAi = 'gpt-4o-mini',
    format: ResponseFormat = { type: 'text' }
  ): Promise<string | null> {
    try {
      const messages = [{ role: 'user', content: prompt }];

      if (systemPrompt) {
        messages.unshift({ role: 'developer', content: systemPrompt });
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

  async embedding(
    text: string,
    model: ModelOpenAiEmbedding = 'text-embedding-3-large'
  ): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: model,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async transcript(file: File) {
    const transcription = await this.openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    return transcription.text;
  }

  async tts(text: string, voice: ModelOpenAiVoice = 'nova', model: ModelTtsOpenAi = 'tts-1') {
    const mp3 = await this.openai.audio.speech.create({
      model: model,
      voice: voice,
      input: text,
    });

    return Buffer.from(await mp3.arrayBuffer());
  }

  async vision(
    prompt: string,
    base64Image: string,
    systemPrompt: string,
    model: ModelOpenAIVision = 'gpt-4o-mini'
  ) {
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
        messages.unshift({ role: 'system', content: [{ type: 'text', text: systemPrompt }] });
      }

      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: messages as ChatCompletionMessageParam[],
        max_tokens: 1000,
        stream: false,
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error('An error occurred:', err);
    }
  }
}
