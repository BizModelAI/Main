import "dotenv/config";
console.log("✓ dotenv loaded");

import express from "express";
console.log("✓ express loaded");

import { storage } from "./server/storage.js";
console.log("✓ storage loaded");

import { registerRoutes } from "./server/routes.js";
console.log("✓ routes loaded");

import { setupAuthRoutes } from "./server/auth.js";
console.log("✓ auth loaded");

import { setupVite, serveStatic, log } from "./server/vite.js";
console.log("✓ vite loaded");

console.log("All imports successful!");

const app = express();
const port = 5000;

app.listen(port, () => {
  console.log(`Debug server running on port ${port}`);
});
