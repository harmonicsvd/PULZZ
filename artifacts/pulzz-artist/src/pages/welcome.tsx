import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSignIn } from "@clerk/react";
import { useCreateDemoSession } from "@workspace/api-client-react";
import {
  ArrowRight,
  BarChart3,
  Eye,
  Loader2,
  Music,
  Trophy,
  Users,
} from "lucide-react";
import { SUBMISSION_RULES } from "@/lib/artist-meta";

const features = [
  {
    icon: Music,
    title: "Submit your songs",
    body: "Add unreleased tracks to the discovery pool and let listeners find them first.",
  },
  {
    icon: BarChart3,
    title: "Track discovery",
    body: "Watch reactions and marked moments roll in with real-time analytics.",
  },
  {
    icon: Trophy,
    title: "See your wall",
    body: "Celebrate the listeners who discovered your music before release day.",
  },
  {
    icon: Users,
    title: "Find collaborators",
    body: "Match with artists whose skills complement yours and start making music together.",
  },
];

export default function Welcome() {
  const { signIn } = useSignIn();
  const [, setLocation] = useLocation();
  const createDemoSession = useCreateDemoSession();
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);

  // One-click demo: the backend mints a short-lived Clerk sign-in ticket for the
  // shared demo artist, then we exchange it via Clerk's `ticket` strategy. This
  // avoids passwords entirely so it works regardless of the instance's enabled
  // sign-in methods.
  async function handleDemo() {
    if (!signIn || demoLoading) return;
    setDemoError(null);
    setDemoLoading(true);
    try {
      const { ticket } = await createDemoSession.mutateAsync();

      const { error: createError } = await signIn.create({
        strategy: "ticket",
        ticket,
      });
      if (createError) {
        setDemoError("The demo isn't available right now. Please try again.");
        return;
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setDemoError("Couldn't open the demo. Please try again.");
        return;
      }
      setLocation("/dashboard");
    } catch {
      setDemoError("The demo isn't available right now. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        {/* Logo links back to the public landing page (separate artifact at
            the site root "/"). */}
        <a
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Back to Pulzz home"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-2.5 bg-background rounded-full" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight leading-none">
            PULZZ
          </span>
          <span className="text-muted-foreground font-medium text-xs tracking-[0.18em] uppercase mt-0.5">
            Artist
          </span>
        </a>
        <Link href="/sign-in">
          <div className="text-sm font-semibold px-4 py-2 rounded-md border border-border hover:bg-secondary transition-colors cursor-pointer">
            Sign In
          </div>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto w-full">
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-[1.05]">
          Your music, discovered before release day.
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-xl">
          The Pulzz Artist dashboard lets you submit unreleased songs, track how
          listeners react, and see who discovered you first.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/sign-up">
            <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-md text-sm font-semibold transition-colors cursor-pointer shadow-md">
              Get started
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
          <Link href="/sign-in">
            <div className="py-3 px-6 rounded-md text-sm font-semibold border border-border hover:bg-secondary transition-colors cursor-pointer">
              Sign in
            </div>
          </Link>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleDemo}
            disabled={!signIn || demoLoading}
            className="flex items-center gap-2 py-2.5 px-5 rounded-md text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {demoLoading ? "Opening demo…" : "View demo dashboard"}
          </button>
          <p className="text-xs text-muted-foreground">
            No sign-up needed — explore a sample artist's dashboard.
          </p>
          {demoError && (
            <p className="text-xs text-destructive">{demoError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 w-full text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
            </div>
          ))}
        </div>

        <section className="mt-16 w-full">
          <h2 className="font-display font-bold text-2xl tracking-tight text-center">
            Before you submit
          </h2>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-xl mx-auto">
            A few rules keep the Pulzz discovery pool fair and release-ready.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-left">
            {SUBMISSION_RULES.map((rule, i) => (
              <div
                key={rule.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mb-3">
                  {i + 1}
                </div>
                <p className="font-semibold text-sm">{rule.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{rule.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-muted-foreground">
        Pulzz — pre-release music discovery
      </footer>
    </div>
  );
}
