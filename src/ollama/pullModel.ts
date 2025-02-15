import { ollama } from "./config";

export const pullModel = async (model: string) => {
    const response = await ollama.post("/pull", {
        model: model
    });
    return response.data;
}