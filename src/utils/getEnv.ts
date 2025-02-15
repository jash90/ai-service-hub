
export interface Config {
  OPENAI_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  GEMINI_API_KEY: string;
  LMSTUDIO_URL: string;
  OLLAMA_URL: string;
  QDRANT_URL: string;
}


export function getConfig(): Config {
  if (!process.env.OPENAI_API_KEY || !process.env.DEEPSEEK_API_KEY || !process.env.GEMINI_API_KEY || !process.env.LMSTUDIO_URL || !process.env.OLLAMA_URL || !process.env.QDRANT_URL) {
    throw new Error('Brak wymaganych zmiennych środowiskowych.');
  }
  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    LMSTUDIO_URL: process.env.LMSTUDIO_URL,
    OLLAMA_URL: process.env.OLLAMA_URL,
    QDRANT_URL: process.env.QDRANT_URL,
  };
}