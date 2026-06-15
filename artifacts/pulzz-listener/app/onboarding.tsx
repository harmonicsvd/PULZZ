import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
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

const GENRES = [
  { id: "pop", label: "Pop", icon: "music" },
  { id: "hiphop", label: "Hip-Hop", icon: "headphones" },
  { id: "rnb", label: "R&B", icon: "heart" },
  { id: "electronic", label: "Electronic", icon: "zap" },
  { id: "indie", label: "Indie", icon: "star" },
  { id: "alternative", label: "Alternative", icon: "compass" },
  { id: "jazz", label: "Jazz", icon: "coffee" },
  { id: "classical", label: "Classical", icon: "feather" },
];

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
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [personality, setPersonality] = useState<
    "explorer" | "balanced" | "familiar" | null
  >(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function animateStep(next: number) {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => setStep(next), 150);
  }

  function toggleGenre(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  async function finish() {
    if (!personality || !name.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveProfile({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      genres: selectedGenres,
      discoveryPersonality: personality,
      createdAt: new Date().toISOString(),
    });
    router.replace("/(tabs)/discover");
  }

  const canProceed =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && selectedGenres.length > 0) ||
    (step === 2 && personality !== null);

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
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  i <= step ? colors.primary : colors.muted,
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
              Discover music before anyone else. Be the first to hear what's
              next.
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
            <ScrollView
              style={styles.genreScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.genreGrid}>
                {GENRES.map((g) => {
                  const selected = selectedGenres.includes(g.id);
                  return (
                    <Pressable
                      key={g.id}
                      style={[
                        styles.genreChip,
                        {
                          backgroundColor: selected
                            ? colors.primary
                            : colors.card,
                          borderColor: selected
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                      onPress={() => toggleGenre(g.id)}
                    >
                      <Feather
                        name={g.icon as any}
                        size={16}
                        color={selected ? "#FFF" : colors.mutedForeground}
                      />
                      <Text
                        style={[
                          styles.genreChipLabel,
                          {
                            color: selected ? "#FFF" : colors.foreground,
                          },
                        ]}
                      >
                        {g.label}
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
                        backgroundColor: selected
                          ? colors.primary + "22"
                          : colors.card,
                        borderColor: selected
                          ? colors.primary
                          : colors.border,
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
                        {
                          backgroundColor: selected
                            ? colors.primary
                            : colors.muted,
                        },
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
                          {
                            color: selected
                              ? colors.primary
                              : colors.foreground,
                          },
                        ]}
                      >
                        {p.label}
                      </Text>
                      <Text
                        style={[
                          styles.personalityDesc,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {p.desc}
                      </Text>
                    </View>
                    {selected && (
                      <Feather
                        name="check-circle"
                        size={20}
                        color={colors.primary}
                      />
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
          disabled={!canProceed}
          onPress={() => {
            if (step < 2) animateStep(step + 1);
            else finish();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step < 2 ? "Continue" : `Let's go, ${name} →`}
          </Text>
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
