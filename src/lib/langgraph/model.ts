import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  modelName: "z-ai/glm-4.5-air:free", // OpenRouter Model ID
  apiKey: process.env.OPENROUTER_API_KEY, // .env ফাইলে কি-টি থাকতে হবে
  configuration: {
    baseURL: "https://openrouter.ai/api/v1", // OpenRouter Base URL
  },
  temperature: 0.7, // প্রয়োজনমতো অ্যাডজাস্ট করুন
});