import { type ReactNode, useEffect, useState } from "react";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { Wordmark } from "@/components/Wordmark";

const LISTENER_PATH = "/pulzz-listener/";

type Step = { n: string; title: ReactNode; body: ReactNode };

const STEPS: Step[] = [
  {
    n: "01",
    title: "Point your phone camera at the code",
    body: "Open your phone's camera (or any QR scanner) and aim it at the code on the right. No app to install.",
  },
  {
    n: "02",
    title: "Tap the link that pops up",
    body: (
      <>
        Your phone shows a link — tap it and{" "}
        <Wordmark className="text-foreground" /> opens right in your browser. No
        scanner? Use the tappable link below the code.
      </>
    ),
  },
  {
    n: "03",
    title: (
      <>
        <Wordmark className="text-foreground" /> opens — start discovering
      </>
    ),
    body: "Pick your taste, then stream unreleased tracks and mark the moments you love before anyone else.",
  },
];

export default function ListenGuide() {
  const [listenerUrl, setListenerUrl] = useState(LISTENER_PATH);

  useEffect(() => {
    setListenerUrl(window.location.origin + LISTENER_PATH);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="transition-opacity hover:opacity-80"
            aria-label="Back to the Pulzz home page"
          >
            <Wordmark className="text-2xl" />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/60"
          >
            ← Back home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-16 text-center sm:pt-20">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              For Musicathon judges
            </span>
          </div>
          <h1
            className="animate-float-up mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            Open <Wordmark className="text-foreground" /> on your phone
          </h1>
          <p
            className="animate-float-up mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
            style={{ animationDelay: "0.12s" }}
          >
            <Wordmark className="text-foreground" /> is a mobile-first discovery
            app. Scan the code below to open it on your phone in seconds — no app
            store purchase, no sign-up.
          </p>
        </div>
      </section>

      {/* Guide */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
          {/* Steps */}
          <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Three quick steps
            </span>
            <div className="mt-6 space-y-6">
              {STEPS.map((s) => (
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

            <div className="mt-8 rounded-2xl border border-border bg-background p-5">
              <p className="text-sm font-semibold text-foreground">
                Optional: want the native-app feel?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                The browser is all you need. But{" "}
                <Wordmark className="text-foreground" /> is built with{" "}
                <span className="font-semibold text-foreground">Expo</span>, so if
                you&rsquo;d like to run it in Expo&rsquo;s free companion app, grab
                Expo Go below — then scan the same code from inside it.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://apps.apple.com/app/expo-go/id982107779"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/60"
                >
                  Expo Go · iPhone
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=host.exp.exponent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/60"
                >
                  Expo Go · Android
                </a>
              </div>
            </div>
          </div>

          {/* QR + links */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-card-border bg-card p-8 text-center shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Scan to open
            </span>
            <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
              <QRCodeSVG
                value={listenerUrl}
                size={196}
                level="M"
                marginSize={0}
                bgColor="#FFFFFF"
                fgColor="#1B2A4A"
              />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Point your phone camera here, or tap:
            </p>
            <a
              href={LISTENER_PATH}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Open the listener on this device →
            </a>
            <a
              href={LISTENER_PATH}
              className="mt-3 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Just taking a quick look? Open in this browser
            </a>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
          Built for Musicathon 2026 · The <Wordmark className="text-foreground" />{" "}
          listener runs free on any modern phone browser.
        </p>
      </section>
    </div>
  );
}
