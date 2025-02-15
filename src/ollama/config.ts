import axios from "axios";

export const ollama = axios.create({
    baseURL: `${process.env.OLLAMA_URL}/api`,
});