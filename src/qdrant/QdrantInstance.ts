import { QdrantClient } from "@qdrant/js-client-rest";

export default class QdrantInstance {
    private qdrant: QdrantClient;

    constructor(url: string, apiKey: string) {
        this.qdrant = new QdrantClient({ url, apiKey });
    }

    async initQdrantClient(vectorDatabase: string): Promise<void> {
        try {
            const collections = await this.qdrant.getCollections();
            const collectionExists = collections.collections.some((c: any) => c.name === vectorDatabase);

            if (!collectionExists) {
                await this.qdrant.createCollection(vectorDatabase, {
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

    async saveEmbeddingToQdrant(vectorDatabase: string, embedding: number[], payload: any): Promise<void> {
        try {
            await this.qdrant.upsert(vectorDatabase, {
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

    async queryQdrant(queryEmbedding: number[], vectorDatabase: string): Promise<any[]> {
        try {

            const searchResult = await this.qdrant.search(vectorDatabase, {
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

}