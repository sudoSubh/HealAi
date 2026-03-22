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
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url !== "/api/gemini" || req.method !== "POST") {
          return next();
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const { prompt, imageBase64 } = body;

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
              res.writeHead(upstream.status, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: errText }));
            }

            const data = await upstream.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ text }));
          } catch (err: any) {
            console.error("[gemini middleware]", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal error calling Gemini" }));
          }
        });
      });
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
