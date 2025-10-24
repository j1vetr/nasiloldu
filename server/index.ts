import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Compression middleware (gzip/deflate)
app.use(compression({
  threshold: 1024, // Only compress responses > 1KB
  level: 6, // Compression level (0-9, 6 is balanced)
}));

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

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

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // SSR Meta Tags handled by seoMiddleware in routes.ts

  // Cache headers for static assets (production only)
  if (app.get("env") === "production") {
    app.use((req, res, next) => {
      // Cache static assets for 1 year
      if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Cache HTML pages for 1 hour (with revalidation)
      else if (!req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      }
      next();
    });
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Production: Serve static files
    const path = await import("path");
    const distPath = path.resolve(import.meta.dirname, "public");
    const express = await import("express");
    app.use(express.default.static(distPath));
    
    // Production: SSR for all HTML routes
    app.use("*", async (req, res, next) => {
      try {
        // Skip static files
        if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
          return next();
        }
        
        const { renderHTMLWithMeta } = await import("./ssr");
        const fs = await import("fs");
        const templatePath = path.resolve(distPath, "index.html");
        
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
          log("index.html not found, falling back to static serve");
          return next();
        }
        
        await renderHTMLWithMeta(req, res, templatePath);
      } catch (error) {
        console.error("SSR error in production:", error);
        next();
      }
    });
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
