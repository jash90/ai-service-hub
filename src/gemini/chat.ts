import { ModelGemini, model as modelConfig } from "./config";

export const chat = async (prompt: string, model: ModelGemini = "gemini-2.0-pro-exp-02-05", systemPrompt: string | undefined = undefined) => {
    const {response} = await modelConfig(model, systemPrompt).generateContent(prompt);
    return response.text();
}
