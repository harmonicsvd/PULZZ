import { Link } from "wouter";
import { Wordmark } from "@/components/Wordmark";

const LISTEN_GUIDE_URL = "/listen";
const ARTIST_URL = import.meta.env.VITE_ARTIST_URL ?? "/artist/";

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
  {
    name: "Musixmatch",
    role: "Lyrics, mood & theme analysis, taste profiling",
    href: "https://www.musixmatch.com",
  },
  {
    name: "Songstats",
    role: "Streaming analytics",
    href: "https://songstats.com",
  },
  {
    name: "Cyanite",
    role: "AI sound & mood analysis — genre, mood, tempo, key & energy",
    href: "https://cyanite.ai",
  },
  {
    name: "Internet Archive",
    role: "Public-domain recordings",
    href: "https://archive.org",
  },
];

const LISTENER_FLOW: Step[] = [
  {
    n: "01",
    title: "Discover before release",
    body: "Stream unreleased tracks days before they drop — the earliest possible ears on a song.",
  },
  {
    n: "02",
    title: "Mark the moments",
    body: "Tap to flag the exact seconds that hit — the hook, the drop, the line you'll replay.",
  },
  {
    n: "03",
    title: "Champion it first",
    body: "React Discovered or Skip, earn points, and become the one who found the song early.",
  },
  {
    n: "04",
    title: "Be there on release day",
    body: "When a song you discovered goes live on streaming, Pulzz lets you know — so you're first to press play on release day.",
  },
  {
    n: "05",
    title: "Tuned to your taste",
    body: "Pulzz analyzes the actual sound of every track with AI and ranks your Discover feed around the genres and moods you love — the more you react, the sharper it gets.",
  },
];

const ARTIST_FLOW: Step[] = [
  {
    n: "01",
    title: "Submit your track",
    body: "Drop an unreleased song into the discovery pool before its release day.",
  },
  {
    n: "02",
    title: "Watch it find its people",
    body: "See reactions and the exact moments listeners love most, in real time.",
  },
  {
    n: "03",
    title: "Build true fans early",
    body: "Grow a base of listeners who genuinely care — before the big streaming-day push begins.",
  },
  {
    n: "04",
    title: "Find artists & collaborate",
    body: "Discover other artists in the pool and team up — the Collaborate space helps you find your next co-writer or feature.",
  },
  {
    n: "05",
    title: "Matched to the right ears",
    body: "Cyanite's AI fingerprints your song's sound and surfaces it to listeners whose taste fits — the same matching that powers your collaborator suggestions in Collaborate.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-background" />
            </div>
            <Wordmark className="text-2xl" />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-block">
              Musicathon 2026 · June 15–21
            </span>
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
            Catch a song&rsquo;s <span className="text-primary">pulse</span>{" "}
            before it drops.
          </h1>
          <p
            className="animate-float-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            style={{ animationDelay: "0.12s" }}
          >
            <Wordmark className="text-foreground" /> helps emerging artists
            build a base of true fans who genuinely care —{" "}
            <em className="not-italic text-foreground">before</em> the big
            streaming-day push begins. Listeners discover unreleased songs and
            artists early, mark the moments that move them, and champion the
            music first.
          </p>
          <div
            className="animate-float-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.18s" }}
          >
            <Link
              href={LISTEN_GUIDE_URL}
              className="w-full rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Discover as a listener
            </Link>
            <a
              href={ARTIST_URL}
              className="w-full rounded-full border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground shadow-sm transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Discover as an Artist
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
              The flood of new releases has broken discovery. Artists
              can&rsquo;t break through the noise, and listeners can&rsquo;t
              find the music worth caring about.
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
            Pulzz closes the gap: artists earn true fans early, and listeners
            get to discover and champion new music first.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How Pulzz works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            One loop, two sides. Pulzz turns early listens into real signal —
            giving emerging artists genuine exposure and a base of true fans
            before release day, while listeners discover and champion new music
            first.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Listener side */}
          <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              For listeners
            </span>
            <div className="mt-6 space-y-6">
              {LISTENER_FLOW.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-display text-2xl font-bold text-primary">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Artist side */}
          <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              For artists
            </span>
            <div className="mt-6 space-y-6">
              {ARTIST_FLOW.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-display text-2xl font-bold text-primary">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
            released on streaming platforms,{" "}
            <span className="font-semibold text-foreground">
              15 years of training in Indian classical music
            </span>
            , and a{" "}
            <span className="font-semibold text-foreground">
              Master&rsquo;s in Data Science from TU Hamburg
            </span>
            . Pulzz is the tool they wished existed: a way to find the people
            who truly care about a song before release day, instead of shouting
            into an algorithm.
          </p>

          {/* Listen to the maker */}
          <div className="mt-10">
            <p className="text-center text-sm font-semibold text-foreground">
              Listen to the maker&rsquo;s originals
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_260px] md:items-stretch">
              <iframe
                title="The maker's music on Spotify"
                src="https://open.spotify.com/embed/artist/32AhTkruwhaaQWTF0AC56r?utm_source=generator"
                width="100%"
                height="152"
                loading="lazy"
                style={{ border: 0, borderRadius: "16px" }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
              <a
                href="https://www.youtube.com/@harmonics_vd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-card-border bg-card px-6 py-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary/60"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-primary"
                  fill="currentColor"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6Z" />
                </svg>
                Watch originals on YouTube
              </a>
            </div>
          </div>

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
                  <span className="font-semibold text-foreground">
                    {p.name}
                  </span>
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
          <Link
            href={LISTEN_GUIDE_URL}
            className="w-full rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Discover as a listener
          </Link>
          <a
            href={ARTIST_URL}
            className="w-full rounded-full border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground shadow-sm transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Discover as an Artist
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
