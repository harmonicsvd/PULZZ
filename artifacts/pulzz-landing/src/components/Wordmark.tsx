/**
 * The Pulzz wordmark — navy "Pul" + coral "zz". Shared across the landing
 * page and the listener install guide so the brand name always renders in the
 * correct format (never plain text).
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      Pul<span className="text-primary">zz</span>
    </span>
  );
}
