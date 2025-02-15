import { promises as fs } from "fs";
import { openai } from "./config";
import { Model } from "./chat";
import { ChatCompletionMessageParam } from "openai/resources";

export async function vision(prompt: string, filePath: string, systemPrompt: string, model: Model = "gpt-4o-mini") {
  try {

    let base64Image = "";
    try {
      const imageBuffer = await fs.readFile(filePath.replace(/'/g, ""));
      base64Image = imageBuffer.toString("base64");
    } catch (error) {
      console.error("Couldn't read the image. Make sure the path is correct and the file exists.");
    }

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
           {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
        ],
      },
    ];

    if (systemPrompt) {
      messages.unshift({ role: "system", content: [{ type: "text", text: systemPrompt }] });
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages as ChatCompletionMessageParam[],
      max_tokens: 1000,
      stream: false,
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("An error occurred:", err);
  }
};