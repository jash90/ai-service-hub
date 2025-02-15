# AI Services Hub

A unified TypeScript/JavaScript library for seamless integration with multiple AI services, providing a consistent interface for various AI model providers.

## Features

🤖 **Supported AI Services**
  - OpenAI (chat, embeddings, audio transcription, TTS, and vision)
  - DeepSeek (chat with temperature control)
  - Google's Gemini (chat)
  - LM Studio (chat, embeddings, and vision)
  - Ollama (chat, generate, embeddings, and model management)
  - Qdrant (vector database operations)

## Installation

```bash
npm install ai-services-hub
```
or
```bash
yarn add ai-services-hub
```

## Usage Examples

### OpenAI

```typescript
import { OpenAiInstance } from 'ai-services-hub';
const openAi = new OpenAiInstance('your-api-key');

// Chat
const chatResponse = await openAi.chat(
"What is TypeScript?",
"You are a helpful assistant", // system prompt (optional)
"gpt-4o-mini" // model (optional)
);

// Embeddings
const embedding = await openAi.embedding("Text to embed");
// Audio transcription
const transcript = await openAi.transcript("path/to/audio.mp3");
// Text-to-Speech
const audioFile = await openAi.tts("Hello world!", "nova", "tts-1");
// Vision
const visionResponse = await openAi.vision(
"Describe this image",
"path/to/image.jpg",
"System prompt"
);
```


### DeepSeek

```typescript
import { DeepSeekInstance } from 'ai-services-hub';
const deepSeek = new DeepSeekInstance('your-api-key');
const response = await deepSeek.chat(
"Your prompt",
"System prompt", // optional
"deepseek-reasoner", // optional
0.7 // temperature (optional)
);
```

### Gemini

```typescript
import { GeminiInstance } from 'ai-services-hub';

const gemini = new GeminiInstance('your-api-key');

const response = await gemini.chat(
  "Your prompt",
  "gemini-2.0-pro-exp-02-05", // optional
  "System prompt" // optional
);
```

### LM Studio

```typescript
import { LmStudioInstance } from 'ai-services-hub';

const lmStudio = new LmStudioInstance('your-url');

// Chat
const response = await lmStudio.chat(
  "Your prompt",
  "System prompt", // optional
  "model-name" // optional
);

// Embeddings
const embedding = await lmStudio.embedding(
  "Text to embed",
  "model-name" // optional
);

// Vision
const visionResponse = await lmStudio.vision(
  "Describe this image",
  "path/to/image.jpg",
  "System prompt",
  "model-name" // optional
);

// List available models
const models = await lmStudio.models();
```

### Ollama

```typescript
import { OIlamaInstance } from 'ai-services-hub';

const ollama = new OIlamaInstance('your-api-key');

// Chat
const chatResponse = await ollama.chat(
  "Your prompt",
  "System prompt", // optional
  "model-name"
);

// Generate
const generateResponse = await ollama.generate(
  "Your prompt",
  "model-name"
);

// Embeddings
const embedding = await ollama.embedding(
  "Text to embed",
  "all-minilm" // optional
);

// Model management
const models = await ollama.models();
await ollama.pullModel("model-name");
await ollama.deleteModel("model-name");
```

### Qdrant

```typescript
import { QdrantInstance } from 'ai-services-hub';

const qdrant = new QdrantInstance('your-qdrant-url');

// Initialize collection
await qdrant.initQdrantClient("collection-name");

// Save embedding
await qdrant.saveEmbeddingToQdrant(
  "collection-name",
  [/* vector */],
  { /* payload */ }
);

// Search similar vectors
const results = await qdrant.queryQdrant(
  [/* query vector */],
  "collection-name"
);
```

## Error Handling

All methods include error handling and will throw appropriate errors that can be caught using try-catch blocks.

## License

MIT License