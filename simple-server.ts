import "dotenv/config";
import express from "express";
import { db } from "./server/db.js";

console.log("Starting simple server...");

const app = express();

app.get("/test", async (req, res) => {
  try {
    // Test database connection
    const result = await db.execute("SELECT 1 as test");
    res.json({ status: "Database connected!", result });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Simple server running on port ${port}`);
});
