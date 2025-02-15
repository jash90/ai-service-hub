import { openai } from "./config"
import fs from "fs"
import path from "path"

type Voice = "nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer"
type Model = "tts-1" | "tts-1-hd"

export const tts = async (text: string, voice: Voice = "nova", model: Model = "tts-1") => {
    const speechFile = path.resolve("./speech.mp3");
    const mp3 = await openai().audio.speech.create({
        model: model,
        voice: voice,
        input: text
    })

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    return speechFile;
}