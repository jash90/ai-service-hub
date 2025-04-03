import { GoogleGenerativeAI } from '@google/generative-ai';
import { ModelGemini } from './ModelGemini';

export default class GeminiInstance {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(
    prompt: string,
    model: ModelGemini = 'gemini-2.0-pro-exp-02-05',
    systemPrompt: string | undefined = undefined
  ) {
    const { response } = await this.genAI
      .getGenerativeModel({ model, systemInstruction: systemPrompt })
      .generateContent(prompt);
    return response.text();
  }
}
