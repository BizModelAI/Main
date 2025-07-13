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

// Basic health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

const port = 5000;

// Setup server with routes
async function setupApp() {
  try {
    // Register all API routes
    const server = await registerRoutes(app);

    // Setup Vite development server
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
