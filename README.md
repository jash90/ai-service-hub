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