import axios, { AxiosInstance } from "axios";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { ResponseFormat } from "../common/responseFormat";
import { promises } from "fs";

export default class OIlamaInstance {
    private ollama: OpenAI;
    private ollamaApi: AxiosInstance;

    constructor(apiKey: string) {
        this.ollama = new OpenAI({
            baseURL: `${process.env.OLLAMA_URL}/api`,
            apiKey: 'ollama',
            dangerouslyAllowBrowser: true,
        });

        this.ollamaApi = axios.create({
            baseURL: `${process.env.OLLAMA_URL}/api`,
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

            const response = await this.ollama.chat.completions.create({
                model: model,
                messages: messages as ChatCompletionMessageParam[],
                response_format: format,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating chat completion:', error);
            throw error;
        }
    }


    async vision(prompt: string, filePath: string, systemPrompt: string, model: string) {
        try {
            let base64Image = "";
            try {
                const imageBuffer = await promises.readFile(filePath.replace(/'/g, ""));
                base64Image = imageBuffer.toString("base64");
            } catch (error) {
                console.error("Couldn't read the image. Make sure the path is correct and the file exists.");
            }

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

            const completion = await this.ollama.chat.completions.create({
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

    async embedding(prompt: string, model: string = "all-minilm"): Promise<number[]> {
        const response = await this.ollama.embeddings.create({
            model: model,
            input: prompt,
        });
        return response.data[0].embedding;
    }

    async deleteModel(model: string) {
        const response = await this.ollamaApi.delete("/delete", {
            data: {
                model: model
            }
        });
        return response.data;
    }

    async models() {
        const response = await this.ollamaApi.get("/tags");
        return response.data;
    }

    async pullModel(model: string) {
        const response = await this.ollamaApi.post("/pull", {
            model: model
        });
        return response.data;
    }

}