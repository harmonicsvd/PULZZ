import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SongsPage from "@/pages/songs";
import SubmitSongPage from "@/pages/submit-song";
import SongDetailPage from "@/pages/song-detail";
import WallPage from "@/pages/wall";
import ArtistsPage from "@/pages/artists";
import SettingsPage from "@/pages/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/songs/new" component={SubmitSongPage} />
      <Route path="/songs/:id">
        {(params) => <SongDetailPage id={params.id} />}
      </Route>
      <Route path="/songs" component={SongsPage} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/wall" component={WallPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
