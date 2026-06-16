const LISTENER_URL = "/pulzz-listener/";
const ARTIST_URL = "/artist/";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      Pul<span className="text-primary">zz</span>
    </span>
  );
}

function PulseBars() {
  const bars = [0.5, 0.9, 0.3, 0.7, 1, 0.45, 0.8, 0.6, 0.95, 0.4, 0.75, 0.55];
  return (
    <div
      className="flex items-end justify-center gap-1.5 h-24"
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-2 rounded-full bg-primary/80 origin-bottom"
          style={{
            height: `${h * 100}%`,
            animation: `pulse-bar 1.2s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

type Step = { n: string; title: string; body: string };

const STEPS: Step[] = [
  {
    n: "01",
    title: "Discover before release",
    body: "Listeners stream unreleased tracks days before they drop — the earliest possible ears on a song.",
  },
  {
    n: "02",
    title: "Mark the moments",
    body: "Tap to flag the exact seconds that hit — the hook, the drop, the line you'll replay.",
  },
  {
    n: "03",
    title: "React & spread",
    body: "Mark a song Discovered or Skip. Artists watch real-time discovery stats as the buzz builds.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Wordmark className="text-2xl" />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-block">
              Musicathon 2026 · June 15–21
            </span>
            <a
              href={LISTENER_URL}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Open the app
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-20 text-center sm:pt-28">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Pre-release music discovery
            </span>
          </div>
          <h1
            className="animate-float-up mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
            style={{ animationDelay: "0.05s" }}
          >
            Catch a song&rsquo;s{" "}
            <span className="text-primary">pulse</span> before it drops.
          </h1>
          <p
            className="animate-float-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            style={{ animationDelay: "0.12s" }}
          >
            <Wordmark className="text-foreground" /> is where listeners discover
            unreleased songs early, mark the moments that move them, and react —
            while artists watch the buzz build in real time.
          </p>
          <div
            className="animate-float-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.18s" }}
          >
            <a
              href={LISTENER_URL}
              className="w-full rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Discover as a listener
            </a>
            <a
              href={ARTIST_URL}
              className="w-full rounded-full border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground shadow-sm transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Open the artist dashboard
            </a>
          </div>
          <div
            className="animate-float-up mx-auto mt-14 max-w-md"
            style={{ animationDelay: "0.24s" }}
          >
            <PulseBars />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How Pulzz works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A simple loop that turns early listens into real signal.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-card-border bg-card p-7 shadow-sm"
            >
              <span className="font-display text-3xl font-bold text-primary">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Two-sided value */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Listeners */}
          <div className="flex flex-col rounded-3xl border border-card-border bg-card p-8 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              For listeners
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
              Be first. Be the one who found it.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "Stream unreleased songs before release day",
                "Mark your favorite moments as you listen",
                "React Discovered or Skip and earn points",
                "Build a profile of the tracks you found early",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <a
              href={LISTENER_URL}
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Start discovering →
            </a>
          </div>

          {/* Artists */}
          <div className="flex flex-col rounded-3xl border border-card-border bg-card p-8 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              For artists
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
              Watch your song find its people.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "Submit your track to the discovery pool",
                "See reactions and discovery stats in real time",
                "Find the exact moments listeners love most",
                "Climb the Discovery Wall leaderboard",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <a
              href={ARTIST_URL}
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Open the dashboard →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
          <Wordmark className="text-lg text-foreground" />
          <span>Built for Musicathon 2026 · June 15–21</span>
        </div>
      </footer>
    </div>
  );
}
