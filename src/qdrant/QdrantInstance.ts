import { QdrantClient } from "@qdrant/js-client-rest";

export default class QdrantInstance {
    private qdrant: QdrantClient;

    constructor({ url, apiKey }: { url: string, apiKey: string }) {
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
                console.log(`Created collection ${vectorDatabase}`);
            }
        } catch (error) {
            console.error("Error initializing Qdrant client:", error);
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
            console.log(`Saved embedding for ${JSON.stringify(payload)} to Qdrant database`);
        } catch (error) {
            console.error("Error saving embedding to Qdrant:", error);
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
            console.error("Error querying Qdrant database:", error);
            throw error;
        }
    }
}