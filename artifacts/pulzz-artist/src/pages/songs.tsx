import { AppLayout } from "@/components/layout/app-layout";
import { useGetArtistSongs, getGetArtistSongsQueryKey } from "@workspace/api-client-react";
import { useCurrentArtist } from "@/lib/current-artist";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, ChevronRight, Music, Plus } from "lucide-react";
import { Link } from "wouter";

export default function SongsPage() {
  const artist = useCurrentArtist();
  const { data: songs, isLoading } = useGetArtistSongs(artist.id, {
    query: {
      enabled: true,
      queryKey: getGetArtistSongsQueryKey(artist.id),
    },
  });

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discovery Pool</h1>
            <p className="text-muted-foreground mt-1">
              Songs currently in listener discovery rotation.
            </p>
          </div>
          <Link href="/songs/new">
            <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-md text-sm font-semibold transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
              Submit Song
            </div>
          </Link>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : songs && songs.length > 0 ? (
          <div className="grid gap-3">
            {songs.map((song) => (
              <Link key={song.id} href={`/songs/${song.id}`}>
                <Card className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: song.coverColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate min-w-0 flex-1">
                            {song.title}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium flex-shrink-0"
                          >
                            {song.status === "active" ? "Live" : "Released"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5 truncate">
                          {song.artistName} · {song.genre}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {song.tags &&
                            song.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm sm:hidden">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {song.daysUntilRelease === 0
                                ? "Released"
                                : `${song.daysUntilRelease}d left`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {(song.discoveredCount ?? 0) +
                                (song.skipCount ?? 0)}
                            </span>
                            <span>reactions</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-8 text-sm mr-2">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {song.daysUntilRelease === 0
                              ? "Released"
                              : `${song.daysUntilRelease}d left`}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            Reactions
                          </div>
                          <div className="font-semibold text-foreground">
                            {(song.discoveredCount ?? 0) +
                              (song.skipCount ?? 0)}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1 sm:mt-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Music className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No songs yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Submit your first song to start getting discovered.
              </p>
            </div>
            <Link href="/songs/new">
              <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-md text-sm font-semibold transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
                Submit Song
              </div>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
