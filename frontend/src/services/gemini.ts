/**
 * Shared Gemini helper.
 *
 * In development the Vite middleware at /api/gemini handles requests.
 * In production (Vercel) set VITE_API_BASE_URL to your Render backend URL,
 * e.g. https://healerai-backend.onrender.com — then all calls go there instead.
 */
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export async function callGemini(prompt: string, imageBase64?: string): Promise<string> {
  const url = `${API_BASE}/api/gemini`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, ...(imageBase64 ? { imageBase64 } : {}) }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[v0] Gemini proxy error:", res.status, text.substring(0, 200));
      throw new Error(`Gemini error ${res.status}`);
    }

    const data = await res.json();
    return data.text as string;
  } catch (err) {
    console.error("[v0] Gemini fetch error:", err);
    throw err;
  }
}
