import axios from "axios";
import { baseURL } from "./config";

export const models = async () => {
    const response = await axios.get(`${baseURL}/models`);
    return response.data;
}

