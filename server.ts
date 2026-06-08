import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Transparent Telegram API Proxy (Bypasses Android WebView / Browser CORS blocks)
  app.use("/api/telegram-proxy", (req, res) => {
    // Inject headers to support secure Cross-Origin Resource Sharing (CORS) perfectly inside APKs
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "*");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // req.url is e.g. "/bot<token>/getMe" or "/file/bot<token>/photos/file_0.jpg"
    const targetPath = req.url;
    const targetUrl = `https://api.telegram.org${targetPath}`;

    // Establish forwarding options, modifying headers to bypass origin limitations
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders.origin;
    delete forwardHeaders.referer;
    
    // Force target host
    forwardHeaders["host"] = "api.telegram.org";

    const proxyReq = https.request(
      targetUrl,
      {
        method: req.method,
        headers: forwardHeaders
      },
      (proxyRes) => {
        // Forward the headers and status code back to client
        const resHeaders = { ...proxyRes.headers };
        // Expose CORS to local clients
        resHeaders["access-control-allow-origin"] = "*";
        resHeaders["access-control-allow-methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        resHeaders["access-control-allow-headers"] = "*";

        res.writeHead(proxyRes.statusCode || 205, resHeaders);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on("error", (err) => {
      console.error("[Proxy Error]:", err.message);
      res.status(500).json({
        success: false,
        error: "Failed to communicate with Telegram API servers",
        details: err.message
      });
    });

    // Pipe the client's incoming body (e.g., Multipart files) directly to Telegram
    req.pipe(proxyReq);
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "StorageGram Secure API Server Live" });
  });

  // 2. Vite Middleware configuration for SPA routing & Hot Module Reloading simulation
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[StorageGram Full-Stack App] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
