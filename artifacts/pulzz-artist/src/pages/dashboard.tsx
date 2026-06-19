import { AppLayout } from "@/components/layout/app-layout";
import { useGetArtistDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, SkipForward, Users, Activity, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetArtistDashboard(1, { query: { enabled: true, queryKey: ["dashboard", 1] } });

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time performance across the discovery pool.</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : dashboard ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Listeners</CardTitle>
                  <Users className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboard.totalListeners.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Discovered</CardTitle>
                  <Play className="w-4 h-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboard.totalDiscovered.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Skipped</CardTitle>
                  <SkipForward className="w-4 h-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboard.totalSkipped.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Moment Marks</CardTitle>
                  <Activity className="w-4 h-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboard.totalMomentMarks.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {dashboard.recentSongs && dashboard.recentSongs.length > 0 ? (
                  <div className="divide-y divide-border">
                    {dashboard.recentSongs.map(song => (
                      <Link key={song.id} href={`/songs/${song.id}`}>
                        <div className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-md flex flex-shrink-0" style={{ backgroundColor: song.coverColor }} />
                            <div>
                              <div className="font-semibold">{song.title}</div>
                              <div className="text-sm text-muted-foreground">{song.status === "active" ? "In Discovery Pool" : "Released"} • {song.genre}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex flex-col items-end">
                              <span className="text-muted-foreground">Discovered</span>
                              <span className="font-semibold text-chart-3">{song.discoveredCount}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-muted-foreground">Skipped</span>
                              <span className="font-semibold text-chart-2">{song.skipCount}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No active songs. Submit a song to start tracking.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
           <div className="p-8 text-center text-muted-foreground">Failed to load dashboard.</div>
        )}
      </div>
    </AppLayout>
  );
}
