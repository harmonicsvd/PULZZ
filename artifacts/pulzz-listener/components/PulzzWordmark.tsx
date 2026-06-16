import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { FONT } from "@/constants/fonts";

interface PulzzWordmarkProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * The Pulzz wordmark. Renders as the plain "Pulzz" name (with a coral "zz"),
 * fading in once when it mounts and then staying completely static — no
 * looping or bouncing animation.
 */
export function PulzzWordmark({ size = 40, color, accentColor }: PulzzWordmarkProps) {
  const colors = useColors();
  const baseColor = color ?? colors.navy;
  const accent = accentColor ?? colors.coral;

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.Text
      accessibilityRole="header"
      accessibilityLabel="Pulzz"
      style={[
        styles.word,
        {
          fontSize: size,
          color: baseColor,
          opacity,
        },
      ]}
    >
      Pul<Animated.Text style={{ color: accent }}>zz</Animated.Text>
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  word: {
    fontFamily: FONT.extrabold,
    fontWeight: "800",
    letterSpacing: -1,
  },
});
