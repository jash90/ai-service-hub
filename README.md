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
npm install your-package-name
```
or
```bash
yarn add your-package-name
```

## Usage

After installation, import the services into your project:

```typescript
import { openAi, deepSeek, gemini, lmstudio, ollama, qdrant } from "your-package-name";
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

## Contributing

Contributions are welcome! If you encounter any issues or would like to contribute, please open an issue or submit a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.