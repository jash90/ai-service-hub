import { ollama } from "./config";

export const embedding = async (prompt: string, model: string = "all-minilm") => {
    const response = await ollama.post("/embeddings", {
        model: model,
        prompt: prompt
    });
    return response.data;
}
