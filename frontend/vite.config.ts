import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const GEMINI_API_KEY = "AIzaSyC1FbrqKHMkS18alFf0JvSXImNdDWkyGMs";

/**
 * Vite middleware plugin — handles POST /api/gemini inside the Vite dev
 * server process (Node.js) so the API key is never sent from the browser
 * and Google's origin restrictions don't apply.
 */
function geminiMiddlewarePlugin() {
  return {
    name: "gemini-middleware",
    configureServer(server: any) {
      // Middleware must be returned from configureServer, not directly used
      return () => {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          // Extract URL path without query string
          const pathname = req.url.split("?")[0];
          
          // Only handle our specific endpoint
          if (pathname !== "/api/gemini" || req.method !== "POST") {
            return next();
          }

          let body = "";
          
          req.on("data", (chunk: any) => {
            body += chunk.toString();
          });
          
          req.on("error", (err: any) => {
            console.error("[v0] Middleware request error", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Request error" }));
          });
          
          req.on("end", async () => {
            try {
              const { prompt, imageBase64 } = JSON.parse(body);

              if (!prompt || typeof prompt !== "string") {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "prompt is required" }));
              }

              const parts: any[] = [];
              if (imageBase64 && typeof imageBase64 === "string") {
                parts.push({ inlineData: { data: imageBase64, mimeType: "image/jpeg" } });
              }
              parts.push({ text: prompt });

              const upstream = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ contents: [{ parts }] }),
                }
              );

              if (!upstream.ok) {
                const errText = await upstream.text();
                console.error("[v0] Upstream error", upstream.status, errText.substring(0, 100));
                res.writeHead(upstream.status, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: errText.substring(0, 100) }));
              }

              const data = await upstream.json();
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
              
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ text }));
            } catch (err: any) {
              console.error("[v0] Middleware error:", err.message);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    geminiMiddlewarePlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
