import { openai } from "./config"
import fs from "fs"

export const transcript = async (file: string) => {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(file),
        model: "whisper-1",
    });

    return transcription.text;
}