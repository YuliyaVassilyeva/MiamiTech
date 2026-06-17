import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Stripe webhook — marks a submission as paid once Checkout completes.
 * Configure the endpoint in the Stripe dashboard pointing at /api/webhook
 * and set STRIPE_WEBHOOK_SECRET. Optional but recommended: it makes the
 * "paid" status reliable even if the user closes the success page.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig || "", secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      metadata?: { submission_id?: string };
    };
    const submissionId = session.metadata?.submission_id;

    try {
      const supabase = getSupabaseAdmin();
      const query = supabase
        .from("submissions")
        .update({ payment_status: "paid" });

      if (submissionId) {
        await query.eq("id", submissionId);
      } else {
        await query.eq("stripe_session_id", session.id);
      }
    } catch (err) {
      console.error("Failed to mark submission paid:", err);
      return NextResponse.json({ error: "DB update failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
