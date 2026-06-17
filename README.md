# Welcome to Miami Tech

A landing page for people new to Miami who want to plug into the tech scene.
Visitors submit their details and book a coffee chat — **virtual ($100)** or
**in-person ($150)** — pay via Stripe, then pick a time.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — stores every submission
- **Stripe Checkout** — collects payment
- **Vercel** — hosting

## How it works

1. Visitor fills the form (name, email, phone, LinkedIn/Instagram, chat type).
2. `POST /api/checkout` saves the submission to Supabase (`payment_status: pending`)
   and creates a Stripe Checkout session.
3. Visitor pays on Stripe and is redirected to `/success`.
4. `/api/webhook` (Stripe) flips `payment_status` to `paid`.
5. The success page sends them to your Cal.com/Calendly link to schedule —
   connect that to your Apple/iCloud calendar so bookings hit your iPhone.

## Setup

### 1. Install

```bash
npm install
```

### 2. Database

In the Supabase **"Welcome to Miami Tech"** project, open the SQL Editor and run
[`supabase/schema.sql`](./supabase/schema.sql).

### 3. Environment

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (keep secret) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks (endpoint `/api/webhook`) |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL |
| `NEXT_PUBLIC_BOOKING_URL` | Your Cal.com / Calendly booking link |

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

## Deploy

Pushed to GitHub and deployed on Vercel. Set the same env vars in
**Vercel → Project → Settings → Environment Variables**, then add a Stripe
webhook pointing at `https://<your-domain>/api/webhook`.
