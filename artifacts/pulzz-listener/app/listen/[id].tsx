import { Feather } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CoverArt } from "@/components/CoverArt";
import { PulzzWordmark } from "@/components/PulzzWordmark";
import { fontFor } from "@/constants/fonts";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";
import { api, apiSongDetailToDemoSong } from "@/lib/api";
import type { DemoSong } from "@/data/songs";

const { height: SCREEN_H } = Dimensions.get("window");

type Sheet = "none" | "lyrics" | "artist";

export default function ListenScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { songs, markDiscovered, markSkip, addMomentMark } = useApp();

  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const botPad = Platform.OS === "web" ? 24 : insets.bottom;

  const baseSong = songs.find((s) => s.id === id);
  const [song, setSong] = useState<DemoSong | null>(baseSong ?? null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [momentMarks, setMomentMarks] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [sheet, setSheet] = useState<Sheet>("none");
  const [reacted, setReacted] = useState(false);

  const momentBtnScale = useRef(new Animated.Value(1)).current;
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const storyAnim = useRef(new Animated.Value(0)).current;
  const waveWidth = useRef(0);

  // Smooth progress: the audio status callback only fires intermittently, so
  // we drive the bar with a requestAnimationFrame loop that estimates the
  // current position between callbacks. `posAnchor` is the last known truth
  // (position + the wall-clock time we learned it) and whether playback is
  // advancing; each frame extrapolates from it for buttery 60fps motion.
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(
    progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] })
  ).current;
  const durationRef = useRef(0);
  const posAnchor = useRef({ positionMillis: 0, atTimestamp: 0, isPlaying: false });

  // Wall-clock estimate of the current playback position (ms), extrapolated
  // from the last status callback when audio is advancing.
  const estimatePosition = useCallback(() => {
    const a = posAnchor.current;
    return a.isPlaying
      ? a.positionMillis + (Date.now() - a.atTimestamp)
      : a.positionMillis;
  }, []);

  // Re-anchor the smooth-progress estimate to a known position.
  const setAnchor = useCallback(
    (positionMillis: number, isPlaying: boolean) => {
      posAnchor.current = { positionMillis, atTimestamp: Date.now(), isPlaying };
    },
    []
  );

  // 60fps progress driver — runs for the life of the screen, holding still
  // while paused and extrapolating while playing.
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const dur = durationRef.current;
      const est = Math.max(0, Math.min(estimatePosition(), dur));
      progressAnim.setValue(dur > 0 ? est / dur : 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [estimatePosition, progressAnim]);
  const lyricScrollRef = useRef<ScrollView | null>(null);
  const lyricYs = useRef<Record<number, number>>({});
  const lyricHeights = useRef<Record<number, number>>({});
  const lyricViewportH = useRef(0);

  // Fetch detailed song (story, lyrics) from API
  useEffect(() => {
    if (!id) return;
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      api
        .fetchSongDetail(numericId)
        .then((detail) => setSong(apiSongDetailToDemoSong(detail)))
        .catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    if (baseSong) setSong(baseSong);
  }, [baseSong]);

  useEffect(() => {
    if (song) loadAudio();
    return () => {
      soundRef.current?.unloadAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song?.audioUrl]);

  // Listener-controlled lyrics: as the user swipes the lyric list, the line
  // nearest the viewport center is highlighted — no dependency on audio timing.
  const [centeredLyric, setCenteredLyric] = useState(0);

  // Re-measure lyrics from scratch whenever the song changes so stale line
  // positions from a previous track can't drive the highlight.
  useEffect(() => {
    lyricYs.current = {};
    lyricHeights.current = {};
    setCenteredLyric(0);
  }, [song?.id]);

  function onLyricsScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const scrollY = e.nativeEvent.contentOffset.y;
    const viewport = lyricViewportH.current || 360;
    const center = scrollY + viewport / 2;
    const keys = Object.keys(lyricYs.current);
    if (keys.length === 0) return;
    let firstTop = Infinity;
    let lastBottom = -Infinity;
    let best = 0;
    let bestDist = Infinity;
    for (const key of keys) {
      const i = Number(key);
      const top = lyricYs.current[i];
      const h = lyricHeights.current[i] ?? 0;
      firstTop = Math.min(firstTop, top);
      lastBottom = Math.max(lastBottom, top + h);
      const lineCenter = top + h / 2;
      const d = Math.abs(lineCenter - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    // Only follow while the lyrics block sits under the viewport center; once
    // the user scrolls down into SONG DETAILS, stop moving the highlight.
    if (center < firstTop || center > lastBottom) return;
    setCenteredLyric((prev) => (prev === best ? prev : best));
  }

  async function loadAudio() {
    if (!song) return;
    // Reset the smooth-progress estimate so a track switch never flashes the
    // previous song's position before the first status callback arrives.
    durationRef.current = 0;
    setAnchor(0, false);
    progressAnim.setValue(0);
    setPosition(0);
    setDuration(0);
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
      // Tighter status cadence keeps the time readout and the smooth-progress
      // anchor in close sync with real playback.
      await sound.setProgressUpdateIntervalAsync(250);
      setIsLoading(false);
      setIsPlaying(true);
    } catch {
      setIsLoading(false);
    }
  }

  function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) return;
    const pos = status.positionMillis ?? 0;
    const dur = status.durationMillis ?? (song?.durationSeconds ?? 0) * 1000;
    durationRef.current = dur;
    setAnchor(pos, status.isPlaying);
    setPosition(pos);
    setDuration(dur);
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) setFinished(true);
  }

  async function togglePlayPause() {
    if (!soundRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      // Freeze the estimate at the current spot immediately so the bar doesn't
      // keep creeping for a frame after the tap.
      setAnchor(estimatePosition(), false);
      await soundRef.current.pauseAsync();
    } else {
      setAnchor(estimatePosition(), true);
      await soundRef.current.playAsync();
    }
  }

  async function restart() {
    if (!soundRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnchor(0, true);
    await soundRef.current.setPositionAsync(0);
    await soundRef.current.playAsync();
  }

  async function seekTo(e: GestureResponderEvent) {
    if (!soundRef.current || !duration || waveWidth.current <= 0) return;
    const x = e.nativeEvent.locationX;
    const fraction = Math.max(0, Math.min(1, x / waveWidth.current));
    const target = fraction * duration;
    // Update the estimate first so the bar jumps to the tapped spot instantly,
    // rather than waiting for the next status callback.
    setAnchor(target, posAnchor.current.isPlaying);
    setPosition(target);
    await soundRef.current.setPositionAsync(target);
  }

  async function handleMomentMark() {
    if (!song) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ts = position;
    setMomentMarks((prev) => [...prev, ts]);
    Animated.sequence([
      Animated.spring(momentBtnScale, {
        toValue: 0.85,
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
    if (!song || reacted) return;
    setReacted(true);
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
    if (!song || reacted) return;
    setReacted(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await soundRef.current?.stopAsync();
    await markSkip(song.id);
    router.back();
  }

  function close() {
    soundRef.current?.stopAsync();
    router.back();
  }

  const openStory = useCallback(() => {
    setStoryVisible(true);
    Animated.spring(storyAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 14,
    }).start();
  }, [storyAnim]);

  const closeStory = useCallback(() => {
    Animated.timing(storyAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setStoryVisible(false));
  }, [storyAnim]);

  const openSheet = useCallback(
    (which: Sheet) => {
      setSheet(which);
      Animated.timing(sheetAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    },
    [sheetAnim]
  );

  const closeSheet = useCallback(() => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setSheet("none"));
  }, [sheetAnim]);

  // Swipe up on the player → open lyrics sheet
  const playerPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dy < -18 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dy < -40) openSheet("lyrics");
      },
    })
  ).current;

  // Swipe down on the sheet handle → close
  const sheetPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 12,
      onPanResponderRelease: (_, g) => {
        if (g.dy > 50) closeSheet();
      },
    })
  ).current;

  function formatTime(ms: number) {
    const secs = Math.floor(ms / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (!song) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.foreground }}>Song not found</Text>
      </View>
    );
  }

  const lrcParsed = parseLrc(song.lrc);
  const lyricLines =
    lrcParsed.length > 0
      ? lrcParsed.map((l) => l.text)
      : song.lyrics
        ? song.lyrics.includes("\n")
          ? song.lyrics.split(/\n+/).map((l) => l.trim()).filter(Boolean)
          : song.lyrics.split(" / ").map((l) => l.trim()).filter(Boolean)
        : [];

  const sheetTranslate = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_H, 0],
  });

  const storyScale = storyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={close} hitSlop={8}>
          <Feather name="chevron-down" size={26} color={colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <PulzzWordmark size={16} />
          <Text
            style={[
              styles.preReleaseLabel,
              { color: colors.midBlue, marginTop: 4 },
            ]}
          >
            PRE-RELEASE
          </Text>
          <Text style={[styles.daysLeft, { color: colors.mutedForeground }]}>
            {song.daysUntilRelease} days until release
          </Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Player */}
      <View style={styles.playerBody} {...playerPan.panHandlers}>
        {/* Cover art */}
        <View style={styles.coverArea}>
          <CoverArt
            artworkUrl={song.artworkUrl}
            gradient={song.coverGradient}
            style={styles.coverArt}
          >
            {momentMarks.length > 0 && (
              <View style={styles.momentCountBadge}>
                <Feather name="zap" size={13} color={colors.amber} />
                <Text style={[styles.momentCountText, { color: colors.navy }]}>
                  {momentMarks.length}
                </Text>
              </View>
            )}
          </CoverArt>
        </View>

        {/* Title + tappable artist */}
        <View style={styles.titleBlock}>
          <Text style={[styles.songTitle, { color: colors.navy }]} numberOfLines={1}>
            {song.title}
          </Text>
          <TouchableOpacity
            style={styles.artistRow}
            onPress={() => openSheet("artist")}
            activeOpacity={0.7}
          >
            <Text style={[styles.songArtist, { color: colors.midBlue }]}>
              {song.artist}
            </Text>
            <Feather name="chevron-right" size={15} color={colors.midBlue} />
          </TouchableOpacity>

          {/* Behind the song → opens animated dialog */}
          {song.story ? (
            <TouchableOpacity
              style={[styles.storyCard, { backgroundColor: colors.blueGrey + "80" }]}
              onPress={openStory}
              activeOpacity={0.85}
            >
              <Text style={[styles.storyEyebrow, { color: colors.midBlue }]}>
                BEHIND THE SONG
              </Text>
              <Text
                style={[styles.storyText, { color: colors.navy }]}
                numberOfLines={2}
              >
                {song.story}
              </Text>
              <View style={styles.storyToggleRow}>
                <Text style={[styles.storyToggle, { color: colors.midBlue }]}>
                  Read the full story
                </Text>
                <Feather name="arrow-up-right" size={13} color={colors.midBlue} />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ flex: 1 }} />

        {/* Progress bar — standard track with fill, thumb, and moment markers */}
        <View style={styles.progressSection}>
          <Pressable
            style={styles.progressHit}
            onLayout={(e) => (waveWidth.current = e.nativeEvent.layout.width)}
            onPress={seekTo}
          >
            <View style={[styles.progressTrack, { backgroundColor: colors.blueGrey }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                    backgroundColor: colors.coral,
                  },
                ]}
              />

              {/* Moment markers along the track */}
              {duration > 0 &&
                momentMarks.map((ts, i) => (
                  <View
                    key={`${ts}-${i}`}
                    pointerEvents="none"
                    style={[
                      styles.momentMarker,
                      {
                        left: `${Math.min(99, (ts / duration) * 100)}%`,
                        backgroundColor: colors.amber,
                      },
                    ]}
                  />
                ))}
            </View>

            {/* Draggable-looking thumb at the current position */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.progressThumb,
                {
                  left: progressWidth,
                  backgroundColor: colors.coral,
                },
              ]}
            />
          </Pressable>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* Transport controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={restart} hitSlop={10} style={styles.sideBtn}>
            <Feather name="skip-back" size={26} color={colors.midBlue} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: colors.coral }]}
            onPress={togglePlayPause}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <Feather name="loader" size={28} color="#FFF" />
            ) : (
              <Feather name={isPlaying ? "pause" : "play"} size={28} color="#FFF" />
            )}
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: momentBtnScale }] }}>
            <TouchableOpacity
              style={[styles.momentBtn, { backgroundColor: colors.amber }]}
              onPress={handleMomentMark}
              activeOpacity={0.85}
            >
              <Feather name="zap" size={20} color="#FFF" />
              {momentMarks.length > 0 && (
                <View style={styles.momentBtnBadge}>
                  <Text style={[styles.momentBtnBadgeText, { color: colors.amber }]}>
                    {momentMarks.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Reactions — locked until the song finishes */}
        {finished ? (
          <View style={styles.reactionRow}>
            <TouchableOpacity
              style={[styles.discoveredBtn, { backgroundColor: colors.blueGrey }]}
              onPress={handleDiscovered}
              activeOpacity={0.85}
            >
              <Feather name="star" size={18} color={colors.midBlue} />
              <Text style={[styles.discoveredText, { color: colors.midBlue }]}>
                Discovered
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.skipBtn, { borderColor: colors.blueGrey }]}
              onPress={handleSkip}
              activeOpacity={0.85}
            >
              <Feather name="x" size={18} color={colors.mutedForeground} />
              <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.lockedBtn,
              { borderColor: colors.navy + "26", backgroundColor: colors.navy + "08" },
            ]}
          >
            <Feather name="lock" size={14} color={colors.mutedForeground} />
            <Text style={[styles.lockedText, { color: colors.mutedForeground }]}>
              Finish the song to react
            </Text>
          </View>
        )}

        {/* Grab handle → lyrics & details (no caption) */}
        <TouchableOpacity
          style={styles.grabHandleArea}
          onPress={() => openSheet("lyrics")}
          activeOpacity={0.6}
        >
          <View style={[styles.grabHandle, { backgroundColor: colors.navy + "26" }]} />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      {sheet !== "none" && (
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingTop: topPad,
              transform: [{ translateY: sheetTranslate }],
            },
          ]}
        >
          <View {...sheetPan.panHandlers}>
            <TouchableOpacity
              style={styles.sheetHandleArea}
              onPress={closeSheet}
              activeOpacity={0.6}
            >
              <View style={[styles.grabHandle, { backgroundColor: colors.navy + "26" }]} />
            </TouchableOpacity>
          </View>

          {sheet === "lyrics" ? (
            <ScrollView
              ref={lyricScrollRef}
              style={styles.sheetScroll}
              contentContainerStyle={{ paddingBottom: botPad + 24 }}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={onLyricsScroll}
              onLayout={(e) => {
                lyricViewportH.current = e.nativeEvent.layout.height;
              }}
            >
              <View style={styles.lyricsHeaderRow}>
                <Text style={[styles.sheetEyebrow, { color: colors.midBlue, marginBottom: 0 }]}>
                  LYRICS
                </Text>
                {lyricLines.length > 0 && (
                  <View style={[styles.syncedPill, { backgroundColor: colors.brightBlue + "1A" }]}>
                    <Feather name="chevrons-up" size={10} color={colors.brightBlue} />
                    <Text style={[styles.syncedPillText, { color: colors.brightBlue }]}>
                      SWIPE TO FOLLOW
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ height: 12 }} />

              {lyricLines.length > 0 ? (
                <>
                  <View style={{ height: 120 }} />
                  {lyricLines.map((line, i) => {
                    const isActive = i === centeredLyric;
                    return (
                      <Text
                        key={i}
                        onLayout={(e) => {
                          lyricYs.current[i] = e.nativeEvent.layout.y;
                          lyricHeights.current[i] = e.nativeEvent.layout.height;
                        }}
                        style={[
                          styles.followLine,
                          {
                            color: isActive ? colors.brightBlue : colors.navy,
                            opacity: isActive ? 1 : 0.3,
                            fontWeight: isActive ? "900" : "700",
                            fontFamily: fontFor(isActive ? "900" : "700"),
                          },
                        ]}
                      >
                        {line}
                      </Text>
                    );
                  })}
                  <View style={{ height: 200 }} />
                </>
              ) : (
                <Text style={[styles.lyricLine, { color: colors.mutedForeground }]}>
                  Instrumental
                </Text>
              )}

              <View style={[styles.divider, { backgroundColor: colors.navy + "12" }]} />

              <Text style={[styles.sheetEyebrow, { color: colors.midBlue }]}>
                SONG DETAILS
              </Text>
              <View style={styles.detailsGrid}>
                <Detail label="Genre" value={song.genre} colors={colors} />
                <Detail label="Length" value={formatTime(song.durationSeconds * 1000)} colors={colors} />
                {song.bpm > 0 && (
                  <Detail label="Tempo" value={`${song.bpm} BPM`} colors={colors} />
                )}
                <Detail
                  label="Releases"
                  value={new Date(song.releaseDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  colors={colors}
                />
              </View>

              {song.instruments.length > 0 && (
                <View style={[styles.creditsCard, { backgroundColor: colors.blueGrey + "80" }]}>
                  <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>
                    INSTRUMENTS
                  </Text>
                  <Text style={[styles.creditsText, { color: colors.navy }]}>
                    {song.instruments
                      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(" · ")}
                  </Text>
                </View>
              )}

              {song.credits && hasCredits(song.credits) && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.navy + "12" }]} />
                  <Text style={[styles.sheetEyebrow, { color: colors.midBlue }]}>
                    CREDITS
                  </Text>
                  <View style={[styles.creditsCard, { backgroundColor: colors.blueGrey + "80", gap: 10 }]}>
                    {creditRows(song.credits).map((row) => (
                      <View key={row.label} style={styles.creditRow}>
                        <Text style={[styles.creditRole, { color: colors.mutedForeground }]}>
                          {row.label}
                        </Text>
                        <Text style={[styles.creditName, { color: colors.navy }]}>
                          {row.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.sheetScroll}
              contentContainerStyle={{ paddingBottom: botPad + 24 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.artistHeader}>
                <LinearGradient
                  colors={[colors.amber, colors.midBlue]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.artistAvatar}
                />
                <Text style={[styles.artistName, { color: colors.navy }]}>
                  {song.artist}
                </Text>
                <View style={[styles.artistGenrePill, { backgroundColor: colors.blueGrey + "B0" }]}>
                  <Text style={[styles.artistGenreText, { color: colors.midBlue }]}>
                    {song.genre}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.followBtn, { backgroundColor: colors.navy }]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.followBtnText}>Follow</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sheetEyebrow, { color: colors.midBlue }]}>
                ABOUT
              </Text>
              <Text style={[styles.aboutText, { color: colors.navy }]}>
                {song.artist} has {song.title} in the Pulzz discovery pool — an
                unreleased {song.genre.toLowerCase()} track you're hearing before
                release day. Mark the moments that move you and be among the first
                to discover it.
              </Text>

              {song.tags.length > 0 && (
                <>
                  <View style={{ height: 18 }} />
                  <Text style={[styles.sheetEyebrow, { color: colors.midBlue }]}>
                    MOOD
                  </Text>
                  <View style={styles.tagWrap}>
                    {song.tags.map((t) => (
                      <View
                        key={t}
                        style={[styles.moodTag, { backgroundColor: colors.blueGrey + "80" }]}
                      >
                        <Text style={[styles.moodTagText, { color: colors.navy }]}>
                          {t}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          )}
        </Animated.View>
      )}

      {/* Behind the song — animated dialog */}
      <Modal
        visible={storyVisible}
        transparent
        animationType="none"
        onRequestClose={closeStory}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeStory}>
          <Animated.View
            style={[
              styles.storyDialog,
              {
                backgroundColor: colors.card,
                opacity: storyAnim,
                transform: [{ scale: storyScale }],
              },
            ]}
          >
            <Pressable>
              <View style={styles.storyDialogHandle}>
                <View
                  style={[styles.storyDialogIcon, { backgroundColor: colors.midBlue + "1A" }]}
                >
                  <Feather name="feather" size={18} color={colors.midBlue} />
                </View>
                <TouchableOpacity onPress={closeStory} hitSlop={10}>
                  <Feather name="x" size={22} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.storyDialogEyebrow, { color: colors.midBlue }]}>
                BEHIND THE SONG
              </Text>
              <Text style={[styles.storyDialogTitle, { color: colors.navy }]}>
                {song.title}
              </Text>
              <Text style={[styles.storyDialogArtist, { color: colors.mutedForeground }]}>
                {song.artist}
              </Text>
              <ScrollView
                style={{ maxHeight: SCREEN_H * 0.4 }}
                showsVerticalScrollIndicator={false}
              >
                <Text style={[styles.storyDialogBody, { color: colors.navy }]}>
                  {song.story}
                </Text>
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

interface LrcLine {
  timeMs: number;
  text: string;
}

function parseLrc(lrc?: string): LrcLine[] {
  if (!lrc) return [];
  const out: LrcLine[] = [];
  for (const raw of lrc.split(/\r?\n/)) {
    const m = raw.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
    if (!m) continue;
    const min = parseInt(m[1], 10);
    const sec = parseFloat(m[2]);
    const text = m[3].trim();
    if (!text) continue;
    out.push({ timeMs: (min * 60 + sec) * 1000, text });
  }
  return out;
}

function hasCredits(c: NonNullable<DemoSong["credits"]>): boolean {
  return Boolean(
    c.lyricist || c.composer || c.vocalist || c.mixEngineer || c.producer
  );
}

function creditRows(
  c: NonNullable<DemoSong["credits"]>
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  if (c.lyricist) rows.push({ label: "Lyrics", value: c.lyricist });
  if (c.composer) rows.push({ label: "Composer", value: c.composer });
  if (c.vocalist) rows.push({ label: "Vocals", value: c.vocalist });
  if (c.producer) rows.push({ label: "Producer", value: c.producer });
  if (c.mixEngineer) rows.push({ label: "Mix Engineer", value: c.mixEngineer });
  return rows;
}

function Detail({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>
        {label.toUpperCase()}
      </Text>
      <Text style={[styles.detailValue, { color: colors.navy }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { alignItems: "center" },
  preReleaseLabel: {
    fontSize: 10,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    letterSpacing: 2,
  },
  daysLeft: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: fontFor("600"),
    marginTop: 2,
  },
  playerBody: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  coverArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  coverArt: {
    width: 226,
    height: 226,
    borderRadius: 32,
    alignItems: "flex-end",
    padding: 14,
    shadowColor: "#3E5C99",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  momentCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  momentCountText: { fontSize: 14, fontWeight: "800", fontFamily: fontFor("800") },
  titleBlock: { alignItems: "center" },
  songTitle: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    letterSpacing: -0.6,
    textAlign: "center",
  },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
    marginBottom: 12,
  },
  songArtist: { fontSize: 16, fontWeight: "700", fontFamily: fontFor("700") },
  storyCard: {
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  storyEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  storyText: { fontSize: 12.5, fontWeight: "500", fontFamily: fontFor("500"), lineHeight: 19 },
  storyToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },
  storyToggle: { fontSize: 11, fontWeight: "700", fontFamily: fontFor("700") },
  progressSection: { marginBottom: 16 },
  progressHit: {
    paddingVertical: 10,
    justifyContent: "center",
    position: "relative",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressThumb: {
    position: "absolute",
    top: "50%",
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    marginTop: -8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  momentMarker: {
    position: "absolute",
    top: -3,
    height: 12,
    width: 2.5,
    borderRadius: 1.25,
    marginLeft: -1,
    opacity: 0.95,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: { fontSize: 12, fontWeight: "700", fontFamily: fontFor("700"), letterSpacing: 1 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    marginBottom: 16,
  },
  sideBtn: { padding: 4 },
  playBtn: {
    width: 66,
    height: 66,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF5C49",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  momentBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E8956B",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  momentBtnBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FFF",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  momentBtnBadgeText: { fontSize: 10, fontWeight: "900", fontFamily: fontFor("900") },
  reactionRow: { flexDirection: "row", gap: 12 },
  discoveredBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  discoveredText: { fontSize: 15, fontWeight: "800", fontFamily: fontFor("800") },
  skipBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  skipText: { fontSize: 15, fontWeight: "800", fontFamily: fontFor("800") },
  lockedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  lockedText: { fontSize: 13, fontWeight: "600", fontFamily: fontFor("600") },
  grabHandleArea: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 6,
  },
  grabHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 30,
  },
  sheetHandleArea: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  sheetScroll: { flex: 1, paddingHorizontal: 24 },
  sheetEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    letterSpacing: 1.8,
    marginBottom: 12,
  },
  lyricLine: { fontSize: 18, fontWeight: "700", fontFamily: fontFor("700"), lineHeight: 24 },
  lyricsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  syncedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  syncedPillText: { fontSize: 9, fontWeight: "900", fontFamily: fontFor("900"), letterSpacing: 1 },
  followLine: {
    fontSize: 22,
    lineHeight: 31,
    letterSpacing: -0.3,
    paddingVertical: 7,
  },
  creditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  creditRole: { fontSize: 12, fontWeight: "700", fontFamily: fontFor("700"), letterSpacing: 0.4 },
  creditName: { fontSize: 13, fontWeight: "800", fontFamily: fontFor("800") },
  divider: { height: 1, marginVertical: 20 },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  detailItem: { width: "50%", marginBottom: 14 },
  detailLabel: {
    fontSize: 10,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    letterSpacing: 1,
    marginBottom: 3,
  },
  detailValue: { fontSize: 14, fontWeight: "800", fontFamily: fontFor("800") },
  creditsCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  creditsText: { fontSize: 13, fontWeight: "600", fontFamily: fontFor("600"), lineHeight: 19, marginTop: 4 },
  artistHeader: { alignItems: "center", marginBottom: 22 },
  artistAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  artistName: { fontSize: 24, fontWeight: "800", fontFamily: fontFor("800"), letterSpacing: -0.4 },
  artistGenrePill: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  artistGenreText: { fontSize: 12, fontWeight: "800", fontFamily: fontFor("800") },
  followBtn: {
    marginTop: 14,
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 24,
  },
  followBtnText: { color: "#FFF", fontSize: 14, fontWeight: "800", fontFamily: fontFor("800") },
  aboutText: { fontSize: 14, fontWeight: "500", fontFamily: fontFor("500"), lineHeight: 22 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  moodTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  moodTagText: { fontSize: 13, fontWeight: "700", fontFamily: fontFor("700") },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 18, 30, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  storyDialog: {
    width: "100%",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#1B2A4A",
    shadowOpacity: 0.3,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  },
  storyDialogHandle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  storyDialogIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  storyDialogEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    letterSpacing: 1.8,
  },
  storyDialogTitle: {
    fontSize: 24,
    fontWeight: "900",
    fontFamily: fontFor("900"),
    letterSpacing: -0.5,
    marginTop: 4,
  },
  storyDialogArtist: { fontSize: 14, fontWeight: "700", fontFamily: fontFor("700"), marginBottom: 14 },
  storyDialogBody: { fontSize: 15, fontWeight: "500", fontFamily: fontFor("500"), lineHeight: 24 },
});
