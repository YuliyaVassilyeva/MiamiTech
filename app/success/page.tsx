export const dynamic = "force-dynamic";

export default function SuccessPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <main className="flex min-h-screen items-center justify-center bg-miami-gradient px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-2xl">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-4 text-3xl font-extrabold text-deep">
          You&apos;re in! Welcome to Miami.
        </h1>
        <p className="mt-3 text-deep/70">
          Payment received and your details are saved. The last step is picking a
          time — let&apos;s get your coffee chat on the calendar.
        </p>

        {bookingUrl ? (
          <a
            href={bookingUrl}
            className="mt-8 inline-block rounded-full bg-miami-gradient px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105"
          >
            Pick your time →
          </a>
        ) : (
          <p className="mt-8 rounded-xl bg-sand px-4 py-4 text-sm text-deep/70">
            I&apos;ll email you within 24 hours to schedule. Check your inbox
            (and spam, just in case).
          </p>
        )}

        <p className="mt-6 text-xs text-deep/40">
          Questions? Just reply to your payment receipt email.
        </p>
      </div>
    </main>
  );
}
