import { AppLayout } from "@/components/layout/app-layout";
import {
  useGetSong,
  useGetSongReactions,
  useGetSongMoments,
  getGetSongQueryKey,
  getGetSongReactionsQueryKey,
  getGetSongMomentsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LyricSyncTool } from "@/components/lyric-sync-tool";
import {
  Loader2,
  ArrowLeft,
  Play,
  SkipForward,
  Users,
  Zap,
  Clock,
} from "lucide-react";
import { Link } from "wouter";

interface Props {
  id: string;
}

export default function SongDetailPage({ id }: Props) {
  const songId = parseInt(id);
  const { data: song, isLoading } = useGetSong(songId, {
    query: { enabled: !!songId, queryKey: getGetSongQueryKey(songId) },
  });
  const { data: reactions } = useGetSongReactions(songId, {
    query: { enabled: !!songId, queryKey: getGetSongReactionsQueryKey(songId) },
  });
  const { data: moments } = useGetSongMoments(songId, {
    query: { enabled: !!songId, queryKey: getGetSongMomentsQueryKey(songId) },
  });

  const discoveredPct = reactions
    ? reactions.totalListeners > 0
      ? Math.round((reactions.discoveredCount / reactions.totalListeners) * 100)
      : 0
    : 0;

  function formatMs(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <header className="flex items-center gap-3">
          <Link href="/songs">
            <div className="w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>
          {song && (
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0"
                style={{ backgroundColor: song.coverColor }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {song.title}
                  </h1>
                  <Badge variant="secondary">
                    {song.status === "active" ? "Active" : "Released"}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {song.artistName} · {song.genre}
                </p>
              </div>
            </div>
          )}
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : song ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Listeners
                  </CardTitle>
                  <Users className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reactions?.totalListeners ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Discovered
                  </CardTitle>
                  <Play className="w-4 h-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3">
                    {reactions?.discoveredCount ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Skipped
                  </CardTitle>
                  <SkipForward className="w-4 h-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-2">
                    {reactions?.skipCount ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Moments
                  </CardTitle>
                  <Zap className="w-4 h-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {song.momentCount ?? moments?.length ?? 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {reactions && reactions.totalListeners > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Reaction Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-20">
                      Discovered
                    </span>
                    <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-chart-3 rounded-full transition-all"
                        style={{ width: `${discoveredPct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right text-chart-3">
                      {discoveredPct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-20">
                      Skipped
                    </span>
                    <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-chart-2 rounded-full transition-all"
                        style={{ width: `${100 - discoveredPct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right text-chart-2">
                      {100 - discoveredPct}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {reactions?.topMoments && reactions.topMoments.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Top Moments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reactions.topMoments.slice(0, 8).map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3"
                      >
                        <div className="flex items-center gap-1.5 text-muted-foreground w-16">
                          <Clock className="w-3 h-3" />
                          <span className="text-sm font-mono">
                            {formatMs(m.timestampMs)}
                          </span>
                        </div>
                        <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${Math.min(100, (m.count / (reactions.topMoments[0]?.count || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {m.count} mark{m.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Artist Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {song.story}
                  </p>
                </CardContent>
              </Card>

              {song.lyrics && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Lyrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                      {song.lyrics}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>

            <LyricSyncTool
              songId={songId}
              audioUrl={song.audioUrl}
              lyrics={song.lyrics}
              lrc={song.lrc}
            />

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Song Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground mb-1">Release Date</dt>
                    <dd className="font-medium">{song.releaseDate}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Days Left</dt>
                    <dd className="font-medium">
                      {song.daysUntilRelease === 0
                        ? "Released"
                        : `${song.daysUntilRelease} days`}
                    </dd>
                  </div>
                  {song.isrc && (
                    <div>
                      <dt className="text-muted-foreground mb-1">ISRC</dt>
                      <dd className="font-medium font-mono">{song.isrc}</dd>
                    </div>
                  )}
                  {song.durationSeconds && (
                    <div>
                      <dt className="text-muted-foreground mb-1">Duration</dt>
                      <dd className="font-medium">{formatMs(song.durationSeconds * 1000)}</dd>
                    </div>
                  )}
                  {song.tags && song.tags.length > 0 && (
                    <div className="col-span-2">
                      <dt className="text-muted-foreground mb-1">Tags</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {song.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Song not found
          </div>
        )}
      </div>
    </AppLayout>
  );
}
