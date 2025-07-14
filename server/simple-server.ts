import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const port = 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    environment: "development",
    timestamp: new Date().toISOString(),
    mode: "simple-mode",
  });
});

// Basic API endpoints for testing
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Serve static files or fallback HTML
app.get("*", (req, res) => {
  const clientIndex = path.join(process.cwd(), "client", "index.html");

  if (fs.existsSync(clientIndex)) {
    res.sendFile(clientIndex);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BizModelAI - Development Mode</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            .status { color: green; }
            .warning { color: orange; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>BizModelAI - Development Server</h1>
            <p class="status">✅ Server is running successfully!</p>
            <p class="warning">⚠️ Running in simple mode (database disabled)</p>
            
            <h2>Available Endpoints:</h2>
            <ul>
              <li><a href="/api/health">/api/health</a> - Health check</li>
              <li><a href="/api/test">/api/test</a> - Test endpoint</li>
            </ul>
            
            <h2>Next Steps:</h2>
            <ol>
              <li>Set up your database connection in .env</li>
              <li>Install dependencies: <code>npm install</code></li>
              <li>Switch to full server: <code>npm run dev</code></li>
            </ol>
          </div>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`Simple server running on port ${port}`);
  console.log("Mode: Development (database disabled)");
  console.log("Access: http://localhost:5000");
});
