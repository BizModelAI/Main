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
  // Optimized configuration for concurrent users
  max: 20, // Increased pool size for concurrent requests
  min: 2, // Minimum connections to keep alive
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // acquireTimeoutMillis: 15000, // Time to wait for connection from pool (not a valid Pool option)
  // Enable statement timeout for long-running queries
  statement_timeout: 30000, // 30 second query timeout
  query_timeout: 30000, // 30 second query timeout
});

// Add connection error handling
pool.on("error", (err) => {
  console.error("Database pool error:", err);
});

pool.on("connect", () => {
  console.log("Database connection established");
});

// Test database connection on startup with timeout
Promise.race([
  pool.connect(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Database connection timeout")), 5000),
  ),
])
  .then((client) => {
    console.log("✅ Database connection test successful");
    if (client && typeof client.release === "function") {
      client.release();
    }
  })
  .catch((err) => {
    console.error("❌ Database connection test failed:", err.message);
    console.log("Continuing server startup without database...");
  });

export const db = drizzle({ client: pool, schema });

console.log("Database module loaded successfully");
