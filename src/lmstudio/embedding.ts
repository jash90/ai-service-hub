import { lmstudio } from "./config";

export async function embedding(text: string, model: string = "speakleash/Bielik-11B-v2.3-Instruct-GGUF"): Promise<number[]> {

    try {
        const response = await lmstudio.embeddings.create({
            model: model,
            input: text,
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Błąd podczas tworzenia embeddingu:', error);
        throw error;
    }
}
