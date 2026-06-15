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
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

interface WallUser {
  rank: number;
  name: string;
  discoveries: number;
  points: number;
  isYou: boolean;
  personality: string;
  badges: string[];
}

const MOCK_WALL: Omit<WallUser, "isYou">[] = [
  { rank: 1, name: "Sofia R.", discoveries: 47, points: 8340, personality: "Explorer", badges: ["🏆", "⚡"] },
  { rank: 2, name: "Marcus T.", discoveries: 39, points: 6820, personality: "Explorer", badges: ["🎯"] },
  { rank: 3, name: "Aisha M.", discoveries: 31, points: 5410, personality: "Balanced", badges: ["🌟"] },
  { rank: 4, name: "Leo K.", discoveries: 28, points: 4890, personality: "Explorer", badges: [] },
  { rank: 5, name: "Priya N.", discoveries: 24, points: 4100, personality: "Balanced", badges: [] },
  { rank: 6, name: "Jake W.", discoveries: 19, points: 3200, personality: "Familiar", badges: [] },
  { rank: 7, name: "Yuna C.", discoveries: 15, points: 2650, personality: "Explorer", badges: [] },
];

export default function WallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, discoveries, getDiscoveryPoints } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const wallData = useMemo((): WallUser[] => {
    const myPoints = getDiscoveryPoints();
    const myDiscoveries = discoveries.length;

    if (!profile) return MOCK_WALL.map((u) => ({ ...u, isYou: false }));

    const myEntry: WallUser = {
      rank: 0,
      name: `${profile.name} (You)`,
      discoveries: myDiscoveries,
      points: myPoints,
      isYou: true,
      personality: profile.discoveryPersonality,
      badges: myDiscoveries >= 5 ? ["⚡"] : [],
    };

    const combined: WallUser[] = [
      ...MOCK_WALL.map((u) => ({ ...u, isYou: false })),
      myEntry,
    ]
      .sort((a, b) => b.points - a.points)
      .map((u, i) => ({ ...u, rank: i + 1 }));

    return combined;
  }, [profile, discoveries, getDiscoveryPoints]);

  const myEntry = wallData.find((u) => u.isYou);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Discovery Wall
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Top early listeners this week
        </Text>
      </View>

      {myEntry && (
        <View
          style={[
            styles.myRankBanner,
            {
              backgroundColor: colors.primary + "22",
              borderColor: colors.primary,
              marginHorizontal: 16,
              marginBottom: 12,
            },
          ]}
        >
          <Text style={[styles.myRankLabel, { color: colors.mutedForeground }]}>
            Your rank
          </Text>
          <Text style={[styles.myRankNumber, { color: colors.primary }]}>
            #{myEntry.rank}
          </Text>
          <Text style={[styles.myRankPoints, { color: colors.mutedForeground }]}>
            {myEntry.points} pts · {myEntry.discoveries} discovered
          </Text>
        </View>
      )}

      <FlatList
        data={wallData}
        keyExtractor={(item) => `${item.rank}-${item.name}`}
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              {
                backgroundColor: item.isYou
                  ? colors.primary + "15"
                  : colors.card,
                borderColor: item.isYou ? colors.primary : colors.border,
              },
            ]}
          >
            <View style={styles.rankCol}>
              {item.rank <= 3 ? (
                <Text style={styles.topRankEmoji}>
                  {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : "🥉"}
                </Text>
              ) : (
                <Text style={[styles.rankNum, { color: colors.mutedForeground }]}>
                  {item.rank}
                </Text>
              )}
            </View>

            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: item.isYou ? colors.primary : colors.muted,
                },
              ]}
            >
              <Feather
                name="user"
                size={15}
                color={item.isYou ? "#FFF" : colors.mutedForeground}
              />
            </View>

            <View style={styles.nameCol}>
              <Text
                style={[
                  styles.userName,
                  { color: item.isYou ? colors.primary : colors.foreground },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[styles.personalityText, { color: colors.mutedForeground }]}
              >
                {typeof item.personality === "string"
                  ? item.personality.charAt(0).toUpperCase() +
                    item.personality.slice(1)
                  : item.personality}{" "}
                · {item.discoveries} songs
              </Text>
            </View>

            <View style={styles.rightCol}>
              <Text style={[styles.pointsNum, { color: colors.foreground }]}>
                {item.points.toLocaleString()}
              </Text>
              <Text style={[styles.pointsLabel, { color: colors.mutedForeground }]}>
                pts
              </Text>
              {item.badges.length > 0 && (
                <Text style={styles.badges}>{item.badges.join("")}</Text>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: botPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  myRankBanner: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  myRankLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  myRankNumber: {
    fontSize: 20,
    fontWeight: "800",
    flex: 1,
  },
  myRankPoints: {
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    shadowColor: "#1B2A4A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  rankCol: {
    width: 28,
    alignItems: "center",
  },
  topRankEmoji: {
    fontSize: 20,
  },
  rankNum: {
    fontSize: 14,
    fontWeight: "700",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  nameCol: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
  },
  personalityText: {
    fontSize: 11,
    marginTop: 2,
  },
  rightCol: {
    alignItems: "flex-end",
  },
  pointsNum: {
    fontSize: 15,
    fontWeight: "800",
  },
  pointsLabel: {
    fontSize: 10,
  },
  badges: {
    fontSize: 12,
    marginTop: 2,
  },
});
