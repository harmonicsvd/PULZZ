import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";

interface CoverArtProps {
  artworkUrl?: string;
  gradient: [string, string];
  style?: StyleProp<ViewStyle>;
  radius?: number;
  children?: React.ReactNode;
}

export function CoverArt({
  artworkUrl,
  gradient,
  style,
  radius = 0,
  children,
}: CoverArtProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!artworkUrl && !failed;

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
    >
      {showImage && (
        <Image
          source={{ uri: artworkUrl }}
          style={[
            { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
            { borderRadius: radius },
          ]}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      )}
      <View style={{ flex: 1 }}>{children}</View>
    </LinearGradient>
  );
}
