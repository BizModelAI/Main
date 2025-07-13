import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { createServer } from "http";

console.log("Starting server initialization...");

const MemoryStoreSession = MemoryStore(session);
const app = express();

// Trust proxy for proper IP detection in rate limiting
app.set("trust proxy", true);

// Raw body parsing for Stripe webhooks
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

// JSON parsing for other routes
app.use(express.json({ limit: "10mb" })); // Increased limit for quiz data
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Session configuration with improved concurrency support
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 86400000, // 24 hours
      max: 100000, // Increased max sessions for concurrent users
      ttl: 86400000, // Session TTL
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    // Improved settings for concurrent access
    rolling: true, // Reset expiry on activity
    name: "bizmodel.sid", // Custom session name
  }),
);

// Middleware to ensure all API routes return JSON
app.use("/api/*", (req: any, res: any, next: any) => {
  // Override res.send for API routes to always return JSON
  const originalSend = res.send;

  res.send = function (data: any) {
    // If data is not already JSON, wrap it
    if (
      typeof data === "string" &&
      !data.trim().startsWith("{") &&
      !data.trim().startsWith("[")
    ) {
      // This is likely an HTML error page, convert to JSON
      return originalSend.call(
        this,
        JSON.stringify({
          error: "Internal server error",
          message: "An unexpected error occurred",
          timestamp: new Date().toISOString(),
        }),
      );
    }

    // Set content type to JSON
    if (!res.get("Content-Type")) {
      res.set("Content-Type", "application/json");
    }

    return originalSend.call(this, data);
  };

  next();
});

// API error handling middleware - must be before routes
app.use("/api/*", (err: any, req: any, res: any, next: any) => {
  console.error("API Error:", err);

  // Ensure we always return JSON for API routes
  if (!res.headersSent) {
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

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

// Database test endpoint for debugging signup issues
app.get("/api/test/database", async (req, res) => {
  res.header("Content-Type", "application/json");

  const results = {
    timestamp: new Date().toISOString(),
    tests: {} as any,
  };

  try {
    // Test 1: Basic connection
    const { pool } = await import("./db.js");
    const client = await pool.connect();
    await client.query("SELECT 1 as test");
    client.release();
    results.tests.basicConnection = {
      status: "success",
      message: "Database connection working",
    };

    // Test 2: Storage functions
    const { storage } = await import("./storage.js");

    // Test getUserByUsername
    try {
      const testUser = await storage.getUserByUsername("nonexistent@test.com");
      results.tests.getUserByUsername = {
        status: "success",
        message: "getUserByUsername working",
        result:
          testUser === undefined ? "no user found (expected)" : "user found",
      };
    } catch (error) {
      results.tests.getUserByUsername = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      };
    }

    res.json(results);
  } catch (error) {
    results.tests.basicConnection = {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    };
    res.status(500).json(results);
  }
});

const port = 5000;

// Global error handler for unhandled errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Setup server with routes
async function setupApp() {
  try {
    // Register all API routes FIRST, before Vite middleware
    await registerRoutes(app);

    // Create HTTP server after registering routes
    const server = createServer(app);

    // Add final error handler after all routes
    app.use((err: any, req: any, res: any, next: any) => {
      console.error("Final error handler:", err);

      // For API routes, always return JSON
      if (req.path.startsWith("/api/")) {
        if (!res.headersSent) {
          res.status(500).json({
            error: "Internal server error",
            timestamp: new Date().toISOString(),
            path: req.path,
          });
        }
        return;
      }

      // For non-API routes, pass to next handler
      next(err);
    });

    // Setup Vite development server AFTER API routes
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
    console.log(
      "✅ Server with all routes and Vite development server started successfully!",
    );

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error);

    // Add emergency API error handler
    app.use("/api/*", (req: any, res: any) => {
      res.status(500).json({
        error: "Server startup failed",
        message: "Please try again later",
      });
    });

    // Fallback to basic HTML for non-API routes
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

// Add timeout for setup
Promise.race([
  setupApp(),
  new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("Server setup timeout after 30 seconds")),
      30000,
    ),
  ),
])
  .then((server) => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to setup app:", error);
    console.error("Error details:", error.stack);

    // Try basic fallback server
    console.log("Starting fallback server...");
    app.get("/api/health", (req, res) => {
      res.json({ status: "Server is running (fallback mode)!" });
    });

    app.get("*", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>BizModelAI</title>
          </head>
          <body>
            <div id="root">
              <h1>Server is running in fallback mode</h1>
              <p>The application is starting up...</p>
            </div>
          </body>
        </html>
      `);
    });

    app.listen(port, () => {
      console.log(`Fallback server running on port ${port}`);
    });
  });
