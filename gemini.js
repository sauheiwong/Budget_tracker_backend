import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

async function main(text, chat = null) {
  dotenv.config();
  console.log(`IS chat exit?:  ${chat !== null}`);
  if (chat === null) {
    console.log("creating chat");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });
  }
  const response1 = await chat.sendMessage({
    message: text,
  });
  console.log("Chat response 1:", response1.text);
  return [response1.text, chat];
}

// await main("how many people are in the world?");

export { main as geminiAPI };
