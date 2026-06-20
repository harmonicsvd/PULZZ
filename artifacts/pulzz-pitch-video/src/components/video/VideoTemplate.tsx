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
  problem: 9000,
  why: 9000,
  listener: 26000,
  dashboard: 28000,
  features: 18000,
  impact: 14000
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  problem: Scene1Problem,
  why: Scene2Why,
  listener: Scene3Listener,
  dashboard: Scene4Dashboard,
  features: Scene5Features,
  impact: Scene6Impact
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
    <div className="relative w-full h-screen overflow-hidden bg-[#FBF8F2]">
      {/* Persistent background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(255,92,73,0.15), transparent 70%)' }}
          animate={{
            x: ['-20%', '40%', '-10%'],
            y: ['-20%', '30%', '-10%'],
            scale: [1, 1.2, 0.9],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(27,42,74,0.05), transparent 70%)' }}
          animate={{
            x: ['80%', '20%', '70%'],
            y: ['60%', '-10%', '50%'],
            scale: [1.2, 1, 1.3],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
