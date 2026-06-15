import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Crosshair,
  Save,
  Undo2,
  Check,
} from "lucide-react";
import {
  useUpdateSongLyrics,
  getGetSongQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Props {
  songId: number;
  audioUrl?: string | null;
  lyrics?: string | null;
  lrc?: string | null;
}

function formatStamp(ms: number) {
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
}

interface ParsedLrcLine {
  timeMs: number;
  text: string;
}

// Ordered parse — preserves duplicate lines (e.g. repeated choruses).
function parseLrcOrdered(lrc: string): ParsedLrcLine[] {
  const out: ParsedLrcLine[] = [];
  for (const raw of lrc.split(/\r?\n/)) {
    const m = raw.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
    if (!m) continue;
    const text = m[3].trim();
    if (!text) continue;
    out.push({ timeMs: (parseInt(m[1], 10) * 60 + parseFloat(m[2])) * 1000, text });
  }
  return out;
}

// Seed per-line timestamps from existing LRC, matching by occurrence order so
// repeated identical lines keep their distinct timestamps.
function seedFromLrc(lines: string[], lrc?: string | null): (number | null)[] {
  if (!lrc || !lrc.trim()) return lines.map(() => null);
  const queues = new Map<string, number[]>();
  for (const p of parseLrcOrdered(lrc)) {
    const q = queues.get(p.text) ?? [];
    q.push(p.timeMs);
    queues.set(p.text, q);
  }
  return lines.map((l) => {
    const t = l.trim();
    if (!t) return null;
    const q = queues.get(t);
    return q && q.length ? q.shift()! : null;
  });
}

// Plain text lines from existing LRC (timestamps stripped)
function lrcToLines(lrc: string): string {
  return lrc
    .split(/\r?\n/)
    .map((raw) => {
      const m = raw.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
      return m ? m[3].trim() : raw.trim();
    })
    .filter((l) => l !== "")
    .join("\n");
}

// Build the initial editable draft, preferring per-line LRC text, then
// normalizing single-line " / "-separated lyrics into one line each.
function initialDraft(lyrics?: string | null, lrc?: string | null): string {
  if (lrc && lrc.trim()) return lrcToLines(lrc);
  if (!lyrics) return "";
  if (!lyrics.includes("\n") && lyrics.includes(" / ")) {
    return lyrics
      .split(" / ")
      .map((l) => l.trim())
      .filter(Boolean)
      .join("\n");
  }
  return lyrics;
}

export function LyricSyncTool({ songId, audioUrl, lyrics, lrc }: Props) {
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const seed = initialDraft(lyrics, lrc);
  const seedStamps = seedFromLrc(seed.split(/\r?\n/), lrc);
  const [draft, setDraft] = useState(seed);
  const [editing, setEditing] = useState(seed.trim() === "");
  const [stamps, setStamps] = useState<(number | null)[]>(seedStamps);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);

  const lines = useMemo(
    () => draft.split(/\r?\n/).map((l) => l.trim()),
    [draft],
  );

  // Seed stamps from existing LRC when locking in the line list
  function startSyncing() {
    const lineList = draft.split(/\r?\n/).map((l) => l.trim());
    setStamps(seedFromLrc(lineList, lrc));
    setActiveIdx(0);
    setEditing(false);
  }

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setPositionMs(el.currentTime * 1000);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => setIsPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
    };
  }, [editing]);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }

  function stampActive() {
    if (activeIdx >= lines.length) return;
    setStamps((prev) => {
      const next = [...prev];
      next[activeIdx] = positionMs;
      return next;
    });
    // Advance to the next non-empty line
    let nextIdx = activeIdx + 1;
    while (nextIdx < lines.length && lines[nextIdx] === "") nextIdx++;
    setActiveIdx(Math.min(nextIdx, lines.length));
  }

  function clearStamp(idx: number) {
    setStamps((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  }

  function seekTo(ms: number) {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = ms / 1000;
    setPositionMs(ms);
  }

  const stampedCount = stamps.filter(
    (s, i) => s != null && lines[i] !== "",
  ).length;
  const totalLines = lines.filter((l) => l !== "").length;

  const generatedLrc = useMemo(() => {
    return lines
      .map((line, i) => {
        const ms = stamps[i];
        if (line === "" || ms == null) return null;
        return `[${formatStamp(ms)}] ${line}`;
      })
      .filter((l): l is string => l !== null)
      .join("\n");
  }, [lines, stamps]);

  const saveMutation = useUpdateSongLyrics();

  function save() {
    if (!generatedLrc) {
      toast({
        title: "Nothing to save",
        description: "Tap at least one line to stamp it first.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(
      { id: songId, data: { lrc: generatedLrc } },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: getGetSongQueryKey(songId),
          });
          toast({
            title: "Synced lyrics saved",
            description: `${stampedCount} line${
              stampedCount === 1 ? "" : "s"
            } now play in time inside the listener app.`,
          });
        },
        onError: () => {
          toast({
            title: "Couldn't save",
            description: "Something went wrong saving the synced lyrics.",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Tap-to-Sync Lyrics</CardTitle>
          {lrc && !editing && (
            <Badge variant="secondary" className="gap-1">
              <Check className="w-3 h-3" /> Synced
            </Badge>
          )}
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(true)}
            className="gap-1.5 text-muted-foreground"
          >
            <Undo2 className="w-3.5 h-3.5" /> Edit lines
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {audioUrl ? (
          <audio ref={audioRef} src={audioUrl} preload="auto" />
        ) : (
          <p className="text-sm text-muted-foreground">
            This song has no audio URL, so syncing isn't available.
          </p>
        )}

        {editing ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Paste or edit the lyrics, one line per row. Then lock them in to
              start tapping each line in time with the music.
            </p>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={10}
              placeholder={"First line of the song\nSecond line\n..."}
              className="font-sans text-sm leading-relaxed"
            />
            <Button
              onClick={startSyncing}
              disabled={!audioUrl || draft.trim() === ""}
              className="gap-1.5"
            >
              <Crosshair className="w-4 h-4" /> Lock lines &amp; start syncing
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/60 p-3">
              <Button
                size="icon"
                onClick={togglePlay}
                disabled={!audioUrl}
                className="rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div className="font-mono text-sm tabular-nums">
                {formatStamp(positionMs)}
              </div>
              <div className="flex-1" />
              <Button
                onClick={stampActive}
                disabled={!isPlaying || activeIdx >= lines.length}
                className="gap-1.5"
              >
                <Crosshair className="w-4 h-4" /> Tap line
              </Button>
              <span className="text-xs text-muted-foreground w-16 text-right">
                {stampedCount}/{totalLines} set
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto rounded-lg border border-border divide-y divide-border">
              {lines.map((line, i) => {
                if (line === "")
                  return <div key={i} className="h-3 bg-transparent" />;
                const ms = stamps[i];
                const isActive = i === activeIdx;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                      isActive ? "bg-primary/10" : "hover:bg-secondary/40"
                    }`}
                  >
                    <button
                      onClick={() => setActiveIdx(i)}
                      className={`font-mono text-xs w-20 text-left shrink-0 ${
                        ms != null
                          ? "text-primary hover:underline"
                          : "text-muted-foreground"
                      }`}
                      onDoubleClick={() => ms != null && seekTo(ms)}
                      title={ms != null ? "Double-click to seek here" : ""}
                    >
                      {ms != null ? formatStamp(ms) : "--:--.--"}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {line}
                    </span>
                    {ms != null && (
                      <button
                        onClick={() => clearStamp(i)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                        title="Clear timestamp"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={save}
                disabled={stampedCount === 0 || saveMutation.isPending}
                className="gap-1.5"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? "Saving…" : "Save synced lyrics"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStamps((prev) => prev.map(() => null));
                  setActiveIdx(0);
                }}
                disabled={stampedCount === 0}
                className="gap-1.5 text-muted-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset all
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
