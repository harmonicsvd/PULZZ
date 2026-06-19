---
name: Smooth audio progress bar (expo-av)
description: How to make a playback progress bar move at 60fps when expo-av status callbacks are intermittent
---

# Smooth audio progress bar (expo-av)

`onPlaybackStatusUpdate` from `expo-av` fires only intermittently (default ~hundreds of ms; we tighten it with `setProgressUpdateIntervalAsync(250)`), so binding the progress fill directly to the `positionMillis` state makes the bar jump in visible steps.

**Approach that works:** drive the bar with a `requestAnimationFrame` loop that extrapolates the current position from a "position anchor".

- `posAnchor = { positionMillis, atTimestamp, isPlaying }` ref = last known truth.
- `estimatePosition()` = `isPlaying ? positionMillis + (Date.now() - atTimestamp) : positionMillis`.
- rAF loop (one `useEffect`, cancelled on unmount) computes the estimate each frame and calls `progressAnim.setValue(est/dur)`.
- Fill width and thumb left are `progressAnim.interpolate({inputRange:[0,1], outputRange:["0%","100%"]})`.
- Re-anchor in every control path: status callback, play/pause (freeze at `estimatePosition()` on pause), restart (anchor 0), seek (anchor target before the async `setPositionAsync`), and reset anchor + `progressAnim.setValue(0)` at the top of `loadAudio` so a song switch doesn't flash the previous track's progress.

**Why:** the status callback alone is too coarse for smooth motion; extrapolating from a wall-clock anchor gives 60fps without waiting for the next callback, and re-anchoring keeps it from drifting.

**How to apply:** layout props (`width`/`left` as `%`) cannot use the native driver — that's fine here because we call `Animated.Value.setValue()` every frame (no `Animated.timing`), which updates via direct manipulation without a React re-render, and works on React Native Web too. Don't try to add `useNativeDriver` to this animation.
