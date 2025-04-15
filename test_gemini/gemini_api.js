import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const prompt = process.argv[2] ?? "How does AI work?";
console.log(prompt);
// const prompt = "how many people are in the world?";

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  console.log(response.text);
}

await main();
