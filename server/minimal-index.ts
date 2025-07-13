console.log("Minimal server starting...");

import "dotenv/config";
import express from "express";
import { storage } from "./storage.js";
import { registerRoutes } from "./routes.js";

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.json({ message: "Minimal server working!" });
});

app.listen(port, () => {
  console.log(`Minimal server running on port ${port}`);
});
