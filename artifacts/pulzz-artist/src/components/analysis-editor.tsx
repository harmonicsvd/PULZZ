import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Pencil, Save, X, Plus } from "lucide-react";
import {
  useUpdateSongAnalysis,
  getGetSongQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface AnalysisShape {
  mood?: string[];
  themes?: string[];
  language?: string | null;
}

interface Props {
  songId: number;
  analysis?: AnalysisShape | null;
}

interface TagFieldProps {
  label: string;
  variant: "secondary" | "outline";
  tags: string[];
  input: string;
  placeholder: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (tag: string) => void;
}

function TagField({
  label,
  variant,
  tags,
  input,
  placeholder,
  onInputChange,
  onAdd,
  onRemove,
}: TagFieldProps) {
  return (
    <div className="space-y-2">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <div className="flex flex-wrap gap-1.5">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge key={tag} variant={variant} className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="rounded-sm hover:bg-foreground/10 p-0.5"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">None yet</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className="h-8 text-sm"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAdd}
          disabled={input.trim() === ""}
          className="gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </Button>
      </div>
    </div>
  );
}

export function AnalysisEditor({ songId, analysis }: Props) {
  const queryClient = useQueryClient();
  const saveMutation = useUpdateSongAnalysis();

  const [editing, setEditing] = useState(false);
  const [moods, setMoods] = useState<string[]>(analysis?.mood ?? []);
  const [themes, setThemes] = useState<string[]>(analysis?.themes ?? []);
  const [language, setLanguage] = useState<string>(analysis?.language ?? "");
  const [moodInput, setMoodInput] = useState("");
  const [themeInput, setThemeInput] = useState("");

  const viewMoods = analysis?.mood ?? [];
  const viewThemes = analysis?.themes ?? [];
  const viewLanguage = analysis?.language ?? null;
  const hasAny =
    viewMoods.length > 0 || viewThemes.length > 0 || !!viewLanguage;

  function startEdit() {
    setMoods(analysis?.mood ?? []);
    setThemes(analysis?.themes ?? []);
    setLanguage(analysis?.language ?? "");
    setMoodInput("");
    setThemeInput("");
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
  }

  function addTag(
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    clearInput: () => void,
  ) {
    const v = value.trim();
    if (!v) return;
    if (!list.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setList([...list, v]);
    }
    clearInput();
  }

  function save() {
    saveMutation.mutate(
      {
        id: songId,
        data: { mood: moods, themes, language: language.trim() || null },
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: getGetSongQueryKey(songId),
          });
          toast({
            title: "Analysis saved",
            description: "Your edits to the lyrics analysis are saved.",
          });
          setEditing(false);
        },
        onError: () => {
          toast({
            title: "Couldn't save",
            description: "Something went wrong saving the analysis.",
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
          <CardTitle className="text-base">Lyrics Analysis</CardTitle>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startEdit}
            className="gap-1.5 text-muted-foreground"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-5">
            <TagField
              label="Mood"
              variant="secondary"
              tags={moods}
              input={moodInput}
              placeholder="Add a mood (e.g. uplifting)"
              onInputChange={setMoodInput}
              onAdd={() =>
                addTag(moodInput, moods, setMoods, () => setMoodInput(""))
              }
              onRemove={(tag) => setMoods(moods.filter((m) => m !== tag))}
            />
            <TagField
              label="Themes"
              variant="outline"
              tags={themes}
              input={themeInput}
              placeholder="Add a theme (e.g. heartbreak)"
              onInputChange={setThemeInput}
              onAdd={() =>
                addTag(themeInput, themes, setThemes, () => setThemeInput(""))
              }
              onRemove={(tag) => setThemes(themes.filter((t) => t !== tag))}
            />
            <div className="space-y-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Language
              </dt>
              <Input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g. en"
                className="h-8 text-sm max-w-40"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={save}
                disabled={saveMutation.isPending}
                className="gap-1.5"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? "Saving…" : "Save analysis"}
              </Button>
              <Button
                variant="ghost"
                onClick={cancel}
                disabled={saveMutation.isPending}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : !hasAny ? (
          <p className="text-sm text-muted-foreground">
            No lyrics analysis yet. Analysis is derived automatically when a
            song is submitted with lyrics — or you can add your own with{" "}
            <span className="font-medium">Edit</span>.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Mood
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {viewMoods.length > 0 ? (
                  viewMoods.map((m) => (
                    <Badge key={m} variant="secondary">
                      {m}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </dd>
            </div>
            <div className="space-y-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Themes
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {viewThemes.length > 0 ? (
                  viewThemes.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </dd>
            </div>
            <div className="space-y-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Language
              </dt>
              <dd>
                {viewLanguage ? (
                  <Badge variant="secondary" className="uppercase">
                    {viewLanguage}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </dd>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
