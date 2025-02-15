import { ollama } from './config';

export const generate = async (prompt: string, model: string) => {
  const payload = {
    model: model,
    prompt: prompt,
    options: {
      temperature: 0
    },
    stream: false
  };

  try {
    const response = await ollama.post("/generate", payload);
    return response.data;
  } catch (error) {
    console.error("Error generating code:", error);
  }
}
