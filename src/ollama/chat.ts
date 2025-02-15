import { ollama } from "./config";

interface Message {
  role: string;
  content: string;
}

interface ChatPayload {
  model: string;
  messages: Message[];
}

export const chat = async (prompt: string, systemPrompt: string | null = null, model: string) => {
  const payload: ChatPayload = {
    model: model,
    messages: [
      { role: "user", content: prompt },
    ]
  };

  try {
    const response = await ollama.post("/chat", payload);
    return response.data;
  } catch (error) {
    console.error("Error during chat:", error);
    throw error;
  }
};