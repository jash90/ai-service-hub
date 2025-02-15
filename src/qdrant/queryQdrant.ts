import client from "./client";

export async function queryQdrant(queryEmbedding: number[], vectorDatabase: string): Promise<any[]> {
    try {
        
        const searchResult = await client.search(vectorDatabase, {
            vector: queryEmbedding,
            limit: 1,
            with_payload: true
        });

        return searchResult;
        
    } catch (error) {
        console.error("Błąd podczas przeszukiwania bazy Qdrant:", error);
        throw error;
    }
}