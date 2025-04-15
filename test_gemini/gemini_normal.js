import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prompt = `幫我將這張收據的資料變成一個json
  
  格式為
  
  {
  
  storeName: THE_STORE_NAME,
  
  date: 'YYYY-MM-DD',
  
  item: [
  
  {name, price, amount},
  
  {...}
  
  ]
  
  
  }`;

async function main() {
  const image = await ai.files.upload({
    file: "./test_image/test01.jpg",
  });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      createUserContent([prompt, createPartFromUri(image.uri, image.mimeType)]),
    ],
    config: {
      response_mime_type: "application/json",
      temperature: 1,
    },
  });
  try {
    // Remove backticks and "json" label
    const rawText = response.text.replace("```json", "").replace("```", "");
    const jsonResponse = JSON.parse(rawText);
    console.log(JSON.stringify(jsonResponse, null, 2));
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.log("Raw response text:", response.text);
  }
}

await main();
