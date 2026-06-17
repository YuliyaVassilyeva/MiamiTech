import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-miami-gradient text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur">
            🌴 New to the 305?
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Welcome to Miami Tech.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
            Moving to Miami and trying to break into the tech scene? I&apos;ll
            help you plug in — the right events, the right people, the right
            rooms. Book a coffee chat and let&apos;s get you connected.
          </p>
          <a
            href="#book"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-lg font-bold text-coral shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            Book a coffee chat ☕
          </a>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-deep">
          What you get
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              emoji: "🤝",
              title: "The right intros",
              body: "Warm introductions to founders, operators, and investors actually building in Miami.",
            },
            {
              emoji: "📍",
              title: "The map",
              body: "Where the tech community actually hangs out — meetups, coworking spots, and the events worth your time.",
            },
            {
              emoji: "🚀",
              title: "A head start",
              body: "Curated resources and a personal game plan so you skip the months of figuring it out alone.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5"
            >
              <div className="text-4xl">{c.emoji}</div>
              <h3 className="mt-4 text-xl font-bold text-deep">{c.title}</h3>
              <p className="mt-2 text-deep/70">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="bg-white/60 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-3xl font-bold text-deep">
            Book your coffee chat
          </h2>
          <p className="mt-3 text-center text-deep/70">
            Tell me a bit about you, pick a format, and you&apos;ll be sent to
            secure checkout. After payment you&apos;ll choose a time that works.
          </p>
          <div className="mt-10">
            <BookingForm />
          </div>
        </div>
      </section>

      <footer className="bg-deep py-10 text-center text-sm text-white/60">
        Welcome to Miami Tech · Built with ☀️ in Miami
      </footer>
    </main>
  );
}
