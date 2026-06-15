import { Feather } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/contexts/AppContext";
import { DEMO_SONGS } from "@/data/songs";
import { useColors } from "@/hooks/useColors";

export default function ListenScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { markDiscovered, markSkip, addMomentMark } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const song = DEMO_SONGS.find((s) => s.id === id);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const [momentMarks, setMomentMarks] = useState<number[]>([]);
  const [showLyrics, setShowLyrics] = useState(false);
  const [momentFlash, setMomentFlash] = useState(false);

  const reactionScale = useRef(new Animated.Value(0)).current;
  const momentBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadAudio();
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  async function loadAudio() {
    if (!song) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsLoading(false);
      setIsPlaying(true);
    } catch {
      setIsLoading(false);
    }
  }

  function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis ?? 0);
    setDuration(status.durationMillis ?? (song?.durationSeconds ?? 0) * 1000);
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      showReactionOverlay();
    }
  }

  function showReactionOverlay() {
    setShowReaction(true);
    Animated.spring(reactionScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 7,
    }).start();
  }

  async function togglePlayPause() {
    if (!soundRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }

  async function handleMomentMark() {
    if (!song) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ts = position;
    setMomentMarks((prev) => [...prev, ts]);
    setMomentFlash(true);
    setTimeout(() => setMomentFlash(false), 600);
    Animated.sequence([
      Animated.spring(momentBtnScale, {
        toValue: 0.88,
        useNativeDriver: true,
        tension: 300,
      }),
      Animated.spring(momentBtnScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
      }),
    ]).start();
    await addMomentMark({
      songId: song.id,
      timestampMs: ts,
      createdAt: new Date().toISOString(),
    });
  }

  async function handleDiscovered() {
    if (!song) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await soundRef.current?.stopAsync();
    await markDiscovered({
      songId: song.id,
      songTitle: song.title,
      artist: song.artist,
      genre: song.genre,
      coverGradient: song.coverGradient,
      discoveredAt: new Date().toISOString(),
      releaseDate: song.releaseDate,
      momentCount: momentMarks.length,
    });
    router.back();
  }

  async function handleSkip() {
    if (!song) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await soundRef.current?.stopAsync();
    await markSkip(song.id);
    router.back();
  }

  function formatTime(ms: number) {
    const secs = Math.floor(ms / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const progress = duration > 0 ? position / duration : 0;

  if (!song) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Song not found</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <LinearGradient
        colors={[song.coverGradient[0] + "CC", colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "rgba(0,0,0,0.4)" }]}
          onPress={() => {
            soundRef.current?.stopAsync();
            router.back();
          }}
        >
          <Feather name="chevron-down" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.preReleaseLabel}>PRE-RELEASE</Text>
          <Text style={styles.daysLeft}>
            {song.daysUntilRelease} days until release
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "rgba(0,0,0,0.4)" }]}
          onPress={() => setShowLyrics(!showLyrics)}
        >
          <Feather name="type" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {!showLyrics ? (
        <>
          <View style={styles.coverArea}>
            <LinearGradient
              colors={song.coverGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.coverArt}
            >
              {momentMarks.length > 0 && (
                <View style={styles.momentCountBadge}>
                  <Feather name="zap" size={12} color="#FFF" />
                  <Text style={styles.momentCountText}>{momentMarks.length}</Text>
                </View>
              )}
            </LinearGradient>
          </View>

          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.songArtist}>{song.artist}</Text>
            <View style={styles.tagsRow}>
              <View style={[styles.tag, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
                <Text style={styles.tagText}>{song.genre}</Text>
              </View>
              {song.tags.slice(0, 2).map((t) => (
                <View key={t} style={[styles.tag, { backgroundColor: "rgba(255,255,255,0.08)" }]}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <ScrollView
          style={styles.lyricsContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lyricsTitle}>{song.title}</Text>
          <Text style={styles.lyricsArtist}>{song.artist}</Text>
          {song.lyrics ? (
            <Text style={styles.lyricsText}>{song.lyrics}</Text>
          ) : (
            <Text style={[styles.lyricsText, { opacity: 0.5 }]}>
              Instrumental
            </Text>
          )}
          <Text style={styles.lyricsStory}>{song.story}</Text>
        </ScrollView>
      )}

      <View style={styles.progressSection}>
        <View style={[styles.progressTrack, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%`, backgroundColor: colors.primary },
            ]}
          />
          {momentMarks.map((ts, i) => (
            <View
              key={i}
              style={[
                styles.momentDot,
                {
                  left: `${(ts / duration) * 100}%`,
                  backgroundColor: colors.accent,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.1)" }]}
          onPress={() => {
            soundRef.current?.stopAsync();
            router.back();
          }}
        >
          <Feather name="skip-back" size={20} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: colors.primary }]}
          onPress={togglePlayPause}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <Feather name="loader" size={26} color="#FFF" />
          ) : (
            <Feather name={isPlaying ? "pause" : "play"} size={26} color="#FFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.1)" }]}
          onPress={showReactionOverlay}
        >
          <Feather name="flag" size={18} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.momentBtnWrapper, { transform: [{ scale: momentBtnScale }] }]}
      >
        <TouchableOpacity
          style={[
            styles.momentBtn,
            {
              backgroundColor: momentFlash
                ? colors.accent
                : colors.primary,
              paddingBottom: botPad + 12,
            },
          ]}
          onPress={handleMomentMark}
          activeOpacity={0.85}
        >
          <Feather name="zap" size={18} color="#FFF" />
          <Text style={styles.momentBtnText}>Mark this moment</Text>
          {momentMarks.length > 0 && (
            <View style={styles.momentCountPill}>
              <Text style={styles.momentCountPillText}>{momentMarks.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {showReaction && (
        <Animated.View
          style={[
            styles.reactionOverlay,
            { transform: [{ scale: reactionScale }] },
          ]}
        >
          <View
            style={[styles.reactionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={styles.reactionTitle}>
              What did you think?
            </Text>
            <Text style={[styles.reactionSong, { color: colors.mutedForeground }]}>
              {song.title} · {song.artist}
            </Text>
            {momentMarks.length > 0 && (
              <Text style={[styles.reactionMoments, { color: colors.mutedForeground }]}>
                You marked {momentMarks.length} moment{momentMarks.length !== 1 ? "s" : ""}
              </Text>
            )}
            <View style={styles.reactionBtns}>
              <TouchableOpacity
                style={[styles.discoveredBtn, { backgroundColor: colors.primary }]}
                onPress={handleDiscovered}
                activeOpacity={0.85}
              >
                <Feather name="star" size={18} color="#FFF" />
                <Text style={styles.reactionBtnText}>Discovered</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.skipBtn, { borderColor: colors.border, backgroundColor: colors.muted }]}
                onPress={handleSkip}
                activeOpacity={0.85}
              >
                <Feather name="x" size={18} color="#FFF" />
                <Text style={[styles.reactionBtnText, { color: colors.foreground }]}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  topBarCenter: {
    alignItems: "center",
  },
  preReleaseLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  daysLeft: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  coverArea: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  coverArt: {
    width: 260,
    height: 260,
    borderRadius: 20,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 12,
  },
  momentCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  momentCountText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  songInfo: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  songTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  songArtist: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "500",
  },
  lyricsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  lyricsTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  lyricsArtist: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginBottom: 20,
  },
  lyricsText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 24,
  },
  lyricsStory: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    lineHeight: 20,
    fontStyle: "italic",
    marginBottom: 40,
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    position: "relative",
    overflow: "visible",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  momentDot: {
    position: "absolute",
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: -5,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  momentBtnWrapper: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  momentBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  momentBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  momentCountPill: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  momentCountPillText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  reactionOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  reactionCard: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  reactionTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  reactionSong: {
    fontSize: 14,
    textAlign: "center",
  },
  reactionMoments: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 4,
  },
  reactionBtns: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  discoveredBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
  },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
  },
  reactionBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
