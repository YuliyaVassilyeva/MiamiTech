import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY.");
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

export const CHAT_PRICING = {
  virtual: { amount: 10000, label: "Virtual coffee chat" },
  in_person: { amount: 15000, label: "In-person coffee chat (Miami)" },
} as const;

export type ChatType = keyof typeof CHAT_PRICING;
