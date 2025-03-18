import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { TemperatureDeepSeek } from "./TemperatureDeepSeek";
import { ModelDeepSeek } from "./ModelDeepSeek";
import { ResponseFormat } from "../common/responseFormat";

export default class DeepSeekInstance {
    private deepSeek: OpenAI;

    constructor(apiKey: string) {
        this.deepSeek = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
    }

    async chat(prompt: string, systemPrompt: string | null = null, model: ModelDeepSeek = ModelDeepSeek.deepseekReasoner, format: ResponseFormat = { type: "text" }, temperature: TemperatureDeepSeek = TemperatureDeepSeek.GeneralConversation): Promise<string | null> {
        try {
            const messages = [
                { role: "user", content: prompt },
            ];

            if (systemPrompt) {
                messages.unshift({ role: "developer", content: systemPrompt });
            }

            const response = await this.deepSeek.chat.completions.create({
                model: model,
                messages: messages as ChatCompletionMessageParam[],
                temperature: temperature,
                response_format: format,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error creating chat completion:', error);
            throw error;
        }
    }
}