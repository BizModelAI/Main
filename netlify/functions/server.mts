import type { Context, Config } from "@netlify/functions";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../../server/routes.js";

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Register API routes
let server: any;

async function setupApp() {
  if (!server) {
    const httpServer = createServer(app);
    server = await registerRoutes(app);

    app.use((err: any, _req: any, res: any, _next: any) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
  }
  return server;
}

export default async (req: Request, context: Context) => {
  await setupApp();

  return new Promise((resolve, reject) => {
    // Convert Netlify Request to Node.js request format
    const url = new URL(req.url);

    // Create a mock Node.js request object
    const nodeReq = {
      method: req.method,
      url: url.pathname + url.search,
      headers: Object.fromEntries(req.headers.entries()),
      body: req.body,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams.entries()),
    };

    // Create a mock Node.js response object
    let statusCode = 200;
    let responseHeaders: Record<string, string> = {};
    let responseBody = "";

    const nodeRes = {
      status: (code: number) => {
        statusCode = code;
        return nodeRes;
      },
      json: (data: any) => {
        responseHeaders["Content-Type"] = "application/json";
        responseBody = JSON.stringify(data);
        resolve(
          new Response(responseBody, {
            status: statusCode,
            headers: responseHeaders,
          }),
        );
      },
      send: (data: any) => {
        responseBody = typeof data === "string" ? data : JSON.stringify(data);
        resolve(
          new Response(responseBody, {
            status: statusCode,
            headers: responseHeaders,
          }),
        );
      },
      setHeader: (name: string, value: string) => {
        responseHeaders[name] = value;
      },
      end: (data?: any) => {
        if (data) responseBody = data;
        resolve(
          new Response(responseBody, {
            status: statusCode,
            headers: responseHeaders,
          }),
        );
      },
      on: () => {},
    };

    try {
      // Handle the request with Express
      app(nodeReq as any, nodeRes as any, (err: any) => {
        if (err) {
          reject(
            new Response(JSON.stringify({ error: err.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
      });
    } catch (error) {
      reject(
        new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }
  });
};

export const config: Config = {
  path: "/api/*",
};
