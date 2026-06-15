import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

export default function DiscoveriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { discoveries, momentMarks, getDiscoveryPoints } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function getDaysUntilRelease(releaseDate: string) {
    const diff = new Date(releaseDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  function getMomentCount(songId: string) {
    return momentMarks.filter((m) => m.songId === songId).length;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          My Discoveries
        </Text>
        <View style={[styles.pointsBadge, { backgroundColor: colors.muted }]}>
          <Feather name="star" size={13} color={colors.accent} />
          <Text style={[styles.pointsText, { color: colors.accent }]}>
            {getDiscoveryPoints()} pts
          </Text>
        </View>
      </View>

      {discoveries.length > 0 && (
        <View style={[styles.statsRow, { paddingHorizontal: 20 }]}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {discoveries.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Discovered
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {momentMarks.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Moments
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.foreground }]}>
              {getDiscoveryPoints()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Points
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={discoveries}
        keyExtractor={(item) => item.songId}
        renderItem={({ item }) => {
          const daysLeft = getDaysUntilRelease(item.releaseDate);
          const moments = getMomentCount(item.songId);
          const isReleased = daysLeft === 0;
          return (
            <View
              style={[
                styles.discoveryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <LinearGradient
                colors={item.coverGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.discoveryCover}
              >
                <Feather name="check" size={16} color="#FFF" />
              </LinearGradient>
              <View style={styles.discoveryInfo}>
                <Text
                  style={[styles.discoveryTitle, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {item.songTitle}
                </Text>
                <Text
                  style={[styles.discoveryArtist, { color: colors.mutedForeground }]}
                >
                  {item.artist}
                </Text>
                <View style={styles.discoveryMeta}>
                  {moments > 0 && (
                    <View style={styles.metaItem}>
                      <Feather name="zap" size={10} color={colors.primary} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        {moments} moment{moments !== 1 ? "s" : ""}
                      </Text>
                    </View>
                  )}
                  <View style={styles.metaItem}>
                    <Feather
                      name="clock"
                      size={10}
                      color={colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        {
                          color: isReleased
                            ? colors.accent
                            : colors.mutedForeground,
                        },
                      ]}
                    >
                      {isReleased
                        ? "Released!"
                        : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                    </Text>
                  </View>
                </View>
              </View>
              {isReleased ? (
                <TouchableOpacity
                  style={[
                    styles.streamBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  activeOpacity={0.8}
                >
                  <Feather name="external-link" size={13} color="#FFF" />
                  <Text style={styles.streamBtnText}>Stream</Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.pendingBadge,
                    { backgroundColor: colors.muted },
                  ]}
                >
                  <Feather name="bell" size={12} color={colors.mutedForeground} />
                </View>
              )}
            </View>
          );
        }}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: botPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!discoveries.length}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="headphones" size={40} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nothing discovered yet
            </Text>
            <Text
              style={[styles.emptyDesc, { color: colors.mutedForeground }]}
            >
              Listen to songs in the Discovery Pool and tap Discovered to start
              building your collection.
            </Text>
          </View>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  discoveryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  discoveryCover: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  discoveryInfo: {
    flex: 1,
  },
  discoveryTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  discoveryArtist: {
    fontSize: 12,
    marginTop: 2,
  },
  discoveryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
  },
  streamBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  streamBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  pendingBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
