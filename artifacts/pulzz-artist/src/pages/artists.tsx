import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  useListArtists,
  getListArtistsQueryKey,
  type Artist,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Sparkles,
  Loader2,
  Globe,
  Music2,
  Instagram,
  Youtube,
  Mail,
  Handshake,
  Copy,
  Check,
} from "lucide-react";

const CURRENT_ARTIST_ID = 1;

const ROLE_LABELS: Record<string, string> = {
  singer: "Singer",
  lyricist: "Lyricist",
  composer: "Composer",
  producer: "Producer",
  instrumentalist: "Instrumentalist",
  mixEngineer: "Mix Engineer",
  masteringEngineer: "Mastering Engineer",
};

const ALL_ROLES = Object.keys(ROLE_LABELS);

function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

const LINK_META: { key: string; label: string; icon: typeof Globe }[] = [
  { key: "website", label: "Website", icon: Globe },
  { key: "spotify", label: "Spotify", icon: Music2 },
  { key: "soundcloud", label: "SoundCloud", icon: Music2 },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "youtube", label: "YouTube", icon: Youtube },
];

/** Only allow http(s) links to be rendered as hrefs (defends against javascript:/data: URLs). */
function safeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url.trim()) ? url : undefined;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Cosine similarity (0..1) over two equal-length, non-negative vectors. */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return Math.max(0, Math.min(1, dot / (Math.sqrt(na) * Math.sqrt(nb))));
}

/**
 * How sonically alike two artists are (0..1), from their Cyanite sound
 * profiles. Null when either artist has no analyzable catalog, so the UI can
 * fall back to role-only matching rather than show a misleading number.
 */
function soundSimilarity(me: Artist, other: Artist): number | null {
  const a = me.soundProfile?.vector;
  const b = other.soundProfile?.vector;
  if (!a || !b) return null;
  return cosineSimilarity(a, b);
}

/**
 * Score how well `other` complements `me` for a collaboration:
 *  - +2 for each role the other artist offers that I don't have (fills a gap)
 *  - +1 if we share a genre (a creative starting point)
 *  - up to +3 layered on for how similar their music sounds (Cyanite), when
 *    both artists have an analyzed catalog
 */
function matchScore(me: Artist, other: Artist): number {
  const myRoles = new Set(me.roles ?? []);
  const otherRoles = other.roles ?? [];
  let score = 0;
  for (const r of otherRoles) {
    if (!myRoles.has(r)) score += 2;
  }
  if (me.genre && other.genre && me.genre === other.genre) score += 1;
  const sound = soundSimilarity(me, other);
  if (sound !== null) score += sound * 3;
  return score;
}

function complementaryRoles(me: Artist, other: Artist): string[] {
  const myRoles = new Set(me.roles ?? []);
  return (other.roles ?? []).filter((r) => !myRoles.has(r));
}

export default function ArtistsPage() {
  const { data: artists, isLoading } = useListArtists({
    query: { enabled: true, queryKey: getListArtistsQueryKey() },
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [contactArtist, setContactArtist] = useState<Artist | null>(null);

  const me = useMemo(
    () => artists?.find((a) => a.id === CURRENT_ARTIST_ID) ?? null,
    [artists]
  );

  const others = useMemo(
    () => (artists ?? []).filter((a) => a.id !== CURRENT_ARTIST_ID),
    [artists]
  );

  const suggestions = useMemo(() => {
    if (!me) return [];
    return others
      .map((a) => ({
        artist: a,
        score: matchScore(me, a),
        fills: complementaryRoles(me, a),
        sound: soundSimilarity(me, a),
      }))
      // Require at least one complementary role — genre is only a tiebreaker.
      .filter((s) => s.fills.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [me, others]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return others.filter((a) => {
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.genre ?? "").toLowerCase().includes(q) ||
        (a.bio ?? "").toLowerCase().includes(q);
      const matchesRole = !roleFilter || (a.roles ?? []).includes(roleFilter);
      return matchesSearch && matchesRole;
    });
  }, [others, search, roleFilter]);

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Collaborate</h1>
          <p className="text-muted-foreground mt-1">
            Find artists whose skills complement yours and start making music together.
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !artists ? (
          <div className="p-8 text-center text-muted-foreground">
            Failed to load artists.
          </div>
        ) : (
          <>
            {/* Suggested collaborators */}
            {suggestions.length > 0 && me && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold tracking-tight">
                    Suggested collaborators
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground -mt-2">
                  Matched to fill the gaps around your roles
                  {me.roles && me.roles.length > 0
                    ? ` (${me.roles.map(roleLabel).join(", ")})`
                    : ""}
                  .
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestions.map(({ artist, fills, sound }) => {
                    return (
                      <Card
                        key={artist.id}
                        className="bg-card border-border ring-1 ring-primary/20"
                      >
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                              {initials(artist.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold truncate">
                                {artist.name}
                              </div>
                              {artist.genre && (
                                <div className="text-xs text-muted-foreground">
                                  {artist.genre}
                                </div>
                              )}
                            </div>
                          </div>
                          {fills.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Brings:{" "}
                              <span className="text-foreground font-medium">
                                {fills.map(roleLabel).join(", ")}
                              </span>
                            </div>
                          )}
                          {sound !== null && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium"
                            >
                              Sounds {Math.round(sound * 100)}% alike
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => setContactArtist(artist)}
                          >
                            <Handshake className="w-4 h-4 mr-1.5" />
                            Request collaboration
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Directory */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">All artists</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, genre, or bio…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setRoleFilter(null)}
                  className={
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors " +
                    (roleFilter === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground")
                  }
                >
                  All roles
                </button>
                {ALL_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() =>
                      setRoleFilter(roleFilter === role ? null : role)
                    }
                    className={
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors " +
                      (roleFilter === role
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground")
                    }
                  >
                    {roleLabel(role)}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border border-border rounded-lg">
                  No artists match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((artist) => (
                    <Card key={artist.id} className="bg-card border-border">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold flex-shrink-0">
                            {initials(artist.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate">
                              {artist.name}
                            </div>
                            {artist.genre && (
                              <div className="text-xs text-muted-foreground">
                                {artist.genre}
                              </div>
                            )}
                          </div>
                        </div>

                        {artist.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {artist.bio}
                          </p>
                        )}

                        {artist.roles && artist.roles.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {artist.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="secondary"
                                className="text-xs font-normal"
                              >
                                {roleLabel(role)}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => setContactArtist(artist)}
                        >
                          <Handshake className="w-4 h-4 mr-1.5" />
                          Request collaboration
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <RequestCollaborationDialog
        artist={contactArtist}
        onClose={() => setContactArtist(null)}
      />
    </AppLayout>
  );
}

function RequestCollaborationDialog({
  artist,
  onClose,
}: {
  artist: Artist | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const links = (artist?.links ?? {}) as Record<string, string | undefined>;
  const availableLinks = LINK_META.map((l) => ({
    ...l,
    href: safeUrl(links[l.key]),
  })).filter((l): l is typeof l & { href: string } => !!l.href);

  function copyEmail() {
    if (!artist?.email) return;
    navigator.clipboard?.writeText(artist.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog
      open={!!artist}
      onOpenChange={(open) => {
        if (!open) {
          setCopied(false);
          onClose();
        }
      }}
    >
      <DialogContent>
        {artist && (
          <>
            <DialogHeader>
              <DialogTitle>Request collaboration</DialogTitle>
              <DialogDescription>
                Reach out to {artist.name} directly using their contact details
                and profile links below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1.5">
                  Email
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${artist.email}?subject=${encodeURIComponent(
                      "Collaboration on Pulzz"
                    )}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline truncate"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{artist.email}</span>
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto"
                    onClick={copyEmail}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {availableLinks.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">
                    Profile links
                  </div>
                  <div className="space-y-1.5">
                    {availableLinks.map(({ key, label, icon: Icon, href }) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline truncate"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={`mailto:${artist.email}?subject=${encodeURIComponent(
                  "Collaboration on Pulzz"
                )}&body=${encodeURIComponent(
                  `Hi ${artist.name},\n\nI found you on Pulzz and would love to collaborate. Here's a bit about what I'm working on:\n\n`
                )}`}
                className="block"
              >
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-1.5" />
                  Send collaboration email
                </Button>
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
