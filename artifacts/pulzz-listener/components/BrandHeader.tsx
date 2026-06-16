import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PulzzWordmark } from "@/components/PulzzWordmark";
import { useColors } from "@/hooks/useColors";

/**
 * A lightweight, consistent branded header bar shown at the top of every
 * screen. It owns the safe-area top spacing and renders the Pulzz wordmark
 * (navy "Pul" + coral "zz") left-aligned, so the app always feels on-brand.
 */
export function BrandHeader() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 18 : insets.top;

  return (
    <View
      style={[
        styles.bar,
        { paddingTop: topPad + 10, backgroundColor: colors.background },
      ]}
    >
      <PulzzWordmark size={22} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    alignItems: "flex-start",
  },
});
