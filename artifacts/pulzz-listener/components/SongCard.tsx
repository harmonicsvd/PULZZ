import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CoverArt } from "@/components/CoverArt";
import { fontFor } from "@/constants/fonts";
import { useColors } from "@/hooks/useColors";
import type { DemoSong } from "@/data/songs";

interface SongCardProps {
  song: DemoSong;
  hasListened?: boolean;
}

export function SongCard({ song, hasListened }: SongCardProps) {
  const colors = useColors();

  function formatDaysLeft(days: number) {
    if (days === 0) return "releases today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  }

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/listen/${song.id}`)}
      android_ripple={{ color: colors.border }}
    >
      <CoverArt
        artworkUrl={song.artworkUrl}
        gradient={song.coverGradient}
        style={styles.cover}
      >
        <View style={styles.preReleaseTag}>
          <Text style={styles.preReleaseText}>PRE-RELEASE</Text>
        </View>
        {hasListened && (
          <View style={[styles.listenedBadge, { backgroundColor: colors.discovered }]}>
            <Feather name="check" size={10} color="#FFF" />
          </View>
        )}
      </CoverArt>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {song.title}
          </Text>
          <View style={[styles.daysTag, { backgroundColor: colors.muted }]}>
            <Feather name="clock" size={10} color={colors.mutedForeground} />
            <Text style={[styles.daysText, { color: colors.mutedForeground }]}>
              {formatDaysLeft(song.daysUntilRelease)}
            </Text>
          </View>
        </View>

        <Text style={[styles.artist, { color: colors.mutedForeground }]}>
          {song.artist}
        </Text>

        <View style={styles.tagsRow}>
          <View style={[styles.genreTag, { backgroundColor: colors.muted }]}>
            <Text style={[styles.genreText, { color: colors.mutedForeground }]}>
              {song.genre}
            </Text>
          </View>
          {song.tags.slice(0, 2).map((tag) => (
            <View
              key={tag}
              style={[styles.genreTag, { backgroundColor: colors.muted }]}
            >
              <Text style={[styles.genreText, { color: colors.mutedForeground }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.matchReason, { color: colors.primary }]}>
            <Feather name="zap" size={11} color={colors.primary} />{" "}
            {song.matchReason}
          </Text>
          <TouchableOpacity
            style={[styles.listenBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/listen/${song.id}`)}
            activeOpacity={0.8}
          >
            <Feather name="play" size={14} color="#FFF" />
            <Text style={styles.listenBtnText}>Listen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#1B2A4A",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cover: {
    width: 110,
    height: 138,
    position: "relative",
  },
  preReleaseTag: {
    position: "absolute",
    top: 8,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  preReleaseText: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: "700",
    fontFamily: fontFor("700"),
    letterSpacing: 0.5,
  },
  listenedBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: fontFor("700"),
    flex: 1,
  },
  daysTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  daysText: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: fontFor("600"),
  },
  artist: {
    fontSize: 13,
    fontFamily: fontFor("400"),
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  genreTag: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  genreText: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: fontFor("500"),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  matchReason: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: fontFor("600"),
    flex: 1,
  },
  listenBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  listenBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: fontFor("700"),
  },
});
