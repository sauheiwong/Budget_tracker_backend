// const express = require("express");
import express from "express";
const app = express();
import { geminiAPI } from "./gemini.js";

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
  res.status(200).send("welcome home");
});

app.get("/api/users", (req, res) => {
  const name = req.query.name;
  const age = req.query.age;
  console.log(`收到的資料：姓名=${name}, 年齡=${age}`);
  const data = {
    name,
    age,
    message: "Welcome new user",
  };
  res.json(data);
});

app.get("/api/gemini", async (req, res) => {
  try {
    let [text, chat] = [null, null];
    const message = req.query.message;
    console.log(AI);
    if (AI.chat != null) {
      [text, chat] = await geminiAPI(message, AI.chat);
    }
    [text, chat] = await geminiAPI(message);
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
