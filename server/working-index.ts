import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";
import { setupAuthRoutes } from "./auth.js";

const MemoryStoreSession = MemoryStore(session);
const app = express();

// Raw body parsing for Stripe webhooks
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

// JSON parsing for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000,
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Setup authentication routes
setupAuthRoutes(app);

// Setup server with routes BEFORE Vite middleware
async function setupApiRoutes() {
  // Register all API routes first
  await registerRoutes(app);
}

// Basic health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

// Comprehensive health check endpoint
app.get("/api/health/detailed", async (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: "unknown", details: "" },
      openai: { status: "unknown", details: "" },
      environment: { status: "unknown", details: "" },
    },
  };

  // Check database connection
  try {
    const { pool } = await import("./db.js");
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    health.checks.database = {
      status: "healthy",
      details: "Connection successful",
    };
  } catch (error) {
    health.checks.database = {
      status: "unhealthy",
      details:
        error instanceof Error ? error.message : "Unknown database error",
    };
    health.status = "degraded";
  }

  // Check OpenAI API key
  health.checks.openai = {
    status: process.env.OPENAI_API_KEY ? "configured" : "missing",
    details: process.env.OPENAI_API_KEY
      ? "API key present"
      : "API key not configured",
  };

  // Check critical environment variables
  const requiredEnvVars = ["DATABASE_URL", "SESSION_SECRET"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  health.checks.environment = {
    status: missingVars.length === 0 ? "healthy" : "unhealthy",
    details:
      missingVars.length === 0
        ? "All required environment variables present"
        : `Missing: ${missingVars.join(", ")}`,
  };

  if (missingVars.length > 0) {
    health.status = "unhealthy";
  }

  const statusCode =
    health.status === "healthy"
      ? 200
      : health.status === "degraded"
        ? 207
        : 503;
  res.status(statusCode).json(health);
});

const port = 5000;

// Setup server with routes
async function setupApp() {
  try {
    // Register all API routes FIRST, before Vite middleware
    const server = createServer(app);
    await registerRoutes(app);

    // Setup Vite development server AFTER API routes
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
    console.log(
      "✅ Server with all routes and Vite development server started successfully!",
    );

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    // Fallback to basic HTML
    app.get("*", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>BizModelAI</title>
          </head>
          <body>
            <div id="root">
              <h1>Server is running!</h1>
              <p>Server failed to start properly. Check console for errors.</p>
            </div>
          </body>
        </html>
      `);
    });

    // Create basic server as fallback
    return createServer(app);
  }
}

setupApp()
  .then((server) => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to setup app:", error);
    process.exit(1);
  });
