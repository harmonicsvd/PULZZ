import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface PulzzWordmarkProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const LETTERS = ["P", "U", "L", "Z", "Z"];

export function PulzzWordmark({ size = 40, color, accentColor }: PulzzWordmarkProps) {
  const colors = useColors();
  const baseColor = color ?? colors.navy;
  const pulse = accentColor ?? colors.amber;

  const anims = useRef(LETTERS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = anims.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 130),
          Animated.timing(v, {
            toValue: 1,
            duration: 380,
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 380,
            useNativeDriver: true,
          }),
          Animated.delay((LETTERS.length - i) * 130 + 600),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [anims]);

  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="Pulzz">
      {LETTERS.map((ch, i) => {
        const translateY = anims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -size * 0.16],
        });
        const animatedColor = anims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [baseColor, pulse],
        });
        return (
          <Animated.Text
            key={`${ch}-${i}`}
            style={[
              styles.letter,
              {
                fontSize: size,
                color: animatedColor,
                transform: [{ translateY }],
              },
            ]}
          >
            {ch}
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  letter: {
    fontWeight: "900",
    letterSpacing: -1,
  },
});
