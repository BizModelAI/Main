import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const port = 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    environment: "development",
    timestamp: new Date().toISOString(),
  });
});

// Serve client files
const clientPath = path.join(process.cwd(), "client");
const indexPath = path.join(clientPath, "index.html");

if (fs.existsSync(indexPath)) {
  app.use(express.static(clientPath));
  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get("*", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BizModelAI</title>
        </head>
        <body>
          <div id="root">
            <h1>BizModelAI Server</h1>
            <p>Server is running! Client files not found at: ${clientPath}</p>
            <p><a href="/api/health">Health Check</a></p>
          </div>
        </body>
      </html>
    `);
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
