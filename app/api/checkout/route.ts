import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getStripe, CHAT_PRICING, type ChatType } from "@/lib/stripe";

export const runtime = "nodejs";

type Payload = {
  fullName?: string;
  email?: string;
  phone?: string;
  social?: string;
  chatType?: string;
  preferredTimes?: string;
  notes?: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const fullName = (body.fullName || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const social = (body.social || "").trim();
  const preferredTimes = (body.preferredTimes || "").trim();
  const notes = (body.notes || "").trim();
  const chatType = body.chatType as ChatType;

  // Validation
  if (!fullName || !email || !phone || !social) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 }
    );
  }
  if (chatType !== "virtual" && chatType !== "in_person") {
    return NextResponse.json(
      { error: "Please choose a chat type." },
      { status: 400 }
    );
  }

  const pricing = CHAT_PRICING[chatType];
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  // 1. Store the submission in Supabase (status: pending until paid)
  let submissionId: string | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        full_name: fullName,
        email,
        phone,
        social,
        chat_type: chatType,
        preferred_times: preferredTimes || null,
        notes: notes || null,
        amount: pricing.amount,
        payment_status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;
    submissionId = data.id;
  } catch (err) {
    console.error("Supabase insert failed:", err);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 }
    );
  }

  // 2. Create the Stripe Checkout session
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: pricing.amount,
            product_data: {
              name: pricing.label,
              description: "Welcome to Miami Tech — coffee chat",
            },
          },
        },
      ],
      metadata: {
        submission_id: submissionId ?? "",
        full_name: fullName,
        chat_type: chatType,
        social,
        phone,
      },
      success_url: `${origin}/success?sid=${submissionId}`,
      cancel_url: `${origin}/?canceled=1#book`,
    });

    // Save the Stripe session id back onto the submission
    try {
      const supabase = getSupabaseAdmin();
      await supabase
        .from("submissions")
        .update({ stripe_session_id: session.id })
        .eq("id", submissionId);
    } catch (e) {
      console.error("Failed to attach stripe_session_id:", e);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
