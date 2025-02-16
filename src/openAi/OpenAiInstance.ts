import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { ModelOpenAi } from "./ModelOpenAi";
import fs from "fs";
import { ModelTtsOpenAi } from "./modelTtsOpenAi";
import { VoiceOpenAi } from "./VoiceOpenAi";
import path from "path";
import { promises } from "fs";

export default class OpenAiInstance {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async chat(prompt: string, systemPrompt: string | null = null, model: ModelOpenAi = "gpt-4o-mini"): Promise<string | null> {
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
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating chat completion:', error);
            throw error;
        }
    }

    async embedding(text: string): Promise<number[]> {
        try {
            const response = await this.openai.embeddings.create({
                model: "text-embedding-3-large",
                input: text,
            });

            return response.data[0].embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw error;
        }
    }

    async transcript(path: string) {
        const transcription = await this.openai.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: "whisper-1",
        });

        return transcription.text;
    }

    async tts(text: string, voice: VoiceOpenAi = "nova", model: ModelTtsOpenAi = "tts-1") {
        const speechFile = path.resolve("./speech.mp3");
        const mp3 = await this.openai.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);

        return speechFile;
    }
    
    async vision(prompt: string, filePath: string, systemPrompt: string, model: ModelOpenAi = "gpt-4o-mini") {
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