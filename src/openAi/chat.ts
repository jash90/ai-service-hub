import { ChatCompletionMessageParam } from "openai/resources";
import { openai } from "./config";

export type ModelOpenAi = "gpt-4o-mini" | "gpt-4o" | "gpt-3.5-turbo" | "gpt-4o-realtime-preview"

export async function chat(prompt: string, systemPrompt: string | null = null, model: ModelOpenAi = "gpt-4o-mini"): Promise<string | null> {

    try {
        const messages = [
            { role: "user", content: prompt },
        ];

        if (systemPrompt) {
            messages.unshift({ role: "developer", content: systemPrompt });
        }

        const response = await openai().chat.completions.create({
            model: model,
            messages: messages as ChatCompletionMessageParam[],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Błąd podczas tworzenia embeddingu:', error);
        throw error;
    }
}
