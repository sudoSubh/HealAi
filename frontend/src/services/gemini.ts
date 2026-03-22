/**
 * Shared Gemini helper — calls the backend proxy at /api/gemini
 * so the API key stays on the server and is never exposed to the browser.
 */
export async function callGemini(prompt: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini proxy error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.text as string;
}
