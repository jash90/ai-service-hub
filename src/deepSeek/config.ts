import { OpenAI } from "openai";

export const deepSeek = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});