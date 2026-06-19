import { AppLayout } from "@/components/layout/app-layout";
import { useGetWall, getGetWallQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Star, Zap } from "lucide-react";

const ARTIST_ID = 1;

export default function WallPage() {
  const { data: entries, isLoading } = useGetWall(
    { artistId: ARTIST_ID },
    {
      query: {
        enabled: true,
        queryKey: getGetWallQueryKey({ artistId: ARTIST_ID }),
      },
    }
  );

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Discovery Wall</h1>
          <p className="text-muted-foreground mt-1">
            Top listeners who discovered your songs in the pool this week.
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : entries && entries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {entries.slice(0, 3).map((entry) => (
                <Card
                  key={entry.listenerId}
                  className={`bg-card border-border relative overflow-hidden ${
                    entry.rank === 1 ? "ring-1 ring-primary/40" : ""
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background:
                        entry.rank === 1
                          ? "linear-gradient(135deg, #FF5C49, transparent)"
                          : entry.rank === 2
                          ? "linear-gradient(135deg, #3E5C99, transparent)"
                          : "linear-gradient(135deg, #E8956B, transparent)",
                    }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl font-black text-muted-foreground/30">
                        #{entry.rank}
                      </div>
                      {entry.badges && entry.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.badges.map((b) => (
                            <Badge
                              key={b}
                              variant="secondary"
                              className="text-xs"
                            >
                              {b}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold">{entry.listenerName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-primary" />
                        <span className="font-semibold">{entry.discoveryCount}</span>
                        <span className="text-muted-foreground">discovered</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-chart-4" />
                        <span className="font-semibold">{entry.points.toLocaleString()}</span>
                        <span className="text-muted-foreground">pts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {entries.length > 3 && (
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {entries.slice(3).map((entry) => (
                      <div
                        key={entry.listenerId}
                        className="flex items-center gap-4 px-4 py-3"
                      >
                        <span className="w-8 text-muted-foreground text-sm font-semibold text-right">
                          #{entry.rank}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium">
                            {entry.listenerName}
                          </span>
                          {entry.badges && entry.badges.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              {entry.badges.map((b) => (
                                <Badge
                                  key={b}
                                  variant="secondary"
                                  className="text-xs py-0"
                                >
                                  {b}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {entry.discoveryCount}
                            </span>{" "}
                            found
                          </span>
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-primary">
                              {entry.points.toLocaleString()}
                            </span>{" "}
                            pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Star className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No listeners yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Listeners will appear here as they discover songs in the pool.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
