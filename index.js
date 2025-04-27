import express from "express";
import { geminiAPI } from "./gemini.js";
import "./database.js";

const app = express();

const AI = {};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Or specify your origin: "http://127.0.0.1:5500"
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/home", (req, res) => {
  res.status(200).send("<h1>welcome home</h1>");
});

app.get("/api/gemini", async (req, res) => {
  try {
    let [text, chat] = [null, null];
    const message = req.query.message;
    console.log(AI);
    if (AI.chat != null) {
      [text, chat] = await geminiAPI(message, AI.chat);
    } else {
      [text, chat] = await geminiAPI(message);
    }
    AI.chat = chat;
    res.json({ result: text });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send("An error occurred"); // Send an error response
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
