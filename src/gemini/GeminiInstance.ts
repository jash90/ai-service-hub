import { GoogleGenerativeAI } from '@google/generative-ai';
import { ModelGemini } from './ModelGemini';
import { ModelGeminiEmbedding } from './ModelGeminiEmbedding';
import { ModelGeminiVison } from './ModelGeminiVison';

export default class GeminiInstance {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(
    prompt: string,
    model: ModelGemini = ModelGemini.gemini15Flash001,
    systemPrompt: string | undefined = undefined
  ) {
    const { response } = await this.genAI
      .getGenerativeModel({ model, systemInstruction: systemPrompt })
      .generateContent(prompt);
    return response.text();
  }

  async embedding(text: string, model: ModelGeminiEmbedding = ModelGeminiEmbedding.embedding001) {
    const { response } = await this.genAI.getGenerativeModel({ model }).generateContent(text);
    return response.text();
  }

  async vision(
    prompt: string,
    base64Image: string,
    model: ModelGeminiVison = ModelGeminiVison.gemini10ProVisionLatest
  ) {
    const { response } = await this.genAI
      .getGenerativeModel({ model })
      .generateContent([
        { text: prompt },
        { inlineData: { data: base64Image, mimeType: 'image/png' } },
      ]);

    return response.text();
  }
}
