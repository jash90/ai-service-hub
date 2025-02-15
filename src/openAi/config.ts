import OpenAI from "openai";

let lastApiKey: string | undefined;
let openaiInstance: OpenAI | undefined;

export function openai(apiKey?: string): OpenAI {
  if (!openaiInstance) {

    if (!apiKey) {
      throw new Error("API key is required to initialize the OpenAI instance.");
    }
    openaiInstance = new OpenAI({ apiKey });
    lastApiKey = apiKey;
  }
  return openaiInstance;
}