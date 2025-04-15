import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  Type,
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
  
  {name, price, quantity},
  
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
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          storeName: {
            type: Type.STRING,
            description: "The name of the store",
            nullable: false,
          },
          date: {
            type: Type.STRING,
            format: "date-time",
            description: "The date of the transaction (YYYY-MM-DD)",
            nullable: false,
          },
          items: {
            type: Type.ARRAY,
            description: "A list of items purchased",
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the item",
                  nullable: false,
                },
                price: {
                  type: Type.NUMBER,
                  description: "The price of the item",
                  nullable: false,
                },
                quantity: {
                  type: Type.INTEGER,
                  description: "The quantity of the item",
                  nullable: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.debug(response.text);
}

await main();
