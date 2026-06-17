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
import type { ReleaseNotification } from "@/lib/api";

export interface FavoriteTrack {
  id: number;
  name: string;
  artistName: string;
  artworkUrl: string | null;
  genres: string[];
}

export interface TasteProfile {
  genres: string[];
  moods: string[];
  themes: string[];
}

export interface ListenerProfile {
  id: string;
  name: string;
  genres: string[];
  discoveryPersonality: "explorer" | "balanced" | "familiar";
  createdAt: string;
  favoriteTracks?: FavoriteTrack[];
  taste?: TasteProfile;
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

interface PendingReaction {
  songId: string;
  type: "discovered" | "skip";
}

interface PendingMoment {
  songId: string;
  timestampMs: number;
}

interface PendingSubscription {
  songId: string;
  action: "subscribe" | "unsubscribe";
}

interface AppContextValue {
  profile: ListenerProfile | null;
  isLoading: boolean;
  songs: DemoSong[];
  discoveries: Discovery[];
  momentMarks: MomentMark[];
  listenedSongIds: string[];
  releaseNotificationsEnabled: boolean;
  releaseNotifications: ReleaseNotification[];
  saveProfile: (profile: ListenerProfile) => Promise<void>;
  markDiscovered: (discovery: Discovery) => Promise<void>;
  markSkip: (songId: string) => Promise<void>;
  addMomentMark: (mark: MomentMark) => Promise<void>;
  getDiscoveryPoints: () => number;
  setReleaseNotificationsEnabled: (enabled: boolean) => Promise<void>;
  refreshReleaseNotifications: () => Promise<void>;
  dismissReleaseNotification: (songId: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  PROFILE: "pulzz_profile",
  DISCOVERIES: "pulzz_discoveries",
  MOMENT_MARKS: "pulzz_moment_marks",
  LISTENED: "pulzz_listened",
  LISTENER_ID: "pulzz_listener_id",
  PENDING_REACTIONS: "pulzz_pending_reactions",
  PENDING_MOMENTS: "pulzz_pending_moments",
  PENDING_SUBSCRIPTIONS: "pulzz_pending_subscriptions",
  RELEASE_NOTIFS_ENABLED: "pulzz_release_notifs_enabled",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ListenerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<DemoSong[]>(DEMO_SONGS);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [momentMarks, setMomentMarks] = useState<MomentMark[]>([]);
  const [listenedSongIds, setListenedSongIds] = useState<string[]>([]);
  const [listenerId, setListenerId] = useState<number | null>(null);
  const [releaseNotifsEnabled, setReleaseNotifsEnabled] = useState(true);
  const [releaseNotifications, setReleaseNotifications] = useState<
    ReleaseNotification[]
  >([]);

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

  // Append a not-yet-synced event to the local outbox.
  const enqueuePending = useCallback(
    async (
      key: string,
      item: PendingReaction | PendingMoment | PendingSubscription
    ) => {
      try {
        const json = await AsyncStorage.getItem(key);
        const arr = json ? JSON.parse(json) : [];
        arr.push(item);
        await AsyncStorage.setItem(key, JSON.stringify(arr));
      } catch {
        // ignore — best effort
      }
    },
    []
  );

  // Replay any queued reactions/moments to the backend. Survivors of a failed
  // send stay in the outbox for the next attempt. Reaction scoring is
  // idempotent server-side, so replays never inflate metrics.
  const flushPending = useCallback(async (lid: number) => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_REACTIONS);
      const pending: PendingReaction[] = json ? JSON.parse(json) : [];
      if (pending.length > 0) {
        const remaining: PendingReaction[] = [];
        for (const r of pending) {
          const songId = parseInt(r.songId);
          if (isNaN(songId)) continue;
          try {
            await api.createReaction({ songId, listenerId: lid, type: r.type });
          } catch {
            remaining.push(r);
          }
        }
        await AsyncStorage.setItem(
          STORAGE_KEYS.PENDING_REACTIONS,
          JSON.stringify(remaining)
        );
      }
    } catch {
      // ignore
    }
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_MOMENTS);
      const pending: PendingMoment[] = json ? JSON.parse(json) : [];
      if (pending.length > 0) {
        const remaining: PendingMoment[] = [];
        for (const m of pending) {
          const songId = parseInt(m.songId);
          if (isNaN(songId)) continue;
          try {
            await api.createMomentMark({
              songId,
              listenerId: lid,
              timestampMs: m.timestampMs,
            });
          } catch {
            remaining.push(m);
          }
        }
        await AsyncStorage.setItem(
          STORAGE_KEYS.PENDING_MOMENTS,
          JSON.stringify(remaining)
        );
      }
    } catch {
      // ignore
    }
    try {
      const json = await AsyncStorage.getItem(
        STORAGE_KEYS.PENDING_SUBSCRIPTIONS
      );
      const pending: PendingSubscription[] = json ? JSON.parse(json) : [];
      if (pending.length > 0) {
        const remaining: PendingSubscription[] = [];
        for (const s of pending) {
          const songId = parseInt(s.songId);
          if (isNaN(songId)) continue;
          try {
            if (s.action === "subscribe") {
              await api.subscribeRelease(lid, songId);
            } else {
              await api.unsubscribeRelease(lid, songId);
            }
          } catch {
            remaining.push(s);
          }
        }
        await AsyncStorage.setItem(
          STORAGE_KEYS.PENDING_SUBSCRIPTIONS,
          JSON.stringify(remaining)
        );
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch pending release-day notifications from the backend (best effort).
  const fetchNotifications = useCallback(async (lid: number) => {
    try {
      const notifs = await api.fetchReleaseNotifications(lid);
      setReleaseNotifications(notifs ?? []);
    } catch {
      // backend unavailable — leave current notifications untouched
    }
  }, []);

  // Create the backend listener identity and persist its id locally.
  // Returns the id, or null if the backend was unavailable.
  const createBackendListener = useCallback(
    async (p: ListenerProfile): Promise<number | null> => {
      try {
        const result = await api.createListener({
          name: p.name,
          genres: p.genres,
          discoveryPersonality: p.discoveryPersonality,
        });
        await AsyncStorage.setItem(STORAGE_KEYS.LISTENER_ID, String(result.id));
        setListenerId(result.id);
        // Identity established — drain any events queued while offline.
        await flushPending(result.id);
        fetchNotifications(result.id);
        return result.id;
      } catch {
        // Backend unavailable — app still works locally, retried on next launch
        return null;
      }
    },
    [flushPending, fetchNotifications]
  );

  async function loadAllData() {
    try {
      const [
        profileJson,
        discJson,
        marksJson,
        listenedJson,
        listenerIdStr,
        notifsEnabledStr,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.DISCOVERIES),
        AsyncStorage.getItem(STORAGE_KEYS.MOMENT_MARKS),
        AsyncStorage.getItem(STORAGE_KEYS.LISTENED),
        AsyncStorage.getItem(STORAGE_KEYS.LISTENER_ID),
        AsyncStorage.getItem(STORAGE_KEYS.RELEASE_NOTIFS_ENABLED),
      ]);
      let loadedProfile: ListenerProfile | null = null;
      if (profileJson) {
        loadedProfile = JSON.parse(profileJson);
        setProfile(loadedProfile);
      }
      if (discJson) setDiscoveries(JSON.parse(discJson));
      if (marksJson) setMomentMarks(JSON.parse(marksJson));
      if (listenedJson) setListenedSongIds(JSON.parse(listenedJson));
      // Default opt-in is on; only an explicit "false" disables it.
      if (notifsEnabledStr === "false") setReleaseNotifsEnabled(false);
      const parsedId = listenerIdStr ? parseInt(listenerIdStr) : NaN;
      if (!isNaN(parsedId)) {
        setListenerId(parsedId);
        // Drain any events queued while the backend was unreachable.
        await flushPending(parsedId);
        fetchNotifications(parsedId);
      } else if (loadedProfile) {
        // Profile exists but no backend identity yet (e.g. backend was down at
        // onboarding, or an older local profile). Backfill so reactions sync.
        createBackendListener(loadedProfile);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  const saveProfile = useCallback(
    async (p: ListenerProfile) => {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(p));
      setProfile(p);
      await createBackendListener(p);
    },
    [createBackendListener]
  );

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
      // Sync to backend; queue for later if offline or no identity yet.
      const songId = parseInt(discovery.songId);
      if (!isNaN(songId)) {
        if (listenerId) {
          api
            .createReaction({ songId, listenerId, type: "discovered" })
            .catch(() =>
              enqueuePending(STORAGE_KEYS.PENDING_REACTIONS, {
                songId: discovery.songId,
                type: "discovered",
              })
            );
        } else {
          enqueuePending(STORAGE_KEYS.PENDING_REACTIONS, {
            songId: discovery.songId,
            type: "discovered",
          });
        }
        // Opt in to a release-day ping for this song (when enabled).
        if (releaseNotifsEnabled) {
          if (listenerId) {
            api
              .subscribeRelease(listenerId, songId)
              .catch(() =>
                enqueuePending(STORAGE_KEYS.PENDING_SUBSCRIPTIONS, {
                  songId: discovery.songId,
                  action: "subscribe",
                })
              );
          } else {
            enqueuePending(STORAGE_KEYS.PENDING_SUBSCRIPTIONS, {
              songId: discovery.songId,
              action: "subscribe",
            });
          }
        }
      }
    },
    [
      discoveries,
      listenedSongIds,
      listenerId,
      enqueuePending,
      releaseNotifsEnabled,
    ]
  );

  const markSkip = useCallback(
    async (songId: string) => {
      const listened = [...listenedSongIds, songId];
      await AsyncStorage.setItem(
        STORAGE_KEYS.LISTENED,
        JSON.stringify(listened)
      );
      setListenedSongIds(listened);
      // Sync to backend; queue for later if offline or no identity yet.
      const numericId = parseInt(songId);
      if (!isNaN(numericId)) {
        if (listenerId) {
          api
            .createReaction({ songId: numericId, listenerId, type: "skip" })
            .catch(() =>
              enqueuePending(STORAGE_KEYS.PENDING_REACTIONS, {
                songId,
                type: "skip",
              })
            );
        } else {
          enqueuePending(STORAGE_KEYS.PENDING_REACTIONS, {
            songId,
            type: "skip",
          });
        }
      }
    },
    [listenedSongIds, listenerId, enqueuePending]
  );

  const addMomentMark = useCallback(
    async (mark: MomentMark) => {
      const updated = [...momentMarks, mark];
      await AsyncStorage.setItem(
        STORAGE_KEYS.MOMENT_MARKS,
        JSON.stringify(updated)
      );
      setMomentMarks(updated);
      // Sync to backend; queue for later if offline or no identity yet.
      const songId = parseInt(mark.songId);
      if (!isNaN(songId)) {
        if (listenerId) {
          api
            .createMomentMark({
              songId,
              listenerId,
              timestampMs: mark.timestampMs,
            })
            .catch(() =>
              enqueuePending(STORAGE_KEYS.PENDING_MOMENTS, {
                songId: mark.songId,
                timestampMs: mark.timestampMs,
              })
            );
        } else {
          enqueuePending(STORAGE_KEYS.PENDING_MOMENTS, {
            songId: mark.songId,
            timestampMs: mark.timestampMs,
          });
        }
      }
    },
    [momentMarks, listenerId, enqueuePending]
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

  const setReleaseNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      setReleaseNotifsEnabled(enabled);
      await AsyncStorage.setItem(
        STORAGE_KEYS.RELEASE_NOTIFS_ENABLED,
        enabled ? "true" : "false"
      );
      if (!listenerId) return;
      // Bring the backend in line with the preference for every discovered song.
      for (const d of discoveries) {
        const songId = parseInt(d.songId);
        if (isNaN(songId)) continue;
        if (enabled) {
          api
            .subscribeRelease(listenerId, songId)
            .catch(() =>
              enqueuePending(STORAGE_KEYS.PENDING_SUBSCRIPTIONS, {
                songId: d.songId,
                action: "subscribe",
              })
            );
        } else {
          api
            .unsubscribeRelease(listenerId, songId)
            .catch(() =>
              enqueuePending(STORAGE_KEYS.PENDING_SUBSCRIPTIONS, {
                songId: d.songId,
                action: "unsubscribe",
              })
            );
        }
      }
      if (!enabled) setReleaseNotifications([]);
    },
    [listenerId, discoveries, enqueuePending]
  );

  const refreshReleaseNotifications = useCallback(async () => {
    if (listenerId) await fetchNotifications(listenerId);
  }, [listenerId, fetchNotifications]);

  const dismissReleaseNotification = useCallback(
    async (songId: number) => {
      setReleaseNotifications((prev) =>
        prev.filter((n) => n.songId !== songId)
      );
      if (listenerId) {
        api.ackReleaseNotifications(listenerId, [songId]).catch(() => {
          // best effort — it will simply reappear on next fetch if it failed
        });
      }
    },
    [listenerId]
  );

  return (
    <AppContext.Provider
      value={{
        profile,
        isLoading,
        songs,
        discoveries,
        momentMarks,
        listenedSongIds,
        releaseNotificationsEnabled: releaseNotifsEnabled,
        releaseNotifications,
        saveProfile,
        markDiscovered,
        markSkip,
        addMomentMark,
        getDiscoveryPoints,
        setReleaseNotificationsEnabled,
        refreshReleaseNotifications,
        dismissReleaseNotification,
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
