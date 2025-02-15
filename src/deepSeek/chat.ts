import { ChatCompletionMessageParam } from "openai/resources";
import { deepSeek } from "./config";

type ModelDeepSeek = "deepseek-chat" | "deepseek-reasoner"

enum Temperature {
    CodingMath = 0.0,
    DataCleaning = 1.0,
    GeneralConversation = 1.3,
    Translation = 1.3,
    CreativeWriting = 1.5,
}

export async function chat(prompt: string, systemPrompt: string | null = null, model: ModelDeepSeek = "deepseek-reasoner", temperature: Temperature = Temperature.GeneralConversation): Promise<string | null> {

    try {
        const messages = [
            { role: "user", content: prompt },
        ];

        if (systemPrompt) {
            messages.unshift({ role: "developer", content: systemPrompt });
        }

        const response = await deepSeek.chat.completions.create({
            model: model,
            messages: messages as ChatCompletionMessageParam[],
            temperature: temperature,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Błąd podczas tworzenia embeddingu:', error);
        throw error;
    }
}
