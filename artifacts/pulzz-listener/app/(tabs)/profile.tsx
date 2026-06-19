import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandHeader } from "@/components/BrandHeader";
import { fontFor } from "@/constants/fonts";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    profile,
    discoveries,
    momentMarks,
    getDiscoveryPoints,
    releaseNotificationsEnabled,
    setReleaseNotificationsEnabled,
  } = useApp();
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const personalityInfo = {
    explorer: {
      label: "Explorer",
      desc: "You love finding music no one knows yet",
      icon: "compass" as const,
    },
    balanced: {
      label: "Balanced",
      desc: "You mix familiar vibes with new sounds",
      icon: "sliders" as const,
    },
    familiar: {
      label: "Familiar",
      desc: "You keep it close to what you already love",
      icon: "bookmark" as const,
    },
  };

  async function resetOnboarding() {
    Alert.alert(
      "Reset Profile",
      "This will clear your profile and all discoveries. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await AsyncStorage.multiRemove([
              "pulzz_profile",
              "pulzz_discoveries",
              "pulzz_moment_marks",
              "pulzz_listened",
            ]);
            router.replace("/onboarding");
          },
        },
      ]
    );
  }

  if (!profile) return null;

  const info = personalityInfo[profile.discoveryPersonality];
  const points = getDiscoveryPoints();
  const momentCount = momentMarks.length;
  const discoveredArtists = Array.from(
    new Set(discoveries.map((d) => d.artist).filter(Boolean))
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BrandHeader />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: botPad + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: 4 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
        </View>

      <View style={styles.avatarSection}>
        <View
          style={[styles.avatarCircle, { backgroundColor: colors.primary + "33" }]}
        >
          <Text style={[styles.avatarInitial, { color: colors.primary }]}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.profileName, { color: colors.foreground }]}>
          {profile.name}
        </Text>
        <View
          style={[
            styles.personalityPill,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Feather name={info.icon} size={12} color={colors.primary} />
          <Text style={[styles.personalityLabel, { color: colors.primary }]}>
            {info.label}
          </Text>
        </View>
        <Text
          style={[styles.personalityDesc, { color: colors.mutedForeground }]}
        >
          {info.desc}
        </Text>
      </View>

      <View style={[styles.statsGrid, { paddingHorizontal: 20 }]}>
        <View
          style={[
            styles.statTile,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {discoveries.length}
          </Text>
          <Text style={[styles.statName, { color: colors.mutedForeground }]}>
            Discovered
          </Text>
        </View>
        <View
          style={[
            styles.statTile,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {points.toLocaleString()}
          </Text>
          <Text style={[styles.statName, { color: colors.mutedForeground }]}>
            Points
          </Text>
        </View>
        <View
          style={[
            styles.statTile,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {momentCount}
          </Text>
          <Text style={[styles.statName, { color: colors.mutedForeground }]}>
            Moments
          </Text>
        </View>
      </View>

      {discoveredArtists.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            ARTISTS DISCOVERED
          </Text>
          <View style={styles.genresList}>
            {discoveredArtists.map((artist) => (
              <View
                key={artist}
                style={[
                  styles.artistPill,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.artistAvatar,
                    { backgroundColor: colors.primary + "26" },
                  ]}
                >
                  <Text style={[styles.artistInitial, { color: colors.primary }]}>
                    {artist.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[styles.artistName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {artist}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {profile.genres.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            GENRES
          </Text>
          <View style={styles.genresList}>
            {profile.genres.map((g) => (
              <View
                key={g}
                style={[
                  styles.genrePill,
                  { backgroundColor: colors.muted, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[styles.genrePillText, { color: colors.foreground }]}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          NOTIFICATIONS
        </Text>
        <View
          style={[
            styles.toggleCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.toggleIcon,
              { backgroundColor: colors.primary + "1F" },
            ]}
          >
            <Feather name="bell" size={16} color={colors.primary} />
          </View>
          <View style={styles.toggleInfo}>
            <Text style={[styles.toggleTitle, { color: colors.foreground }]}>
              Release-day alerts
            </Text>
            <Text
              style={[styles.toggleDesc, { color: colors.mutedForeground }]}
            >
              Get pinged when a song you discovered drops
            </Text>
          </View>
          <Switch
            value={releaseNotificationsEnabled}
            onValueChange={setReleaseNotificationsEnabled}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          ABOUT PULZZ
        </Text>
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Pulzz is a pre-release music discovery platform. Discover songs
            before they release and build your reputation as an early listener.
          </Text>
          <Text
            style={[styles.infoText, { color: colors.mutedForeground, marginTop: 8 }]}
          >
            Built for Musicathon 2026 · Powered by Musixmatch
          </Text>
        </View>
      </View>

      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <TouchableOpacity
          style={[
            styles.resetBtn,
            { borderColor: colors.destructive + "55" },
          ]}
          onPress={resetOnboarding}
          activeOpacity={0.8}
        >
          <Feather name="trash-2" size={15} color={colors.destructive} />
          <Text style={[styles.resetBtnText, { color: colors.destructive }]}>
            Reset Profile
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    letterSpacing: -0.5,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: "800",
    fontFamily: fontFor("800"),
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: fontFor("800"),
    marginBottom: 8,
  },
  personalityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 6,
  },
  personalityLabel: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: fontFor("700"),
  },
  personalityDesc: {
    fontSize: 13,
    fontFamily: fontFor("400"),
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  statTile: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    alignItems: "center",
    shadowColor: "#1B2A4A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: fontFor("800"),
  },
  statName: {
    fontSize: 12,
    fontFamily: fontFor("400"),
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: fontFor("700"),
    letterSpacing: 1,
    marginBottom: 10,
  },
  genresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genrePill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  genrePillText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: fontFor("600"),
  },
  artistPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 24,
    paddingLeft: 6,
    paddingRight: 14,
    paddingVertical: 5,
    maxWidth: "100%",
  },
  artistAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  artistInitial: {
    fontSize: 13,
    fontWeight: "800",
    fontFamily: fontFor("800"),
  },
  artistName: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: fontFor("600"),
    flexShrink: 1,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: fontFor("700"),
  },
  toggleDesc: {
    fontSize: 12,
    fontFamily: fontFor("400"),
    marginTop: 2,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  infoText: {
    fontSize: 13,
    fontFamily: fontFor("400"),
    lineHeight: 19,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: fontFor("600"),
  },
});
