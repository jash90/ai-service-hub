import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export type Model = "gemini-2.0-pro-exp-02-05" | "gemini-2.0-flash-thinking-exp-01-21" | "learnlm-1.5-pro-experimental"

export const model = (model: Model, systemPrompt: string | undefined = undefined) => {
    return genAI.getGenerativeModel({
        model: model,
        systemInstruction: systemPrompt,
    });
}