import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1Problem } from './video_scenes/Scene1Problem';
import { Scene2Why } from './video_scenes/Scene2Why';
import { Scene3Listener } from './video_scenes/Scene3Listener';
import { Scene4Dashboard } from './video_scenes/Scene4Dashboard';
import { Scene5Features } from './video_scenes/Scene5Features';
import { Scene6Impact } from './video_scenes/Scene6Impact';

export const SCENE_DURATIONS = {
  problem: 10000,
  why: 10000,
  listener: 23000,
  dashboard: 24000,
  features: 17000,
  impact: 11000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  problem: Scene1Problem,
  why: Scene2Why,
  listener: Scene3Listener,
  dashboard: Scene4Dashboard,
  features: Scene5Features,
  impact: Scene6Impact,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A1122]">
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
