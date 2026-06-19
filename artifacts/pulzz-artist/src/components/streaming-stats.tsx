import {
  useGetArtistSongstats,
  getGetArtistSongstatsQueryKey,
  type ArtistSongstats,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3,
  ListMusic,
  Radio,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { demoArtistStreamingStats } from "@/lib/artist-meta";

interface Props {
  artistId: number;
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
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export function StreamingStats({ artistId }: Props) {
  const { data, isLoading } = useGetArtistSongstats(artistId, {
    query: {
      enabled: !!artistId,
      queryKey: getGetArtistSongstatsQueryKey(artistId),
    },
  });

  const liveSongs = data?.songs.filter((s) => s.available) ?? [];
  const hasLiveData = data?.status === "ok" && liveSongs.length > 0;

  const [tab, setTab] = useState<string | undefined>(undefined);
  const activeTab = tab ?? (hasLiveData ? "songs" : "artist");

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Streaming Stats</CardTitle>
          <BarChart3 className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground">
          {activeTab === "songs" ? "Powered by Songstats" : "Showcase demo data"}
        </span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setTab}>
            <TabsList className="mb-5">
              <TabsTrigger value="songs">Your songs</TabsTrigger>
              <TabsTrigger value="artist">Artist overall</TabsTrigger>
            </TabsList>

            <TabsContent value="songs" className="space-y-5">
              <SongsView data={data} liveSongs={liveSongs} />
            </TabsContent>

            <TabsContent value="artist" className="space-y-5">
              <ArtistOverallView artistId={artistId} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

function SongsView({
  data,
  liveSongs,
}: {
  data: ArtistSongstats | undefined;
  liveSongs: ArtistSongstats["songs"];
}) {
  if (!data || data.status !== "ok") {
    return <EmptyState status={data?.status} configured={data?.configured} />;
  }

  return (
    <>
      <p className="text-xs text-muted-foreground">
        Live across {data.songsWithStats} released song
        {data.songsWithStats !== 1 ? "s" : ""} · real numbers from Songstats
      </p>

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

      {data.platforms.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            By Platform
          </div>
          <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {data.platforms.map((p) => (
              <div
                key={p.source}
                className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
              >
                <span className="font-medium">{sourceLabel(p.source)}</span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  {p.streamsTotal != null && (
                    <span>
                      <span className="font-semibold text-foreground">
                        {formatNumber(p.streamsTotal)}
                      </span>{" "}
                      streams
                    </span>
                  )}
                  {p.playlistReachTotal != null && (
                    <span className="hidden sm:inline">
                      {formatNumber(p.playlistReachTotal)} reach
                    </span>
                  )}
                  {p.chartsTotal != null && p.chartsTotal > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {p.chartsTotal} chart
                      {p.chartsTotal !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {liveSongs.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            By Song
          </div>
          <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {liveSongs.map((s) => (
              <Link key={s.id} href={`/songs/${s.id}`}>
                <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-7 h-7 rounded-md flex-shrink-0"
                      style={{ backgroundColor: s.coverColor ?? "#FF5C49" }}
                    />
                    <span className="font-medium truncate">{s.title}</span>
                  </div>
                  <span className="text-muted-foreground flex-shrink-0">
                    <span className="font-semibold text-foreground">
                      {formatNumber(s.streamsTotal)}
                    </span>{" "}
                    streams
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ArtistOverallView({ artistId }: { artistId: number }) {
  const stats = demoArtistStreamingStats(artistId);

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted-foreground">
          Your whole catalogue across every platform.
        </p>
        <Badge variant="outline" className="text-xs">
          Demo figures
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          icon={<TrendingUp className="w-4 h-4 text-chart-3" />}
          label="Total Streams"
          value={formatNumber(stats.totals.streams)}
        />
        <StatTile
          icon={<Users className="w-4 h-4 text-primary" />}
          label="Audience"
          value={formatNumber(stats.totals.audience)}
        />
        <StatTile
          icon={<ListMusic className="w-4 h-4 text-chart-4" />}
          label="Playlist Reach"
          value={formatNumber(stats.totals.playlistReach)}
        />
        <StatTile
          icon={<Radio className="w-4 h-4 text-chart-2" />}
          label="Chart Entries"
          value={formatNumber(stats.totals.charts)}
        />
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          By Platform
        </div>
        <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
          {stats.platforms.map((p) => (
            <div
              key={p.key}
              className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
            >
              <span className="font-medium">{p.label}</span>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">
                    {formatNumber(p.streams)}
                  </span>{" "}
                  streams
                </span>
                <span className="hidden sm:inline">
                  {formatNumber(p.audience)} {p.metric}
                </span>
                {p.charts > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {p.charts} chart{p.charts !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
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

function EmptyState({
  status,
  configured,
}: {
  status?: string;
  configured?: boolean;
}) {
  let message: string;
  if (status === "no_songs") {
    message =
      "Submit a song and mark it released — once it's live, real streaming, playlist, and chart numbers from Songstats will appear here.";
  } else if (status === "unconfigured" || configured === false) {
    message =
      "Streaming stats are powered by Songstats. Once a Songstats API key is configured, real cross-platform numbers will appear here.";
  } else {
    message =
      "No streaming data yet. Your songs are still pre-release — attach each released song's ISRC or Spotify link and Songstats numbers will show up here automatically.";
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
