import axios from "axios";

export const models = async () => {
    const response = await axios.get(`${process.env.LMSTUDIO_URL}/models`);
    return response.data;
}

