import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEMO_SONGS } from "@/data/songs";
import type { DemoSong } from "@/data/songs";
import { api, apiSongToDemoSong } from "@/lib/api";

export interface ListenerProfile {
  id: string;
  name: string;
  genres: string[];
  discoveryPersonality: "explorer" | "balanced" | "familiar";
  createdAt: string;
}

export interface Discovery {
  songId: string;
  songTitle: string;
  artist: string;
  genre: string;
  coverGradient: [string, string];
  discoveredAt: string;
  releaseDate: string;
  momentCount: number;
}

export interface MomentMark {
  songId: string;
  timestampMs: number;
  createdAt: string;
}

interface AppContextValue {
  profile: ListenerProfile | null;
  isLoading: boolean;
  songs: DemoSong[];
  discoveries: Discovery[];
  momentMarks: MomentMark[];
  listenedSongIds: string[];
  saveProfile: (profile: ListenerProfile) => Promise<void>;
  markDiscovered: (discovery: Discovery) => Promise<void>;
  markSkip: (songId: string) => Promise<void>;
  addMomentMark: (mark: MomentMark) => Promise<void>;
  getDiscoveryPoints: () => number;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  PROFILE: "pulzz_profile",
  DISCOVERIES: "pulzz_discoveries",
  MOMENT_MARKS: "pulzz_moment_marks",
  LISTENED: "pulzz_listened",
  LISTENER_ID: "pulzz_listener_id",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ListenerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<DemoSong[]>(DEMO_SONGS);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [momentMarks, setMomentMarks] = useState<MomentMark[]>([]);
  const [listenedSongIds, setListenedSongIds] = useState<string[]>([]);
  const [listenerId, setListenerId] = useState<number | null>(null);

  useEffect(() => {
    loadAllData();
    loadSongsFromApi();
  }, []);

  async function loadSongsFromApi() {
    try {
      const apiSongs = await api.fetchSongs();
      if (apiSongs && apiSongs.length > 0) {
        setSongs(apiSongs.map(apiSongToDemoSong));
      }
    } catch {
      // API unavailable — keep DEMO_SONGS as fallback
    }
  }

  async function loadAllData() {
    try {
      const [profileJson, discJson, marksJson, listenedJson, listenerIdStr] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.DISCOVERIES),
          AsyncStorage.getItem(STORAGE_KEYS.MOMENT_MARKS),
          AsyncStorage.getItem(STORAGE_KEYS.LISTENED),
          AsyncStorage.getItem(STORAGE_KEYS.LISTENER_ID),
        ]);
      if (profileJson) setProfile(JSON.parse(profileJson));
      if (discJson) setDiscoveries(JSON.parse(discJson));
      if (marksJson) setMomentMarks(JSON.parse(marksJson));
      if (listenedJson) setListenedSongIds(JSON.parse(listenedJson));
      if (listenerIdStr) setListenerId(parseInt(listenerIdStr));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  const saveProfile = useCallback(async (p: ListenerProfile) => {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(p));
    setProfile(p);
    // Create listener in backend
    try {
      const result = await api.createListener({
        name: p.name,
        genres: p.genres,
        discoveryPersonality: p.discoveryPersonality,
      });
      await AsyncStorage.setItem(
        STORAGE_KEYS.LISTENER_ID,
        String(result.id)
      );
      setListenerId(result.id);
    } catch {
      // Backend unavailable — app still works locally
    }
  }, []);

  const markDiscovered = useCallback(
    async (discovery: Discovery) => {
      const updated = [
        ...discoveries.filter((d) => d.songId !== discovery.songId),
        discovery,
      ];
      await AsyncStorage.setItem(
        STORAGE_KEYS.DISCOVERIES,
        JSON.stringify(updated)
      );
      setDiscoveries(updated);
      const listened = [...listenedSongIds, discovery.songId];
      await AsyncStorage.setItem(
        STORAGE_KEYS.LISTENED,
        JSON.stringify(listened)
      );
      setListenedSongIds(listened);
      // Sync to backend
      if (listenerId) {
        api
          .createReaction({
            songId: parseInt(discovery.songId),
            listenerId,
            type: "discovered",
          })
          .catch(() => {});
      }
    },
    [discoveries, listenedSongIds, listenerId]
  );

  const markSkip = useCallback(
    async (songId: string) => {
      const listened = [...listenedSongIds, songId];
      await AsyncStorage.setItem(
        STORAGE_KEYS.LISTENED,
        JSON.stringify(listened)
      );
      setListenedSongIds(listened);
      // Sync to backend
      if (listenerId) {
        api
          .createReaction({
            songId: parseInt(songId),
            listenerId,
            type: "skip",
          })
          .catch(() => {});
      }
    },
    [listenedSongIds, listenerId]
  );

  const addMomentMark = useCallback(
    async (mark: MomentMark) => {
      const updated = [...momentMarks, mark];
      await AsyncStorage.setItem(
        STORAGE_KEYS.MOMENT_MARKS,
        JSON.stringify(updated)
      );
      setMomentMarks(updated);
      // Sync to backend
      if (listenerId) {
        api
          .createMomentMark({
            songId: parseInt(mark.songId),
            listenerId,
            timestampMs: mark.timestampMs,
          })
          .catch(() => {});
      }
    },
    [momentMarks, listenerId]
  );

  const getDiscoveryPoints = useCallback(() => {
    let points = 0;
    discoveries.forEach((d) => {
      const daysLeft = Math.max(
        0,
        Math.ceil(
          (new Date(d.releaseDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      );
      points += 100 + daysLeft * 10;
      const marks = momentMarks.filter((m) => m.songId === d.songId).length;
      points += marks * 15;
    });
    return points;
  }, [discoveries, momentMarks]);

  return (
    <AppContext.Provider
      value={{
        profile,
        isLoading,
        songs,
        discoveries,
        momentMarks,
        listenedSongIds,
        saveProfile,
        markDiscovered,
        markSkip,
        addMomentMark,
        getDiscoveryPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
