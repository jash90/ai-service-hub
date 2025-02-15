import client from "./client";

export async function saveEmbeddingToQdrant(vectorDatabase: string, embedding: number[], payload: any): Promise<void> {
    try {
        await client.upsert(vectorDatabase, {
            points: [
                {
                    id: crypto.randomUUID(),
                    vector: embedding,
                    payload: payload
                }
            ]
        });
        console.log(`Zapisano embedding dla ${JSON.stringify(payload)} do bazy Qdrant`);
    } catch (error) {
        console.error("Błąd podczas zapisywania embeddingu do Qdrant:", error);
        throw error;
    }
}