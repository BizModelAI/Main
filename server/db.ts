import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Improved configuration for better reliability
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10 seconds
});

// Add connection error handling
pool.on("error", (err) => {
  console.error("Database pool error:", err);
});

pool.on("connect", () => {
  console.log("Database connection established");
});

// Test database connection on startup
pool
  .connect()
  .then((client) => {
    console.log("✅ Database connection test successful");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Database connection test failed:", err);
  });

export const db = drizzle({ client: pool, schema });
