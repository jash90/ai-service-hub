import { openai } from "./config";

export async function embedding(text: string): Promise<number[]> {

    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-large",
            input: text,
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Błąd podczas tworzenia embeddingu:', error);
        throw error;
    }
}
