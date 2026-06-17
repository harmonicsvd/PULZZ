import { AppLayout } from "@/components/layout/app-layout";
import {
  useSubmitSong,
  useGetArtist,
  getGetArtistQueryKey,
  getGetArtistSongsQueryKey,
  getGetArtistDashboardQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { GENRES, DISTRIBUTORS, CREDIT_FIELDS } from "@/lib/artist-meta";

const ARTIST_ID = 1;

type Credits = {
  lyricist: string;
  composer: string;
  vocalist: string;
  mixEngineer: string;
  masteringEngineer: string;
  producer: string;
};

const EMPTY_CREDITS: Credits = {
  lyricist: "",
  composer: "",
  vocalist: "",
  mixEngineer: "",
  masteringEngineer: "",
  producer: "",
};

export default function SubmitSongPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { mutate: submitSong, isPending } = useSubmitSong();
  const { data: artist } = useGetArtist(ARTIST_ID, {
    query: { queryKey: getGetArtistQueryKey(ARTIST_ID) },
  });
  const [submitted, setSubmitted] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    releaseDate: "",
    releaseTime: "",
    distributor: "",
    streamingId: "",
    story: "",
    lyrics: "",
    language: "en",
    durationSeconds: "",
  });
  const [credits, setCredits] = useState<Credits>(EMPTY_CREDITS);

  // Pre-fill known values from the artist profile once it loads.
  useEffect(() => {
    if (artist && !prefilled) {
      setForm((prev) => ({
        ...prev,
        genre: prev.genre || artist.genre || "",
        distributor: prev.distributor || artist.distributor || "",
      }));
      setCredits((prev) => ({
        ...prev,
        vocalist: prev.vocalist || artist.name || "",
        composer: prev.composer || artist.name || "",
      }));
      setPrefilled(true);
    }
  }, [artist, prefilled]);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateCredit(key: keyof Credits, value: string) {
    setCredits((prev) => ({ ...prev, [key]: value }));
  }

  const canSubmit =
    form.title.trim() && form.genre && form.releaseDate && form.story.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const cleanedCredits: Record<string, string> = {};
    (Object.keys(credits) as (keyof Credits)[]).forEach((k) => {
      const v = credits[k].trim();
      if (v) cleanedCredits[k] = v;
    });

    submitSong(
      {
        data: {
          title: form.title.trim(),
          artistId: ARTIST_ID,
          genre: form.genre,
          releaseDate: form.releaseDate,
          releaseTime: form.releaseTime || undefined,
          distributor: form.distributor || undefined,
          isrc: "",
          streamingId: form.streamingId.trim() || undefined,
          story: form.story.trim(),
          lyrics: form.lyrics.trim() || undefined,
          credits:
            Object.keys(cleanedCredits).length > 0 ? cleanedCredits : undefined,
          language: form.language,
          durationSeconds: form.durationSeconds
            ? parseInt(form.durationSeconds)
            : undefined,
          instruments: [],
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetArtistSongsQueryKey(ARTIST_ID),
          });
          queryClient.invalidateQueries({
            queryKey: getGetArtistDashboardQueryKey(ARTIST_ID),
          });
          setSubmitted(true);
          setTimeout(() => navigate("/songs"), 1800);
        },
      }
    );
  }

  if (submitted) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Song submitted</h2>
          <p className="text-muted-foreground max-w-sm">
            Your song is now in the discovery pool. Listeners will start
            discovering it shortly.
          </p>
          <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <header className="flex items-center gap-3">
          <Link href="/songs">
            <div className="w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Submit Song</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Add a song to the discovery pool
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Track Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Song Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Midnight Bloom"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Genre *</Label>
                  <Select value={form.genre} onValueChange={(v) => update("genre", v)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g. 211"
                    value={form.durationSeconds}
                    onChange={(e) => update("durationSeconds", e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Release & Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                The date and time you scheduled on your distributor, so it goes
                live on Pulzz in sync with release day.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="releaseDate">Release Date *</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={form.releaseDate}
                    onChange={(e) => update("releaseDate", e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="releaseTime">Release Time</Label>
                  <Input
                    id="releaseTime"
                    type="time"
                    value={form.releaseTime}
                    onChange={(e) => update("releaseTime", e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Distributor</Label>
                <Select
                  value={form.distributor}
                  onValueChange={(v) => update("distributor", v)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select distributor" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRIBUTORS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="streamingId">Streaming Link / ISRC</Label>
                <Input
                  id="streamingId"
                  placeholder="ISRC or https://open.spotify.com/track/…"
                  value={form.streamingId}
                  onChange={(e) => update("streamingId", e.target.value)}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Optional — once released, this pulls real post-release stats
                  from Songstats into the song's dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Credits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Who made it. Pre-filled from your profile where we can.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {CREDIT_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label htmlFor={`credit-${field.key}`}>{field.label}</Label>
                    <Input
                      id={`credit-${field.key}`}
                      placeholder={field.label}
                      value={credits[field.key as keyof Credits]}
                      onChange={(e) =>
                        updateCredit(field.key as keyof Credits, e.target.value)
                      }
                      className="bg-background"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Artist Note & Lyrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="story">Artist Note *</Label>
                <Textarea
                  id="story"
                  placeholder="Tell listeners the story behind this song..."
                  value={form.story}
                  onChange={(e) => update("story", e.target.value)}
                  className="bg-background resize-none min-h-[100px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lyrics">Lyrics</Label>
                <Textarea
                  id="lyrics"
                  placeholder="Optional — add lyrics for the listen screen"
                  value={form.lyrics}
                  onChange={(e) => update("lyrics", e.target.value)}
                  className="bg-background resize-none min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <button
            type="submit"
            disabled={!canSubmit || isPending}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-md text-sm font-semibold transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit to Discovery Pool"
            )}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
