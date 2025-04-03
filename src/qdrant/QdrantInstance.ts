import axios, { AxiosInstance } from 'axios';

export default class QdrantInstance {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor({ url, apiKey }: { url: string; apiKey: string }) {
    this.baseUrl = url.endsWith('/') ? url : `${url}/`;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'api-key': apiKey }),
      },
    });
  }

  async initQdrantClient(collectionName: string): Promise<void> {
    try {
      // Check if collection exists
      const collectionsResponse = await this.client.get('collections');
      const collections = collectionsResponse.data.collections || [];
      const collectionExists = collections.some((c: any) => c.name === collectionName);

      if (!collectionExists) {
        // Create collection if it doesn't exist
        await this.client.put(`collections/${collectionName}`, {
          vectors: {
            size: 3072,
            distance: 'Cosine',
          },
        });
        console.log(`Created collection ${collectionName}`);
      }
    } catch (error) {
      console.error('Error initializing Qdrant client:', error);
      throw error;
    }
  }

  async saveEmbeddingToQdrant(
    collectionName: string,
    embedding: number[],
    payload: any
  ): Promise<void> {
    try {
      // Generate a UUID for the point
      const pointId = crypto.randomUUID();

      await this.client.put(`collections/${collectionName}/points`, {
        points: [
          {
            id: pointId,
            vector: embedding,
            payload: payload,
          },
        ],
      });
      console.log(`Saved embedding for ${JSON.stringify(payload)} to Qdrant database`);
    } catch (error) {
      console.error('Error saving embedding to Qdrant:', error);
      throw error;
    }
  }

  async queryQdrant(
    queryEmbedding: number[],
    collectionName: string,
    limit: number = 1
  ): Promise<any[]> {
    try {
      const response = await this.client.post(`collections/${collectionName}/points/search`, {
        vector: queryEmbedding,
        limit: limit,
        with_payload: true,
      });

      return response.data.result || [];
    } catch (error) {
      console.error('Error querying Qdrant database:', error);
      throw error;
    }
  }
}
