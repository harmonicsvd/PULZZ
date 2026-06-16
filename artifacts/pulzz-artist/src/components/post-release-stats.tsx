import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Pencil,
  Save,
  X,
  ListMusic,
  Radio,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  useGetSongSongstats,
  getGetSongSongstatsQueryKey,
  useUpdateSongStreamingId,
  getGetSongQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Props {
  songId: number;
  streamingId?: string | null;
}

const SOURCE_LABELS: Record<string, string> = {
  spotify: "Spotify",
  apple_music: "Apple Music",
  amazon: "Amazon Music",
  amazon_music: "Amazon Music",
  deezer: "Deezer",
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  shazam: "Shazam",
  soundcloud: "SoundCloud",
  beatport: "Beatport",
  tidal: "Tidal",
  itunes: "iTunes",
};

function sourceLabel(source: string): string {
  return (
    SOURCE_LABELS[source] ??
    source
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

interface MetricRow {
  source: string;
  primaryLabel: string;
  primaryValue: number | null;
  reach: number | null;
  charts: number | null;
}

function sourceMetric(s: {
  source: string;
  streamsTotal: number | null;
  playsTotal: number | null;
  viewsTotal: number | null;
  videosTotal: number | null;
  shazamsTotal: number | null;
  playlistReachTotal: number | null;
  chartsTotal: number | null;
}): MetricRow {
  let primaryLabel = "Plays";
  let primaryValue: number | null = null;
  if (s.streamsTotal !== null) {
    primaryLabel = "Streams";
    primaryValue = s.streamsTotal;
  } else if (s.viewsTotal !== null) {
    primaryLabel = "Views";
    primaryValue = s.viewsTotal;
  } else if (s.playsTotal !== null) {
    primaryLabel = "Plays";
    primaryValue = s.playsTotal;
  } else if (s.videosTotal !== null) {
    primaryLabel = "Videos";
    primaryValue = s.videosTotal;
  } else if (s.shazamsTotal !== null) {
    primaryLabel = "Shazams";
    primaryValue = s.shazamsTotal;
  }
  return {
    source: s.source,
    primaryLabel,
    primaryValue,
    reach: s.playlistReachTotal,
    charts: s.chartsTotal,
  };
}

export function PostReleaseStats({ songId, streamingId }: Props) {
  const queryClient = useQueryClient();
  const saveMutation = useUpdateSongStreamingId();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(streamingId ?? "");

  const { data, isLoading } = useGetSongSongstats(songId, {
    query: {
      enabled: !!songId,
      queryKey: getGetSongSongstatsQueryKey(songId),
    },
  });

  function startEdit() {
    setValue(streamingId ?? "");
    setEditing(true);
  }

  function save() {
    saveMutation.mutate(
      { id: songId, data: { streamingId: value.trim() } },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: getGetSongQueryKey(songId),
          });
          void queryClient.invalidateQueries({
            queryKey: getGetSongSongstatsQueryKey(songId),
          });
          toast({
            title: "Saved",
            description: value.trim()
              ? "Streaming identifier attached. Stats will appear once available."
              : "Streaming identifier removed.",
          });
          setEditing(false);
        },
        onError: () => {
          toast({
            title: "Couldn't save",
            description: "Something went wrong saving the identifier.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const metrics = data?.sources.map(sourceMetric) ?? [];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Post-Release Stats</CardTitle>
          <BarChart3 className="w-4 h-4 text-primary" />
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startEdit}
            className="gap-1.5 text-muted-foreground"
          >
            <Pencil className="w-3.5 h-3.5" />
            {streamingId ? "Edit link" : "Attach link"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {editing && (
          <div className="space-y-2 rounded-lg border border-border bg-background/50 p-4">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Released-track identifier
            </label>
            <p className="text-xs text-muted-foreground">
              Paste the song's ISRC or its Spotify track link once it's released
              — we'll pull real streaming numbers from Songstats.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="ISRC (e.g. USRC17607839) or https://open.spotify.com/track/…"
                className="h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={save}
                disabled={saveMutation.isPending}
                size="sm"
                className="gap-1.5"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? "Saving…" : "Save"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
                disabled={saveMutation.isPending}
                className="gap-1.5 text-muted-foreground"
              >
                <X className="w-4 h-4" /> Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : data?.available ? (
          <>
            {data.trackInfo?.releaseDate && (
              <p className="text-xs text-muted-foreground">
                Released {data.trackInfo.releaseDate} · source: Songstats
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile
                icon={<TrendingUp className="w-4 h-4 text-chart-3" />}
                label="Total Streams"
                value={formatNumber(data.streamsTotal)}
              />
              <StatTile
                icon={<ListMusic className="w-4 h-4 text-primary" />}
                label="Playlist Reach"
                value={formatNumber(data.playlistReachTotal)}
              />
              <StatTile
                icon={<ListMusic className="w-4 h-4 text-chart-4" />}
                label="Playlists"
                value={formatNumber(data.playlistsTotal)}
              />
              <StatTile
                icon={<Radio className="w-4 h-4 text-chart-2" />}
                label="Chart Entries"
                value={formatNumber(data.chartsTotal)}
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                By Platform
              </div>
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {metrics.map((m) => (
                  <div
                    key={m.source}
                    className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
                  >
                    <span className="font-medium">{sourceLabel(m.source)}</span>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {m.primaryValue !== null && (
                        <span>
                          <span className="font-semibold text-foreground">
                            {formatNumber(m.primaryValue)}
                          </span>{" "}
                          {m.primaryLabel.toLowerCase()}
                        </span>
                      )}
                      {m.reach !== null && (
                        <span className="hidden sm:inline">
                          {formatNumber(m.reach)} reach
                        </span>
                      )}
                      {m.charts !== null && m.charts > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {m.charts} chart{m.charts !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <PreReleaseState status={data?.status} hasIdentifier={!!streamingId} />
        )}
      </CardContent>
    </Card>
  );
}

function StatTile({
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
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function PreReleaseState({
  status,
  hasIdentifier,
}: {
  status?: string;
  hasIdentifier: boolean;
}) {
  let message: string;
  if (status === "unconfigured") {
    message =
      "Post-release stats are powered by Songstats. Once a Songstats API key is configured, real streaming numbers will appear here.";
  } else if (status === "not_found" && hasIdentifier) {
    message =
      "No streaming data yet for this identifier. Songstats picks up new releases over the first days after they go live — check back soon.";
  } else if (status === "error") {
    message =
      "Couldn't reach Songstats just now. This is temporary — the live discovery numbers above are unaffected.";
  } else {
    message =
      "This song is still pre-release. Once it's out, attach its ISRC or Spotify link and real streaming, playlist, and chart numbers will show up here.";
  }

  return (
    <div className="rounded-lg border border-dashed border-border bg-background/30 px-4 py-8 text-center">
      <BarChart3 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        {message}
      </p>
    </div>
  );
}
