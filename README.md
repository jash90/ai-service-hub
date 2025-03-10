# AI Services Hub

A unified TypeScript/JavaScript library for seamless integration with multiple AI services, providing a consistent interface for various AI model providers.

## Features

- **OpenAI**  
  Chat completions, embeddings, audio transcription, text-to-speech (TTS), and vision.

- **DeepSeek**  
  Chat with temperature control.

- **Gemini**  
  Chat using Google's Gemini engine.

- **LM Studio**  
  Chat completions, embeddings, and vision (image analysis).

- **Ollama**  
  Chat, content generation, embeddings, and model management.

- **Qdrant**  
  Vector database operations for storing and querying embeddings.

- **Perplexity**  
  Chat and other functionalities (interface analogous to other instances).

## Unified Interface with GlobalInstance

The `GlobalInstance` class provides a unified way to interact with all supported AI services through a single interface. This approach offers several benefits:

### Key Benefits
- **Single Entry Point**: Manage all AI services through one instance
- **Automatic Model Routing**: Automatically routes requests to the appropriate service based on the model
- **Consistent Error Handling**: Unified error handling across all services
- **Type Safety**: Full TypeScript support for all operations

### Basic Usage

```typescript
import { GlobalInstance } from 'ai-services-hub';

// Initialize with your API keys
const ai = new GlobalInstance({
  openAiKey: 'key1',  // Only OpenAI
});

// Or multiple services
const ai2 = new GlobalInstance({
  openAiKey: 'key1',
  ollamaUrl: 'url1',
});

// Or all services
const ai3 = new GlobalInstance({
  openAiKey: 'key1',
  ollamaUrl: 'url1',
  deepSeekKey: 'key2',
  lmstudioUrl: 'url2',
  perplexityKey: 'key3'
});

// Chat completion with auto-detection
const response = await ai.chat({
  prompt: "What is TypeScript?",
  systemPrompt: "You are a helpful assistant",
  model: "gpt-4o-mini",
  format: "text"
});

// Embeddings
const embedding = await ai.embedding({
  prompt: "Text to embed",
  model: "text-embedding-ada-002",
  instance: "openai" // Optional
});

// Vision analysis
const visionResponse = await ai.vision({
  prompt: "Describe this image",
  base64Image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...", // Base64 encoded image
  systemPrompt: "Analyze the image carefully",
  model: "gpt-4-vision-preview",
  instance: "openai" // Optional
});
```

### Auto-Detection Feature

The `GlobalInstance` automatically detects the appropriate service based on the model:

```typescript
// These will automatically route to the correct service
await ai.chat({ 
  prompt: "Hello",
  model: "gpt-4o",        // Routes to OpenAI
  format: "text" 
});

await ai.chat({ 
  prompt: "Hello",
  model: "deepseek-chat", // Routes to DeepSeek
  format: "text"
});

await ai.chat({ 
  prompt: "Hello",
  model: "sonar-pro",     // Routes to Perplexity
  format: "text"
});
```

### Local Models with Ollama and LM Studio

The GlobalInstance seamlessly integrates with local model providers. Here's how to use Ollama and LM Studio:

#### Ollama Integration

```typescript
const ai = new GlobalInstance({
  ollamaUrl: 'http://localhost:11434',  // Your Ollama endpoint
  // ... other keys
});

// Chat with custom Ollama models
const chatResponse = await ai.chat({
  prompt: "Explain quantum computing",
  systemPrompt: "You are a physics expert",
  model: "llama2",  // Or any other Ollama model
  format: "text",
  instance: "ollama"
});

// Generate embeddings
const embedding = await ai.embedding({
  prompt: "Text to embed",
  model: "all-minilm",  // Ollama's embedding model
  instance: "ollama"
});

// Vision analysis with Ollama
const visionResult = await ai.vision({
  prompt: "What's in this image?",
  base64Image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...", // Base64 encoded image
  systemPrompt: "Describe in detail",
  model: "llava",  // Ollama's vision model
  instance: "ollama"
});
```

#### LM Studio Integration

```typescript
const ai = new GlobalInstance({
  lmstudioUrl: 'http://localhost:1234',  // Your LM Studio endpoint
  // ... other keys
});

// Chat with local models
const localChat = await ai.chat({
  prompt: "Explain neural networks",
  systemPrompt: "You are an AI expert",
  model: "mistral-7b-instruct",  // Your loaded model in LM Studio
  format: "text",
  instance: "lmstudio"
});

// Local embeddings
const localEmbedding = await ai.embedding({
  prompt: "Text for embedding",
  model: "all-MiniLM-L6-v2",  // Local embedding model
  instance: "lmstudio"
});

// Vision with local models
const localVision = await ai.vision({
  prompt: "Analyze this image",
  base64Image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...", // Base64 encoded image
  systemPrompt: "Be detailed in analysis",
  model: "bakllava-1",  // Local vision model
  instance: "lmstudio"
});

// Example combining cloud and local models
const multiProviderExample = async () => {
  // Use OpenAI for main chat
  const cloudResponse = await ai.chat({
    prompt: "Generate a complex task",
    model: "gpt-4o",
    format: "text"
  });

  // Process with local model
  const localAnalysis = await ai.chat({
    prompt: cloudResponse,
    model: "mistral-7b",
    format: "text",
    instance: "lmstudio"
  });

  return localAnalysis;
};
```

### Error Handling and Best Practices

```typescript
try {
  const response = await ai.chat({
    prompt: "Complex query",
    model: "mistral-7b",
    format: "text",
    instance: "lmstudio"
  });
} catch (error) {
  if (error.message.includes('Connection refused')) {
    // Handle local service not running
    console.error('Please ensure LM Studio is running locally');
  } else if (error.message.includes('model not found')) {
    // Handle model loading issues
    console.error('Please load the model in LM Studio first');
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

## Installation

Install the package via npm or yarn:

```
npm install ai-services-hub
```

or

```
yarn add ai-services-hub
```

## Environment Variables

Some services may require additional configuration via environment variables:

- **OLLAMA_URL**: The base URL for the Ollama API (used internally by `OIlamaInstance`).

## Usage Examples

### OpenAI

```typescript
import { OpenAiInstance } from 'ai-services-hub';

const openAi = new OpenAiInstance('YOUR_OPENAI_API_KEY');

(async () => {
  try {
    const chatResponse = await openAi.chat(
      "What is TypeScript?",
      "You are a helpful assistant", // optional system prompt
      "gpt-4o-mini"                  // optional model
    );
    console.log("OpenAI Chat Response:", chatResponse);

    const embedding = await openAi.embedding("Text to embed");
    console.log("OpenAI Embedding:", embedding);

    const transcript = await openAi.transcript("path/to/audio.mp3");
    console.log("OpenAI Transcript:", transcript);

    const audioFile = await openAi.tts("Hello world!", "nova", "tts-1");
    console.log("Audio file saved at:", audioFile);

    const visionResponse = await openAi.vision(
      "Describe this image",
      "path/to/image.jpg",
      "System prompt"
    );
    console.log("OpenAI Vision Response:", visionResponse);
  } catch (error) {
    console.error("OpenAI error:", error);
  }
})();
```

### DeepSeek

```typescript
import { DeepSeekInstance } from 'ai-services-hub';

const deepSeek = new DeepSeekInstance('YOUR_DEEPSEEK_API_KEY');

(async () => {
  try {
    const chatResponse = await deepSeek.chat(
      "Explain quantum computing",
      "Provide a simple explanation",  // optional system prompt
      "deepseek-reasoner",             // optional model
      0.7                             // optional temperature
    );
    console.log("DeepSeek Chat Response:", chatResponse);
  } catch (error) {
    console.error("DeepSeek error:", error);
  }
})();
```

### Gemini

```typescript
import { GeminiInstance } from 'ai-services-hub';

const gemini = new GeminiInstance('YOUR_GEMINI_API_KEY');

(async () => {
  try {
    const chatResponse = await gemini.chat(
      "What is the speed of light?",
      "gemini-2.0-pro-exp-02-05", // optional model
      "You are a science expert"   // optional system prompt
    );
    console.log("Gemini Chat Response:", chatResponse);
  } catch (error) {
    console.error("Gemini error:", error);
  }
})();
```

### LM Studio

```typescript
import { LmStudioInstance } from 'ai-services-hub';

const lmStudio = new LmStudioInstance('YOUR_LMSTUDIO_URL'); // e.g., "localhost:5000"

(async () => {
  try {
    const chatResponse = await lmStudio.chat(
      "Compose a short story",
      "You are a creative writer",               // optional system prompt
      "speakleash/Bielik-11B-v2.3-Instruct-GGUF"    // optional model
    );
    console.log("LM Studio Chat Response:", chatResponse);

    const embedding = await lmStudio.embedding(
      "Text to embed",
      "speakleash/Bielik-11B-v2.3-Instruct-GGUF"
    );
    console.log("LM Studio Embedding:", embedding);

    const visionResponse = await lmStudio.vision(
      "Describe the image",
      "path/to/image.jpg",
      "Image analysis",                           // system prompt
      "speakleash/Bielik-11B-v2.3-Instruct-GGUF"
    );
    console.log("LM Studio Vision Response:", visionResponse);

    const models = await lmStudio.models();
    console.log("LM Studio Models:", models);
  } catch (error) {
    console.error("LM Studio error:", error);
  }
})();
```

### Ollama

```typescript
import { OIlamaInstance } from 'ai-services-hub';

const ollama = new OIlamaInstance('YOUR_OLLAMA_API_KEY');
// Note: The base URL for the Ollama API must be set in the OLLAMA_URL environment variable

(async () => {
  try {
    const chatResponse = await ollama.chat(
      "Describe microservices architecture",
      "Provide a detailed explanation", // optional system prompt
      "your-model-name"
    );
    console.log("Ollama Chat Response:", chatResponse);

    const generateResponse = await ollama.generate(
      "Generate a short poem",
      "your-model-name"
    );
    console.log("Ollama Generate Response:", generateResponse);

    const embedding = await ollama.embedding(
      "Text to embed",
      "all-minilm" // optional model
    );
    console.log("Ollama Embedding:", embedding);

    const modelsList = await ollama.models();
    console.log("Ollama Models:", modelsList);

    await ollama.pullModel("your-model-name");
    await ollama.deleteModel("your-model-name");
  } catch (error) {
    console.error("Ollama error:", error);
  }
})();
```

### Perplexity

```typescript
import { PerplexityInstance } from 'ai-services-hub';

const perplexity = new PerplexityInstance('YOUR_PERPLEXITY_API_KEY');

(async () => {
  try {
    // Example usage: invoking a chat method similar to other instances
    const chatResponse = await perplexity.chat("What is the future of AI?");
    console.log("Perplexity Chat Response:", chatResponse);
  } catch (error) {
    console.error("Perplexity error:", error);
  }
})();
```

### Qdrant

```typescript
import { QdrantInstance } from 'ai-services-hub';

const qdrant = new QdrantInstance({ 
  url: 'YOUR_QDRANT_URL', 
  apiKey: 'YOUR_QDRANT_API_KEY' 
});

(async () => {
  try {
    await qdrant.initQdrantClient("collection-name");
    await qdrant.saveEmbeddingToQdrant(
      "collection-name",
      [0.1, 0.2, 0.3], // example embedding vector
      { info: "example payload" }
    );
    const results = await qdrant.queryQdrant(
      [0.1, 0.2, 0.3],
      "collection-name"
    );
    console.log("Qdrant Query Results:", results);
  } catch (error) {
    console.error("Qdrant error:", error);
  }
})();
```

## Error Handling

Each service instance provides proper error handling—errors are logged and thrown so they can be managed via try-catch blocks in your application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your suggestions or improvements.

## License

This project is licensed under the MIT License.