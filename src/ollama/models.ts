import { ollama } from "./config";

export const models = async () => {
    const response = await ollama.get("/tags");
    return response.data;
}
