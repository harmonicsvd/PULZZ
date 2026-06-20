// Video player hook - handles recording lifecycle, scene advancement, and looping

import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    startRecording?: () => Promise<void>;
    stopRecording?: () => void;
  }
}

export interface SceneDurations {
  [key: string]: number;
}

export interface UseVideoPlayerOptions {
  durations: SceneDurations;
  onVideoEnd?: () => void;
  loop?: boolean;
}

export interface UseVideoPlayerReturn {
  currentScene: number;
  totalScenes: number;
  currentSceneKey: string;
  hasEnded: boolean;
  paused: boolean;
  jumpToScene: (index: number) => void;
  togglePause: () => void;
}

export function useVideoPlayer(options: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const { durations, onVideoEnd, loop = true } = options;

  // Captured once on mount -- durations must be a static object
  const sceneKeys = useRef(Object.keys(durations)).current;
  const totalScenes = sceneKeys.length;
  const durationsArray = useRef(Object.values(durations)).current;

  const [currentScene, setCurrentScene] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [paused, setPaused] = useState(false);

  const jumpToScene = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, totalScenes - 1));
    setHasEnded(false);
    setPaused(false);
    setCurrentScene(clamped);
  }, [totalScenes]);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  // Start recording on mount
  useEffect(() => {
    window.startRecording?.();
  }, []);

  // Scene advancement — pauses when paused
  useEffect(() => {
    if (hasEnded && !loop) return;
    if (paused) return;

    const currentDuration = durationsArray[currentScene];

    const timer = setTimeout(() => {
      if (currentScene >= totalScenes - 1) {
        if (!hasEnded) {
          window.stopRecording?.();
          setHasEnded(true);
          onVideoEnd?.();
        }
        if (loop) {
          setCurrentScene(0);
        }
      } else {
        setCurrentScene(prev => prev + 1);
      }
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentScene, totalScenes, durationsArray, hasEnded, loop, onVideoEnd, paused]);

  return {
    currentScene,
    totalScenes,
    currentSceneKey: sceneKeys[currentScene],
    hasEnded,
    paused,
    jumpToScene,
    togglePause,
  };
}

export function useSceneTimer(events: Array<{ time: number; callback: () => void }>) {
  const firedRef = useRef<Set<number>>(new Set());
  const callbacksRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    callbacksRef.current = events.map(e => e.callback);
  }, [events]);

  const scheduleKey = events.map((event, i) => `${i}:${event.time}`).join('|');

  useEffect(() => {
    firedRef.current = new Set();

    const timers = events.map(({ time }, index) => {
      return setTimeout(() => {
        if (!firedRef.current.has(index)) {
          firedRef.current.add(index);
          callbacksRef.current[index]?.();
        }
      }, time);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [scheduleKey]);
}
