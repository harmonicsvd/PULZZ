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

type Stat = { figure: string; label: string; source: string };

const ARTIST_STATS: Stat[] = [
  {
    figure: "100,000+",
    label: "new tracks are uploaded to streaming services every single day.",
    source: "Luminate 2023 Year-End Music Report",
  },
  {
    figure: "86%",
    label: "of all tracks on streaming earned fewer than 1,000 plays in 2023.",
    source: "Luminate 2023 Year-End Music Report",
  },
];

const LISTENER_STATS: Stat[] = [
  {
    figure: "184M",
    label:
      "tracks now sit on streaming services — far more than any person can sift through.",
    source: "Luminate 2023 Year-End Music Report",
  },
  {
    figure: "45.6M",
    label:
      "of those tracks got zero streams in 2023 — great music going completely unheard.",
    source: "Luminate 2023 Year-End Music Report",
  },
];

type Partner = { name: string; role: string; href: string };

const PARTNERS: Partner[] = [
  { name: "Musixmatch", role: "Synced lyrics", href: "https://www.musixmatch.com" },
  { name: "Songstats", role: "Streaming analytics", href: "https://songstats.com" },
  {
    name: "Internet Archive",
    role: "Public-domain recordings",
    href: "https://archive.org",
  },
];

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
<Wordmark className="text-foreground" /> helps emerging artists build a
            base of true fans who genuinely care — <em className="not-italic text-foreground">before</em>{" "}
            the big streaming-day push begins. Listeners discover unreleased
            songs early, mark the moments that move them, and champion the music
            first.
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

      {/* The problem */}
      <section className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              The discovery gap
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Great music is getting lost on both sides.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              The flood of new releases has broken discovery. Artists can&rsquo;t
              break through the noise, and listeners can&rsquo;t find the music
              worth caring about.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Artists side */}
            <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold tracking-tight">
                Artists can&rsquo;t break through
              </h3>
              <div className="mt-6 space-y-6">
                {ARTIST_STATS.map((s) => (
                  <div key={s.figure}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-4xl font-bold text-primary">
                        {s.figure}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Source: {s.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Listeners side */}
            <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold tracking-tight">
                Listeners can&rsquo;t keep up
              </h3>
              <div className="mt-6 space-y-6">
                {LISTENER_STATS.map((s) => (
                  <div key={s.figure}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-4xl font-bold text-primary">
                        {s.figure}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Source: {s.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-base text-foreground">
            Pulzz closes the gap: artists earn true fans early, and listeners get
            to discover and champion new music first.
          </p>
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

      {/* About the maker */}
      <section className="border-t border-border/70 bg-card/40">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              About the maker
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
              Built by an artist, for artists.
            </h2>
          </div>
          <p className="mt-6 text-center text-lg leading-relaxed text-muted-foreground">
            Pulzz is built by an independent artist — a singer, composer, and
            lyricist with{" "}
            <span className="font-semibold text-foreground">
              20+ original songs
            </span>{" "}
            released on streaming platforms and{" "}
            <span className="font-semibold text-foreground">
              15 years of training in Indian classical music
            </span>
            . Pulzz is the tool they wished existed: a way to find the people who
            truly care about a song before release day, instead of shouting into
            an algorithm.
          </p>

          {/* Partners */}
          <div className="mt-12 border-t border-border/70 pt-8">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Powered by
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {PARTNERS.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm transition-colors hover:border-primary/60"
                >
                  <span className="font-semibold text-foreground">{p.name}</span>
                  <span className="text-muted-foreground"> · {p.role}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Catch the next song before it drops.
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
