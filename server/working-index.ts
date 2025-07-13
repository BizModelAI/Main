import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { createServer } from "http";

const MemoryStoreSession = MemoryStore(session);
const app = express();

// Basic middleware
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

// Basic health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

// Catch-all for SPA
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
          <p>The application is starting up...</p>
        </div>
      </body>
    </html>
  `);
});

const port = 5000;
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
