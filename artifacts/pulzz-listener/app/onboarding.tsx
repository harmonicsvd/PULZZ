import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import type { FavoriteTrack, TasteProfile } from "@/contexts/AppContext";
import { api, type MxmTrack } from "@/lib/api";

interface GenreChip {
  name: string;
  icon: string;
}

const FALLBACK_GENRES: GenreChip[] = [
  { name: "Pop", icon: "music" },
  { name: "Hip-Hop/Rap", icon: "headphones" },
  { name: "R&B/Soul", icon: "heart" },
  { name: "Electronic", icon: "zap" },
  { name: "Indie Pop", icon: "star" },
  { name: "Alternative", icon: "compass" },
  { name: "Rock", icon: "activity" },
  { name: "Dance", icon: "disc" },
  { name: "Jazz", icon: "coffee" },
  { name: "Classical", icon: "feather" },
];

const DESIRED_GENRES = [
  "Pop",
  "Hip Hop/Rap",
  "R&B/Soul",
  "Electronic",
  "Indie Pop",
  "Alternative",
  "Rock",
  "Dance",
  "Jazz",
  "Classical",
  "Country",
  "Singer/Songwriter",
];

function iconForGenre(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("hip") || lower.includes("rap")) return "headphones";
  if (lower.includes("r&b") || lower.includes("soul")) return "heart";
  if (lower.includes("electro") || lower.includes("dance")) return "zap";
  if (lower.includes("indie")) return "star";
  if (lower.includes("alt")) return "compass";
  if (lower.includes("rock") || lower.includes("metal")) return "activity";
  if (lower.includes("jazz")) return "coffee";
  if (lower.includes("classic")) return "feather";
  if (lower.includes("country") || lower.includes("folk")) return "sun";
  if (lower.includes("song")) return "edit-3";
  return "music";
}

const PERSONALITIES = [
  {
    id: "explorer" as const,
    label: "Explorer",
    desc: "I love finding music no one knows yet. Surprise me.",
    icon: "compass",
  },
  {
    id: "balanced" as const,
    label: "Balanced",
    desc: "Mix familiar vibes with occasional new discoveries.",
    icon: "sliders",
  },
  {
    id: "familiar" as const,
    label: "Familiar",
    desc: "Keep it close to what I already love.",
    icon: "bookmark",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { saveProfile } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [genres, setGenres] = useState<GenreChip[]>(FALLBACK_GENRES);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [personality, setPersonality] = useState<
    "explorer" | "balanced" | "familiar" | null
  >(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MxmTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteTrack[]>([]);
  const [building, setBuilding] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    let active = true;
    api
      .fetchMusixmatchGenres()
      .then((all) => {
        if (!active || !all || all.length === 0) return;
        const byName = new Map(all.map((g) => [g.name.toLowerCase(), g.name]));
        const picked: GenreChip[] = [];
        for (const desired of DESIRED_GENRES) {
          const match =
            byName.get(desired.toLowerCase()) ??
            all.find((g) => g.name.toLowerCase().includes(desired.toLowerCase().split("/")[0]))?.name;
          if (match && !picked.some((p) => p.name === match)) {
            picked.push({ name: match, icon: iconForGenre(match) });
          }
        }
        if (picked.length >= 5) setGenres(picked);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const handle = setTimeout(async () => {
      try {
        const tracks = await api.searchMusixmatchTracks(q, 8);
        setResults(tracks);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [query]);

  function animateStep(next: number) {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(next), 150);
  }

  function toggleGenre(genreName: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGenres((prev) =>
      prev.includes(genreName) ? prev.filter((g) => g !== genreName) : [...prev, genreName]
    );
  }

  function toggleFavorite(track: MxmTrack) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites((prev) => {
      if (prev.some((f) => f.id === track.id)) {
        return prev.filter((f) => f.id !== track.id);
      }
      return [
        ...prev,
        {
          id: track.id,
          name: track.name,
          artistName: track.artistName,
          artworkUrl: track.artworkUrl,
          genres: track.genres,
        },
      ];
    });
  }

  async function buildTaste(): Promise<TasteProfile> {
    const genreCount = new Map<string, number>();
    for (const g of selectedGenres) genreCount.set(g, (genreCount.get(g) ?? 0) + 2);
    for (const fav of favorites) {
      for (const g of fav.genres) genreCount.set(g, (genreCount.get(g) ?? 0) + 1);
    }

    const moodCount = new Map<string, number>();
    const themeCount = new Map<string, number>();
    const toAnalyze = favorites.slice(0, 3);
    const analyses = await Promise.all(
      toAnalyze.map((f) => api.getMusixmatchAnalysis(f.id).catch(() => null))
    );
    for (const a of analyses) {
      if (!a) continue;
      for (const m of a.moods) moodCount.set(m, (moodCount.get(m) ?? 0) + 1);
      for (const t of a.themes) themeCount.set(t, (themeCount.get(t) ?? 0) + 1);
    }

    const byFreq = (map: Map<string, number>) =>
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([k]) => k);

    return {
      genres: byFreq(genreCount),
      moods: byFreq(moodCount),
      themes: byFreq(themeCount),
    };
  }

  async function finish() {
    if (!personality || !name.trim() || building) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBuilding(true);
    let taste: TasteProfile;
    try {
      taste = await buildTaste();
    } catch {
      taste = { genres: selectedGenres, moods: [], themes: [] };
    }
    await saveProfile({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      genres: selectedGenres,
      discoveryPersonality: personality,
      createdAt: new Date().toISOString(),
      favoriteTracks: favorites,
      taste,
    });
    router.replace("/(tabs)/discover");
  }

  const canProceed =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && selectedGenres.length > 0) ||
    step === 2 ||
    (step === 3 && personality !== null);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topPad + 16,
          paddingBottom: botPad + 16,
        },
      ]}
    >
      <View style={styles.progressBar}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor: i <= step ? colors.primary : colors.muted,
                width: i === step ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {step === 0 && (
          <View style={styles.stepContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accent + "26" }]}>
              <Text style={styles.iconEmoji}>🎵</Text>
            </View>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              Welcome to Pulzz
            </Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              Discover music before anyone else. Be the first to hear what's next.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                What should we call you?
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="Your name"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => name.trim() && animateStep(1)}
              />
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              What moves you?
            </Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              Pick your genres. We'll match you with songs that fit your taste.
            </Text>
            <ScrollView style={styles.genreScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.genreGrid}>
                {genres.map((g) => {
                  const selected = selectedGenres.includes(g.name);
                  return (
                    <Pressable
                      key={g.name}
                      style={[
                        styles.genreChip,
                        {
                          backgroundColor: selected ? colors.primary : colors.card,
                          borderColor: selected ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => toggleGenre(g.name)}
                    >
                      <Feather
                        name={g.icon as any}
                        size={16}
                        color={selected ? "#FFF" : colors.mutedForeground}
                      />
                      <Text
                        style={[
                          styles.genreChipLabel,
                          { color: selected ? "#FFF" : colors.foreground },
                        ]}
                      >
                        {g.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              Who do you love?
            </Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              Search the songs and artists you can't stop playing. We'll learn your taste.
            </Text>

            <View
              style={[
                styles.searchBar,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="search" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.searchInput, { color: colors.foreground }]}
                placeholder="Try 'Billie Eilish' or a song"
                placeholderTextColor={colors.mutedForeground}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {searching && <ActivityIndicator size="small" color={colors.primary} />}
            </View>

            {favorites.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.favRow}
                contentContainerStyle={styles.favRowContent}
              >
                {favorites.map((f) => (
                  <Pressable
                    key={f.id}
                    style={[styles.favPill, { backgroundColor: colors.primary + "22" }]}
                    onPress={() => toggleFavorite({ ...f } as MxmTrack)}
                  >
                    <Text
                      style={[styles.favPillText, { color: colors.primary }]}
                      numberOfLines={1}
                    >
                      {f.name}
                    </Text>
                    <Feather name="x" size={13} color={colors.primary} />
                  </Pressable>
                ))}
              </ScrollView>
            )}

            <ScrollView
              style={styles.resultsScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {results.map((t) => {
                const selected = favorites.some((f) => f.id === t.id);
                return (
                  <Pressable
                    key={t.id}
                    style={[styles.resultRow, { borderColor: colors.border }]}
                    onPress={() => toggleFavorite(t)}
                  >
                    {t.artworkUrl ? (
                      <Image source={{ uri: t.artworkUrl }} style={styles.artwork} />
                    ) : (
                      <View
                        style={[
                          styles.artwork,
                          styles.artworkPlaceholder,
                          { backgroundColor: colors.muted },
                        ]}
                      >
                        <Feather name="music" size={18} color={colors.mutedForeground} />
                      </View>
                    )}
                    <View style={styles.resultText}>
                      <Text
                        style={[styles.resultTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {t.name}
                      </Text>
                      <Text
                        style={[styles.resultArtist, { color: colors.mutedForeground }]}
                        numberOfLines={1}
                      >
                        {t.artistName}
                        {t.genres.length > 0 ? ` · ${t.genres[0]}` : ""}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.addBtn,
                        {
                          backgroundColor: selected ? colors.primary : "transparent",
                          borderColor: selected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Feather
                        name={selected ? "check" : "plus"}
                        size={16}
                        color={selected ? "#FFF" : colors.mutedForeground}
                      />
                    </View>
                  </Pressable>
                );
              })}
              {query.trim().length >= 2 && !searching && results.length === 0 && (
                <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>
                  No matches. Try another search.
                </Text>
              )}
            </ScrollView>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              Your discovery style
            </Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              How adventurous are you when it comes to new music?
            </Text>
            <View style={styles.personalityList}>
              {PERSONALITIES.map((p) => {
                const selected = personality === p.id;
                return (
                  <Pressable
                    key={p.id}
                    style={[
                      styles.personalityCard,
                      {
                        backgroundColor: selected ? colors.primary + "22" : colors.card,
                        borderColor: selected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setPersonality(p.id);
                    }}
                  >
                    <View
                      style={[
                        styles.personalityIcon,
                        { backgroundColor: selected ? colors.primary : colors.muted },
                      ]}
                    >
                      <Feather
                        name={p.icon as any}
                        size={18}
                        color={selected ? "#FFF" : colors.mutedForeground}
                      />
                    </View>
                    <View style={styles.personalityText}>
                      <Text
                        style={[
                          styles.personalityLabel,
                          { color: selected ? colors.primary : colors.foreground },
                        ]}
                      >
                        {p.label}
                      </Text>
                      <Text
                        style={[styles.personalityDesc, { color: colors.mutedForeground }]}
                      >
                        {p.desc}
                      </Text>
                    </View>
                    {selected && (
                      <Feather name="check-circle" size={20} color={colors.primary} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </Animated.View>

      <View style={styles.navRow}>
        {step > 0 && (
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: colors.border }]}
            onPress={() => animateStep(step - 1)}
            disabled={building}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextBtn,
            {
              backgroundColor: canProceed ? colors.primary : colors.muted,
              flex: 1,
              marginLeft: step > 0 ? 12 : 0,
            },
          ]}
          disabled={!canProceed || building}
          onPress={() => {
            if (step < 3) animateStep(step + 1);
            else finish();
          }}
          activeOpacity={0.85}
        >
          {building ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.nextBtnText}>
              {step < 3
                ? step === 2 && favorites.length === 0
                  ? "Skip for now"
                  : "Continue"
                : `Let's go, ${name} →`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 36,
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 28,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "500",
  },
  genreScroll: {
    flex: 1,
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  genreChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  genreChipLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  favRow: {
    flexGrow: 0,
    marginBottom: 12,
  },
  favRowContent: {
    gap: 8,
  },
  favPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 160,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favPillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  resultsScroll: {
    flex: 1,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  artworkPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  resultArtist: {
    fontSize: 13,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHint: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 28,
  },
  personalityList: {
    gap: 12,
  },
  personalityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  personalityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  personalityText: {
    flex: 1,
  },
  personalityLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  personalityDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  backBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtn: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
