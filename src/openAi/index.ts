import {embedding} from "./embedding";
import {chat} from "./chat";
import {tts} from "./tts";
import {transcript} from "./transcript";
import {vision} from "./vision";
import {openai} from "./config";

export default {
    embedding,
    chat,
    tts,
    transcript,
    vision,
    config: openai
}