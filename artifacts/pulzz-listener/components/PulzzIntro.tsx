import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  type LayoutRectangle,
  StyleSheet,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { FONT } from "@/constants/fonts";

interface Letter {
  ch: string;
  accent: boolean;
}

const LETTERS: Letter[] = [
  { ch: "P", accent: false },
  { ch: "u", accent: false },
  { ch: "l", accent: false },
  { ch: "z", accent: true },
  { ch: "z", accent: true },
];

const STAGGER_MS = 75;

interface PulzzIntroProps {
  size?: number;
  onDone: () => void;
}

/**
 * Animated "Pulzz" launch intro. The letters start stacked on top of each
 * other in the centre of a cream screen, then spring outward to their final
 * positions to spell the wordmark (navy "Pul" + coral "zz"). Plays once on
 * launch, then calls `onDone`. Respects reduced-motion (quick fade fallback)
 * and works on native + Expo web.
 */
export function PulzzIntro({ size = 64, onDone }: PulzzIntroProps) {
  const colors = useColors();

  // One translateX + opacity pair per letter.
  const translateX = useRef(LETTERS.map(() => new Animated.Value(0))).current;
  const opacity = useRef(LETTERS.map(() => new Animated.Value(0))).current;

  const [rowWidth, setRowWidth] = useState<number | null>(null);
  const layoutsRef = useRef<(LayoutRectangle | null)[]>(
    LETTERS.map(() => null),
  );
  const [measuredCount, setMeasuredCount] = useState(0);

  const reduceMotionRef = useRef(false);
  const [reduceMotionResolved, setReduceMotionResolved] = useState(false);

  const startedRef = useRef(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  // Absolute guarantee the intro never traps the app: dismiss after a hard
  // ceiling no matter what the animation callbacks do. `finish` is idempotent.
  useEffect(() => {
    const t = setTimeout(finish, 2500);
    return () => clearTimeout(t);
  }, [finish]);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!active) return;
        reduceMotionRef.current = enabled;
        setReduceMotionResolved(true);
      })
      .catch(() => {
        if (!active) return;
        setReduceMotionResolved(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const onLetterLayout = useCallback((index: number, layout: LayoutRectangle) => {
    if (layoutsRef.current[index]) return;
    layoutsRef.current[index] = layout;
    setMeasuredCount((c) => c + 1);
  }, []);

  // Safety net: if measurement never completes (rare web layout quirk), fall
  // back to a plain fade so the app never gets stuck on the intro.
  useEffect(() => {
    const t = setTimeout(() => {
      if (startedRef.current) return;
      startedRef.current = true;
      Animated.parallel(
        opacity.map((o) =>
          Animated.timing(o, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
        ),
      ).start();
      setTimeout(finish, 500);
    }, 1200);
    return () => clearTimeout(t);
  }, [opacity, finish]);

  useEffect(() => {
    if (startedRef.current) return;
    if (!reduceMotionResolved) return;
    if (rowWidth == null) return;
    if (measuredCount < LETTERS.length) return;

    const layouts = layoutsRef.current;
    if (layouts.some((l) => l == null)) return;

    startedRef.current = true;
    const center = rowWidth / 2;

    if (reduceMotionRef.current) {
      // Reduced motion: keep letters in place, quick fade in.
      Animated.parallel(
        opacity.map((o) =>
          Animated.timing(o, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
          }),
        ),
      ).start(() => setTimeout(finish, 220));
      return;
    }

    // Collapse every letter toward the row centre so they stack overlapped,
    // then spring each one out to its natural position with a stagger.
    LETTERS.forEach((_, i) => {
      const l = layouts[i]!;
      const letterCenter = l.x + l.width / 2;
      translateX[i].setValue(center - letterCenter);
    });

    const anims = LETTERS.map((_, i) =>
      Animated.parallel([
        Animated.spring(translateX[i], {
          toValue: 0,
          delay: i * STAGGER_MS,
          tension: 60,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(opacity[i], {
          toValue: 1,
          delay: i * STAGGER_MS,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel(anims).start(({ finished }) => {
      if (finished) setTimeout(finish, 320);
      else finish();
    });
  }, [reduceMotionResolved, rowWidth, measuredCount, translateX, opacity, finish]);

  const cubeSize = Math.round(size * 0.82);
  const cubeDotSize = Math.round(size * 0.26);

  return (
    <View
      style={[styles.root, { backgroundColor: colors.background }]}
      accessibilityRole="image"
      accessibilityLabel="Pulzz"
    >
      <View style={styles.lockup}>
        <Animated.View
          style={[
            styles.cube,
            {
              width: cubeSize,
              height: cubeSize,
              borderRadius: Math.round(cubeSize * 0.26),
              backgroundColor: colors.coral,
              marginRight: Math.round(size * 0.18),
              opacity: opacity[0],
            },
          ]}
        >
          <View
            style={{
              width: cubeDotSize,
              height: cubeDotSize,
              borderRadius: cubeDotSize / 2,
              backgroundColor: colors.background,
            }}
          />
        </Animated.View>
        <View
          style={styles.row}
          onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
        >
          {LETTERS.map((l, i) => (
          <Animated.Text
            key={i}
            onLayout={(e) => onLetterLayout(i, e.nativeEvent.layout)}
            style={[
              styles.letter,
              {
                fontSize: size,
                color: l.accent ? colors.coral : colors.navy,
                opacity: opacity[i],
                transform: [{ translateX: translateX[i] }],
              },
            ]}
          >
            {l.ch}
          </Animated.Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  lockup: {
    flexDirection: "row",
    alignItems: "center",
  },
  cube: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  letter: {
    fontFamily: FONT.extrabold,
    fontWeight: "800",
    letterSpacing: -1,
  },
});
