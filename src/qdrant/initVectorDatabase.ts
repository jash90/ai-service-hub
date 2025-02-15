import client from "./client";

export async function initQdrantClient(vectorDatabase: string): Promise<void> {
    try {
        const collections = await client.getCollections();
        const collectionExists = collections.collections.some((c:any) => c.name === vectorDatabase);

        if (!collectionExists) {
            await client.createCollection(vectorDatabase, {
                vectors: {
                    size: 3072,
                    distance: "Cosine"
                }
            });
            console.log("Utworzono kolekcję weapons_embeddings");
        }
    } catch (error) {
        console.error("Błąd podczas inicjalizacji klienta Qdrant:", error);
        throw error;
    }
}