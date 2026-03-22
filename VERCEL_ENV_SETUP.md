# Vercel Environment Variables Setup

To deploy to Vercel, add these environment variables in your Vercel project settings:

## Required Variables

**VITE_GEMINI_API_KEY** = `AIzaSyCCb6PpM4MkuyYNs1bQHz_USgaSUi11RMQ`

This is the Google Generative AI API key used for all dynamic health insights generation (daily insights, health updates, alerts, and location-based news).

## How to Add to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Click **Add New**
4. Set:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyCCb6PpM4MkuyYNs1bQHz_USgaSUi11RMQ`
   - Environments: Select "Production", "Preview", and "Development" (or select "All")
5. Click **Save**
6. Redeploy your project

The API key will now be available to your frontend build via the `import.meta.env.VITE_GEMINI_API_KEY` variable.
