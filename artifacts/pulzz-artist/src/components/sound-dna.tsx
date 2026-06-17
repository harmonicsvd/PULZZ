import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, Loader2, Sparkles, Gauge, Music2, Activity } from "lucide-react";
import {
  useGetSongSoundAnalysis,
  getGetSongSoundAnalysisQueryKey,
  useAnalyzeSong,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Props {
  songId: number;
}

function humanize(raw: string): string {
  const spaced = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function topEntries(
  dist: Record<string, number> | undefined,
  n: number
): Array<[string, number]> {
  if (!dist) return [];
  return Object.entries(dist)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

export function SoundDna({ songId }: Props) {
  const queryClient = useQueryClient();
  const analyzeMutation = useAnalyzeSong();

  const { data, isLoading } = useGetSongSoundAnalysis(songId, {
    query: {
      enabled: !!songId,
      queryKey: getGetSongSoundAnalysisQueryKey(songId),
      // Poll while Cyanite is still crunching the track.
      refetchInterval: (query) =>
        query.state.data?.status === "processing" ? 6000 : false,
    },
  });

  function runAnalysis() {
    analyzeMutation.mutate(
      { id: songId },
      {
        onSuccess: (res) => {
          if (res.status === "unconfigured") {
            toast({
              title: "Not configured",
              description:
                "Sound analysis needs a Cyanite API key to be configured.",
              variant: "destructive",
            });
            return;
          }
          void queryClient.invalidateQueries({
            queryKey: getGetSongSoundAnalysisQueryKey(songId),
          });
          toast({
            title: "Analyzing",
            description:
              "We're analyzing this track's sound — results appear here in a minute or so.",
          });
        },
        onError: () => {
          toast({
            title: "Couldn't start analysis",
            description: "Something went wrong starting the sound analysis.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const status = data?.status;
  const analysis = data?.analysis ?? null;
  const topGenres = topEntries(analysis?.genre, 4);
  const topMoods = topEntries(analysis?.mood, 4);
  // Very old/noisy archival recordings yield little for a model trained on
  // modern audio — surface that honestly instead of looking broken.
  const sparse =
    !!analysis &&
    analysis.genreTags.length === 0 &&
    analysis.moodTags.length === 0 &&
    analysis.bpm === null &&
    !analysis.caption;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Sound DNA</CardTitle>
          <Waves className="w-4 h-4 text-primary" />
        </div>
        {!isLoading &&
          status !== "processing" &&
          status !== "finished" &&
          status !== "unconfigured" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runAnalysis}
              disabled={analyzeMutation.isPending}
              className="gap-1.5 text-muted-foreground"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {analyzeMutation.isPending ? "Starting…" : "Analyze sound"}
            </Button>
          )}
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : status === "finished" && analysis ? (
          <>
            {sparse && (
              <p className="text-xs text-muted-foreground leading-relaxed rounded-md border border-dashed border-border bg-background/30 px-3 py-2">
                This is a low-fidelity archival recording, so Cyanite found
                limited tonal signal. Modern, full-quality uploads return a much
                richer profile.
              </p>
            )}
            {analysis.caption && (
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                “{analysis.caption}”
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Tile
                icon={<Gauge className="w-4 h-4 text-chart-3" />}
                label="Tempo"
                value={analysis.bpm != null ? `${analysis.bpm} BPM` : "—"}
              />
              <Tile
                icon={<Music2 className="w-4 h-4 text-primary" />}
                label="Key"
                value={
                  analysis.musicalKey ? humanize(analysis.musicalKey) : "—"
                }
              />
              <Tile
                icon={<Activity className="w-4 h-4 text-chart-4" />}
                label="Energy"
                value={
                  analysis.energyLevel ? humanize(analysis.energyLevel) : "—"
                }
              />
              <Tile
                icon={<Activity className="w-4 h-4 text-chart-2" />}
                label="Dynamics"
                value={
                  analysis.energyDynamics
                    ? humanize(analysis.energyDynamics)
                    : "—"
                }
              />
            </div>

            {(analysis.valence != null || analysis.arousal != null) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.valence != null && (
                  <Meter
                    label="Positivity"
                    hint="sad → happy"
                    value={analysis.valence}
                  />
                )}
                {analysis.arousal != null && (
                  <Meter
                    label="Intensity"
                    hint="calm → intense"
                    value={analysis.arousal}
                  />
                )}
              </div>
            )}

            {analysis.genreTags.length > 0 && (
              <TagRow label="Genre" tags={analysis.genreTags} />
            )}
            {analysis.moodTags.length > 0 && (
              <TagRow label="Mood" tags={analysis.moodTags} />
            )}

            {(topGenres.length > 0 || topMoods.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {topGenres.length > 0 && (
                  <DistList title="Top Genres" entries={topGenres} />
                )}
                {topMoods.length > 0 && (
                  <DistList title="Top Moods" entries={topMoods} />
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Sound analysis by Cyanite · {analysis.era ? `${humanize(analysis.era)} · ` : ""}
              {new Date(analysis.analyzedAt).toLocaleDateString()}
            </p>
          </>
        ) : (
          <EmptyState status={status} processing={status === "processing"} />
        )}
      </CardContent>
    </Card>
  );
}

function Tile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function Meter({
  label,
  hint,
  value,
}: {
  label: string;
  hint: string;
  value: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      <div className="bg-secondary rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TagRow({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Badge key={t} variant="secondary">
            {humanize(t)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function DistList({
  title,
  entries,
}: {
  title: string;
  entries: Array<[string, number]>;
}) {
  const max = entries[0]?.[1] || 1;
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="space-y-2">
        {entries.map(([name, val]) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-sm w-28 truncate">{humanize(name)}</span>
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, (val / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  status,
  processing,
}: {
  status?: string;
  processing: boolean;
}) {
  if (processing) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background/30 px-4 py-8 text-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Analyzing this track's sound with Cyanite — genre, mood, tempo, key and
          energy will appear here in a minute or so.
        </p>
      </div>
    );
  }

  let message: string;
  if (status === "unconfigured") {
    message =
      "Sound analysis is powered by Cyanite. Once a Cyanite API key is configured, this track's sonic profile will appear here.";
  } else if (status === "failed") {
    message =
      "Cyanite couldn't analyze this track. Try running the analysis again.";
  } else if (status === "error" || status === "not_found") {
    message =
      "We couldn't reach the sound analysis just now. Try running it again in a moment.";
  } else {
    message =
      "Analyze this track's sound to reveal its genre, mood, tempo, key and energy — powered by Cyanite.";
  }

  return (
    <div className="rounded-lg border border-dashed border-border bg-background/30 px-4 py-8 text-center">
      <Waves className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        {message}
      </p>
    </div>
  );
}
