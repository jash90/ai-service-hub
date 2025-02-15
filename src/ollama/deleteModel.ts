import { ollama } from "./config";

export const deleteModel = async (model: string) => {
    const response = await ollama.delete("/delete", {
        data: {
            model: model
        }
    });
    return response.data;
}