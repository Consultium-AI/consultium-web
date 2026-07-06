# Smartium (Vercel)

Production Vite + React app for [Smartium](https://smartium.nl).

## Deploy

Hosted on **Vercel**. Set environment variables from `.env.example` (all `VITE_*` keys) in the Vercel project settings.

```bash
npm ci
npm run build
```

## Stack

- Vite + React + Tailwind
- Firebase Auth / Firestore
- Stripe (publishable key in frontend; secret on Cloudflare Worker)
- OpenAI proxy: `VITE_API_BASE_URL` (Cloudflare Worker)
