import axios from "axios";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { ResponseFormat } from "../common/responseFormat";

export default class LmStudioInstance {
    private lmStudio: OpenAI;

    constructor(url: string) {
        this.lmStudio = new OpenAI({
            baseURL: `http://${url}/v1`,
            apiKey: "lm-studio",
            dangerouslyAllowBrowser: true,
        });
    }

    async chat(prompt: string, systemPrompt: string | null = null, model: string, format: ResponseFormat = { type: "text" }): Promise<string | null> {
        try {
            const messages = [
                { role: "user", content: prompt },
            ];

            if (systemPrompt) {
                messages.unshift({ role: "developer", content: systemPrompt });
            }

            const response = await this.lmStudio.chat.completions.create({
                model: model,
                messages: messages as ChatCompletionMessageParam[],
                response_format: format,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error("Error generating chat completion:", error);
            throw error;
        }
    }

    async models() {
        const response = await this.lmStudio.models.list();
        return response.data;
    }

    async embedding(text: string, model: string): Promise<number[]> {
        try {
            const response = await this.lmStudio.embeddings.create({
                model: model,
                input: text,
            });

            return response.data[0].embedding;
        } catch (error) {
            console.error("Error generating embedding:", error);
            throw error;
        }
    }

    async vision(prompt: string, base64Image: string, systemPrompt: string, model: string) {
        try {
            const messages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ];

            if (systemPrompt) {
                messages.unshift({ role: "system", content: [{ type: "text", text: systemPrompt }] });
            }

            const completion = await this.lmStudio.chat.completions.create({
                model: model,
                messages: messages as ChatCompletionMessageParam[],
                max_tokens: 1000,
                stream: false,
            });

            return completion.choices[0].message.content;
        } catch (err) {
            console.error("An error occurred:", err);
        }
    }
}