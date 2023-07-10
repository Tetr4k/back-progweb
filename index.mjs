import express from "express";
import { port } from './config.mjs';

import { chatRouter, userRouter } from "./routes/index.mjs";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", chatRouter, userRouter);

app.get("/health", async (req, res) => {
  console.log("GET /health");
  res.status(200).send();
})

app.listen(port, () => {
  console.log(`Running on ${port}`);
});