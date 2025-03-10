import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { ModelOpenAi } from "./ModelOpenAi";
import { ModelTtsOpenAi } from "./modelTtsOpenAi";
import { VoiceOpenAi } from "./VoiceOpenAi";
import { ResponseFormat } from "../common/responseFormat";
import { ModelOpenAiEmbedding } from "./modelOpenAiEmbedding";
import { ModelOpenAIVision } from "./ModelOpenAIVision";

export default class OpenAiInstance {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    }

    async chat(prompt: string, systemPrompt: string | null = null, model: ModelOpenAi = ModelOpenAi.gpt4oMini, format: ResponseFormat = { type: "text" }): Promise<string | null> {
        try {
            const messages = [
                { role: "user", content: prompt },
            ];

            if (systemPrompt) {
                messages.unshift({ role: "developer", content: systemPrompt });
            }

            const response = await this.openai.chat.completions.create({
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

    async embedding(text: string, model: ModelOpenAiEmbedding = ModelOpenAiEmbedding.textEmbedding3Large): Promise<number[]> {
        try {
            const response = await this.openai.embeddings.create({
                model: model,
                input: text,
            });

            return response.data[0].embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw error;
        }
    }

    async transcript(path: string, file: File) {
        const transcription = await this.openai.audio.transcriptions.create({
            file: file,
            model: "whisper-1",
        });

        return transcription.text;
    }

    async tts(text: string, voice: VoiceOpenAi = "nova", model: ModelTtsOpenAi = "tts-1") {
        const mp3 = await this.openai.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
        });

        return Buffer.from(await mp3.arrayBuffer());
    }

    async vision(prompt: string, base64Image: string, systemPrompt: string, model: ModelOpenAIVision = ModelOpenAIVision.gpt4oMini) {
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

            const completion = await this.openai.chat.completions.create({
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