import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  Type,
} from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

// 3.  Items: A list of items purchased. For each item, extract:
//     *   Name: The name of the item.
//     *   Price: The price of the item.
//     *   Quantity: The quantity of the item (if available).

// items: {
//   type: Type.ARRAY,
//   description: "A list of items purchased",
//   items: {
//     type: Type.OBJECT,
//     properties: {
//       name: {
//         type: Type.STRING,
//         description: "The name of the item",
//         nullable: false,
//       },
//       price: {
//         type: Type.NUMBER,
//         description: "The price of the item",
//         nullable: false,
//       },
//       quantity: {
//         type: Type.INTEGER,
//         description: "The quantity of the item",
//         nullable: true,
//       },
//     },
//   },
// },

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prompt = `Extract the following information from the receipt image:

Return the data in JSON format.

The JSON format is

{
  storeName: THE_STORE_NAME,
  date: YYYY-MM-DD
}

`;

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
            description: "The name of store",
            nullable: false,
          },
          date: {
            type: Type.STRING,
            format: "date-time",
            description: "The date of the transaction (YYYY-MM-DD)",
            nullable: false,
          },
        },
      },
    },
  });

  console.debug(response.text);
}

await main();
