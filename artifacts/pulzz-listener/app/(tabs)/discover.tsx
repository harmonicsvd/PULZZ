import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SongCard } from "@/components/SongCard";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, listenedSongIds, songs } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const availableSongs = useMemo(() => {
    return songs.filter((s) => !listenedSongIds.includes(s.id));
  }, [songs, listenedSongIds]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.background },
        ]}
      >
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Hey {profile?.name ?? "there"} 👋
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Discovery Pool
          </Text>
        </View>
        <View style={[styles.poolBadge, { backgroundColor: colors.muted }]}>
          <Feather name="music" size={13} color={colors.primary} />
          <Text style={[styles.poolCount, { color: colors.primary }]}>
            {availableSongs.length} unheard
          </Text>
        </View>
      </View>

      <FlatList
        data={availableSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongCard
            song={item}
            hasListened={listenedSongIds.includes(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: botPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!availableSongs.length}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={40} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              You've heard them all
            </Text>
            <Text
              style={[styles.emptyDesc, { color: colors.mutedForeground }]}
            >
              New songs enter the pool every Friday. Come back soon.
            </Text>
          </View>
        }
        ListHeaderComponent={
          availableSongs.length > 0 ? (
            <View
              style={[styles.sectionHeader, { borderColor: colors.border }]}
            >
              <Feather name="radio" size={13} color={colors.mutedForeground} />
              <Text
                style={[styles.sectionLabel, { color: colors.mutedForeground }]}
              >
                {availableSongs.length} song{availableSongs.length !== 1 ? "s" : ""} available this week
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  poolBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  poolCount: {
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
