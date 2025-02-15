import { Message } from "./Message";

export interface ChatPayload {
  model: string;
  messages: Message[];
}
