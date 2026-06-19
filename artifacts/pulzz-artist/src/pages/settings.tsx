import { AppLayout } from "@/components/layout/app-layout";
import {
  useUpdateArtist,
  getGetArtistQueryKey,
  getGetCurrentArtistQueryKey,
} from "@workspace/api-client-react";
import { useCurrentArtist } from "@/lib/current-artist";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
  GENRES,
  DISTRIBUTORS,
  ROLE_OPTIONS,
  LINK_FIELDS,
  STREAMING_PLATFORMS,
  placeholderFollowerCount,
} from "@/lib/artist-meta";

type LinkKey = (typeof LINK_FIELDS)[number]["key"];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const artist = useCurrentArtist();
  const { mutate: updateArtist, isPending } = useUpdateArtist();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [genre, setGenre] = useState("");
  const [distributor, setDistributor] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (artist && !hydrated) {
      setName(artist.name ?? "");
      setBio(artist.bio ?? "");
      setGenre(artist.genre ?? "");
      setDistributor(artist.distributor ?? "");
      setRoles(artist.roles ?? []);
      setLinks({ ...(artist.links ?? {}) } as Record<string, string>);
      setHydrated(true);
    }
  }, [artist, hydrated]);

  function toggleRole(value: string) {
    setRoles((prev) =>
      prev.includes(value)
        ? prev.filter((r) => r !== value)
        : [...prev, value]
    );
  }

  function setLink(key: LinkKey, value: string) {
    setLinks((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const cleanedLinks: Record<string, string> = {};
    for (const { key } of LINK_FIELDS) {
      const v = links[key]?.trim();
      if (v) cleanedLinks[key] = v;
    }

    updateArtist(
      {
        id: artist.id,
        data: {
          name: name.trim(),
          bio: bio.trim(),
          genre: genre || undefined,
          distributor: distributor || undefined,
          roles,
          links: cleanedLinks,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetArtistQueryKey(artist.id),
          });
          queryClient.invalidateQueries({
            queryKey: getGetCurrentArtistQueryKey(),
          });
          toast({
            title: "Profile saved",
            description: "Your changes are live.",
          });
        },
        onError: () => {
          toast({
            title: "Couldn't save",
            description: "Check your links start with https:// and try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const streamingMeta = new Map(STREAMING_PLATFORMS.map((p) => [p.key, p]));

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Who you are and where listeners can find you. These details pre-fill
            your song submissions.
          </p>
        </header>

        {(
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Primary Genre</Label>
                    <Select value={genre} onValueChange={setGenre}>
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
                    <Label>Distributor</Label>
                    <Select value={distributor} onValueChange={setDistributor}>
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
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="A short bio listeners and collaborators will see."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-background resize-none min-h-[90px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Roles & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  What you do. Used to match you with complementary collaborators.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROLE_OPTIONS.map((role) => (
                    <label
                      key={role.value}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <Checkbox
                        checked={roles.includes(role.value)}
                        onCheckedChange={() => toggleRole(role.value)}
                      />
                      {role.label}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Where to find you</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground -mt-1">
                  Add a streaming link and we'll show your reach on your profile
                  automatically. <span className="italic">Demo figures for now.</span>
                </p>
                {LINK_FIELDS.map((field) => {
                  const meta = streamingMeta.get(field.key);
                  const hasLink = !!links[field.key]?.trim();
                  return (
                    <div key={field.key} className="space-y-1.5">
                      <Label htmlFor={`link-${field.key}`}>{field.label}</Label>
                      <Input
                        id={`link-${field.key}`}
                        placeholder={field.placeholder}
                        value={links[field.key] ?? ""}
                        onChange={(e) => setLink(field.key, e.target.value)}
                        className="bg-background"
                      />
                      {meta && hasLink && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {placeholderFollowerCount(
                              artist.id,
                              field.key
                            ).toLocaleString()}
                          </span>{" "}
                          {meta.metric}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-md text-sm font-semibold transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
