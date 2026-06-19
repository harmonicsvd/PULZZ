import { Wordmark } from "@/components/Wordmark";

/**
 * The full Pulzz brand lockup — the cube mark (coral rounded square with a
 * white dot) followed by the two-tone Wordmark. Matches the artist dashboard
 * sidebar so the brand reads the same everywhere.
 */
export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-background" />
      </span>
      <Wordmark className={className} />
    </span>
  );
}
