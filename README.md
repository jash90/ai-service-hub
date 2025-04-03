# AI Service Hub

[![npm version](https://img.shields.io/npm/v/ai-service-hub.svg)](https://www.npmjs.com/package/ai-service-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue)](https://www.typescriptlang.org/)

A unified TypeScript library for interacting with multiple AI services through a single, consistent interface.

## Features

- 🚀 **Single API** - Access multiple AI services through one consistent interface
- 🔌 **Multiple Providers** - Support for OpenAI, Claude, Groq, Gemini, DeepSeek, Perplexity, Ollama, and LM Studio
- 🖼️ **Vision Support** - Process images with AI models that support vision capabilities
- 📊 **Embeddings** - Generate embeddings for semantic search and similarity applications
- 🔄 **Auto-Detection** - Automatically select the appropriate service based on the model
- 💬 **Chat Interfaces** - Easy-to-use chat completion APIs with system prompts
- 📝 **Format Flexibility** - Support for text and JSON response formats

## Installation

```bash
npm install ai-service-hub
```

## Supported Services

| Service    | Chat | Vision | Embeddings | Description                              |
|------------|------|--------|------------|------------------------------------------|
| OpenAI     | ✅   | ✅     | ✅         | GPT-4o, GPT-3.5, etc.                    |
| Claude     | ✅   | ✅     | ❌         | Claude 3 Opus, Sonnet, Haiku             |
| Groq       | ✅   | ✅     | ✅         | Grok-2, Grok-2-Image, Grok-2-Vision      |
| Gemini     | ✅   | ❌     | ❌         | Google's Gemini models                   |
| DeepSeek   | ✅   | ❌     | ❌         | DeepSeek Chat and Reasoner               |
| Perplexity | ✅   | ❌     | ❌         | Sonar models                             |
| Ollama     | ✅   | ❌     | ✅         | Self-hosted open models                  |
| LM Studio  | ✅   | ❌     | ❌         | Self-hosted LM Studio models             |

## Basic Usage

```typescript
import { GlobalInstance, ModelOpenAi } from 'ai-service-hub';

// Initialize with your API keys
const ai = new GlobalInstance({
  openAiKey: 'your-openai-key',
  claudeKey: 'your-claude-key',
  grokKey: 'your-groq-key',
  // Add other service keys as needed
});

// Basic chat completion
async function getCompletion() {
  const response = await ai.chat({
    prompt: "What's the capital of France?",
    model: ModelOpenAi.gpt4o,
    systemPrompt: "You are a helpful assistant."
  });
  
  console.log(response);
}
```

## Examples

### OpenAI Chat

```typescript
import { OpenAiInstance, ModelOpenAi } from 'ai-service-hub';

const openai = new OpenAiInstance('your-api-key');

const response = await openai.chat(
  "Explain quantum computing in simple terms", 
  "You are a helpful assistant", 
  ModelOpenAi.gpt4o
);
```

### Claude Chat

```typescript
import { ClaudeInstance, ModelClaude } from 'ai-service-hub';

const claude = new ClaudeInstance('your-api-key');

const response = await claude.chat(
  "Write a short story about a robot learning to paint", 
  "You are a creative writer", 
  ModelClaude.claude3Opus
);
```

### Vision API (OpenAI)

```typescript
import { OpenAiInstance } from 'ai-service-hub';

const openai = new OpenAiInstance('your-api-key');

// Convert your image to base64 first
const response = await openai.vision(
  "What's in this image?", 
  base64Image, 
  "Describe the image in detail"
);
```

### Embeddings (OpenAI)

```typescript
import { OpenAiInstance, ModelOpenAiEmbedding } from 'ai-service-hub';

const openai = new OpenAiInstance('your-api-key');

const embedding = await openai.embedding(
  "This is a sample text to embed", 
  ModelOpenAiEmbedding.textEmbedding3Large
);
```

### Using Global Instance

```typescript
import { GlobalInstance, ModelOpenAi, ModelClaude } from 'ai-service-hub';

const ai = new GlobalInstance({
  openAiKey: 'your-openai-key',
  claudeKey: 'your-claude-key'
});

// OpenAI will be automatically selected based on the model
const openaiResponse = await ai.chat({
  prompt: "Explain how rainbows form",
  model: ModelOpenAi.gpt4o
});

// Claude will be automatically selected based on the model
const claudeResponse = await ai.chat({
  prompt: "Write a poem about autumn",
  model: ModelClaude.claude3Sonnet
});
```

## Configuration

Each service requires different configuration parameters:

```typescript
const globalInstance = new GlobalInstance({
  openAiKey: 'your-openai-key',
  claudeKey: 'your-anthropic-key',
  grokKey: 'your-groq-key',
  geminiKey: 'your-gemini-key',
  deepSeekKey: 'your-deepseek-key',
  perplexityKey: 'your-perplexity-key',
  ollamaUrl: 'http://localhost:11434',
  lmstudioUrl: 'http://localhost:1234'
});
```

## Recent Updates

- Added Claude AI integration with chat and vision capabilities
- Fixed Groq (formerly branded as Grok) implementation with latest models
- Converted all enums to modern TypeScript object literals
- Added ESLint and Prettier for code quality
- Enhanced vision capabilities across multiple providers
- Improved type safety throughout the codebase

## License

[MIT](LICENSE)

## Author

Bartłomiej Zimny