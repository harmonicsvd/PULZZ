import { createContext, useContext, type ReactNode } from "react";
import {
  useGetCurrentArtist,
  getGetCurrentArtistQueryKey,
  type Artist,
} from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

const CurrentArtistContext = createContext<Artist | null>(null);

export function CurrentArtistProvider({ children }: { children: ReactNode }) {
  const {
    data: artist,
    isLoading,
    isError,
  } = useGetCurrentArtist({
    query: { queryKey: getGetCurrentArtistQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <div className="text-center">
          <p className="font-semibold">Couldn't load your artist profile</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <CurrentArtistContext.Provider value={artist}>
      {children}
    </CurrentArtistContext.Provider>
  );
}

export function useCurrentArtist(): Artist {
  const ctx = useContext(CurrentArtistContext);
  if (!ctx) {
    throw new Error(
      "useCurrentArtist must be used within a CurrentArtistProvider",
    );
  }
  return ctx;
}
