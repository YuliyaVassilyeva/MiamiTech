"use client";

import { useState } from "react";

type ChatType = "virtual" | "in_person";

const OPTIONS: {
  id: ChatType;
  label: string;
  price: string;
  blurb: string;
}[] = [
  {
    id: "virtual",
    label: "Virtual coffee chat",
    price: "$100",
    blurb: "45 min over video — perfect if you haven't moved yet.",
  },
  {
    id: "in_person",
    label: "In-person coffee chat",
    price: "$150",
    blurb: "Meet in Miami over real coffee. The full local download.",
  },
];

export default function BookingForm() {
  const [chatType, setChatType] = useState<ChatType>("virtual");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      fullName: String(data.get("fullName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      social: String(data.get("social") || "").trim(),
      chatType,
      preferredTimes: String(data.get("preferredTimes") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      if (json.url) {
        window.location.href = json.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
    >
      {/* Chat type selector */}
      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((o) => {
          const active = chatType === o.id;
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => setChatType(o.id)}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                active
                  ? "border-coral bg-coral/5 ring-2 ring-coral/30"
                  : "border-black/10 hover:border-coral/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-deep">{o.label}</span>
                <span className="text-lg font-extrabold text-coral">
                  {o.price}
                </span>
              </div>
              <p className="mt-1 text-sm text-deep/60">{o.blurb}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4">
        <Field
          label="Full name"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="Jane Founder"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@email.com"
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="(305) 555-0123"
        />
        <Field
          label="LinkedIn or Instagram"
          name="social"
          type="text"
          required
          placeholder="linkedin.com/in/you  ·  @you"
        />
        <div>
          <label
            htmlFor="preferredTimes"
            className="mb-1 block text-sm font-semibold text-deep"
          >
            Preferred days / times{" "}
            <span className="text-deep/40">(optional)</span>
          </label>
          <textarea
            id="preferredTimes"
            name="preferredTimes"
            rows={2}
            placeholder="e.g. weekday mornings, or Tue/Thu after 3pm ET"
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-deep outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30"
          />
        </div>
        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-semibold text-deep"
          >
            Anything I should know? <span className="text-deep/40">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="What are you hoping to get out of Miami's tech scene?"
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-deep outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-miami-gradient py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "Taking you to checkout…"
          : `Continue to payment — ${
              chatType === "virtual" ? "$100" : "$150"
            }`}
      </button>
      <p className="mt-3 text-center text-xs text-deep/50">
        Secure payment via Stripe. You&apos;ll pick a time right after.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-deep">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full rounded-xl border border-black/10 px-4 py-3 text-deep outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30"
        {...props}
      />
    </div>
  );
}
