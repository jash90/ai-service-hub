import OpenAI from "openai";

export const lmstudio = new OpenAI({ baseURL: `http://${process.env.LMSTUDIO_URL}/v1`, apiKey: 'lm-studio' });