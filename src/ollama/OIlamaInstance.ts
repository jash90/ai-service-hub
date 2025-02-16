import axios, { AxiosInstance } from "axios";
import { ChatPayload } from "./ChatPayload";

export default class OIlamaInstance {
    private ollama: AxiosInstance;

    constructor(apiKey: string) {
        this.ollama = axios.create({
            baseURL: `${process.env.OLLAMA_URL}/api`,
        });
    }

    async chat(prompt: string, systemPrompt: string | null = null, model: string) {
        const payload: ChatPayload = {
            model: model,
            messages: [
                { role: "user", content: prompt },
            ]
        };

        if (systemPrompt) {
            payload.messages.unshift({ role: "system", content: systemPrompt });
        }

        try {
            const response = await this.ollama.post("/chat", payload);
            return response.data;
        } catch (error) {
            console.error("Error during chat:", error);
            throw error;
        }
    };

    async generate(prompt: string, model: string) {
        const payload = {
            model: model,
            prompt: prompt,
            options: {
                temperature: 0
            },
            stream: false
        };

        try {
            const response = await this.ollama.post("/generate", payload);
            return response.data;
        } catch (error) {
            console.error("Error generating code:", error);
        }
    }

    async embedding(prompt: string, model: string = "all-minilm") {
        const response = await this.ollama.post("/embeddings", {
            model: model,
            prompt: prompt
        });
        return response.data;
    }

    async deleteModel(model: string) {
        const response = await this.ollama.delete("/delete", {
            data: {
                model: model
            }
        });
        return response.data;
    }

    async models() {
        const response = await this.ollama.get("/tags");
        return response.data;
    }

    async pullModel(model: string) {
        const response = await this.ollama.post("/pull", {
            model: model
        });
        return response.data;
    }

}