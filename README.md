# AI Services Hub

This project provides a unified interface for interacting with multiple AI and search services. It serves as a central module that aggregates several service providers and search engines, making it easier to manage and integrate these capabilities into your application.

## Services Included

- **OpenAI**: Integration with OpenAI's APIs for state-of-the-art language models.
- **DeepSeek**: Advanced search capabilities powered by AI.
- **Gemini**: An interface to the Gemini AI service.
- **LM Studio**: Connect with LM Studio for language model interactions.
- **Ollama**: Service integration for interacting with the Ollama platform.
- **Qdrant**: Integration with Qdrant for vector similarity search and database management.

## Installation

Install the package via npm or yarn:
```bash
npm install ai-service-hub
```
or
```bash
yarn add ai-service-hub
```

## Environment Variables

Before using the services, copy the provided environment template file to a local `.env` file and populate the following values:

```bash
cp src/.env.template .env
```

- **DEEPSEEK_API_KEY**: Your API key for accessing DeepSeek's advanced search functionalities.
- **GEMINI_API_KEY**: API key for authenticating with the Gemini service.
- **QDRANT_URL**: The URL endpoint for your Qdrant vector similarity search instance.
- **OLLAMA_URL**: The URL for integrating with the Ollama platform.
- **LMSTUDIO_URL**: The URL endpoint for LM Studio's language model service.
- **OPENAI_API_KEY**: Your API key for accessing OpenAI's state-of-the-art language models.

## Usage

After installation, import the services into your project:

```typescript
import { openAi, deepSeek, gemini, lmstudio, ollama, qdrant } from "ai-service-hub";
// Example usage with OpenAI
openAi(/ Your parameters here /)
.then(response => {
console.log("Response from OpenAI:", response);
})
.catch(error => {
console.error("Error calling OpenAI:", error);
});
// Similarly, other services can be used in your application as required
```

## Project Structure

The core entry point is defined in `src/index.ts`, which aggregates the following modules:

- `./openAi`
- `./deepSeek`
- `./gemini`
- `./lmstudio`
- `./ollama`
- `./qdrant`

Each module encapsulates its respective service’s API interactions and abstracts them into a consistent interface.

## Environment Variables

Before using the services, copy the provided environment template file to a local `.env` file and populate the following values:
bash
cp src/.env.template .env
- **DEEPSEEK_API_KEY**: Your API key for accessing DeepSeek's advanced search functionalities.
- **GEMINI_API_KEY**: API key for authenticating with the Gemini service.
- **QDRANT_URL**: The URL endpoint for your Qdrant vector similarity search instance.
- **OLLAMA_URL**: The URL for integrating with the Ollama platform.
- **LMSTUDIO_URL**: The URL endpoint for LM Studio's language model service.
- **OPENAI_API_KEY**: Your API key for accessing OpenAI's state-of-the-art language models.

### Summary

- **README.md**: A new **Environment Variables** section has been added to guide users to set up their `.env` with explanations for each variable.
- **.env.template**: Inline comments now describe the purpose of each environment variable for easier configuration.

## Contributing

Contributions are welcome! If you encounter any issues or would like to contribute, please open an issue or submit a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.