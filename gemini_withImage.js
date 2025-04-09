import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  Type,
} from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prompt = `List 3 popular cities and give me what time is there now.
And list 3 popular food in that city.
Also give me how many people are living in there`;

async function main() {
  const image = await ai.files.upload({
    file: "./test_image/test01.jpg",
  });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            cityName: {
              type: Type.STRING,
              description: "Name of the city",
              nullable: false,
            },
            date: {
              type: Type.STRING,
              format: "date-time",
              description: "what time is there now",
              nullable: false,
            },
            population: {
              type: "integer",
              format: "int64",
              description: "how many people are living in there",
              nullable: false,
            },
            foods: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "what is the popular food in that city",
                nullable: true,
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
