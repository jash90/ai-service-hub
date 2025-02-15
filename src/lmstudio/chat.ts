import { ChatCompletionMessageParam } from "openai/resources";
import { lmstudio } from "./config";


export async function chat(prompt: string, systemPrompt: string | null = null, model: string = "speakleash/Bielik-11B-v2.3-Instruct-GGUF"): Promise<string | null> {

    try {
        const messages = [
            { role: "user", content: prompt },
        ];

        if (systemPrompt) {
            messages.unshift({ role: "developer", content: systemPrompt });
        }

        const response = await lmstudio.chat.completions.create({
            model: model,
            messages: messages as ChatCompletionMessageParam[],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Błąd podczas tworzenia embeddingu:', error);
        throw error;
    }
}
