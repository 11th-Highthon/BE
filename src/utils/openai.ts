import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

export const generateContent = async (propmt : string) : Promise<string> => {
    return "aa";
}