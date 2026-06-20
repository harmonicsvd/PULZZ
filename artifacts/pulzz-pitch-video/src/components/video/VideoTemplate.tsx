import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1Hook } from './video_scenes/Scene1Hook';
import { Scene2Concept } from './video_scenes/Scene2Concept';
import { Scene3Listener } from './video_scenes/Scene3Listener';
import { Scene4Artist } from './video_scenes/Scene4Artist';
import { Scene5Outro } from './video_scenes/Scene5Outro';

export const SCENE_DURATIONS = {
  hook: 8000,
  concept: 12000,
  listener: 25000,
  artist: 25000,
  outro: 15000
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  hook: Scene1Hook,
  concept: Scene2Concept,
  listener: Scene3Listener,
  artist: Scene4Artist,
  outro: Scene5Outro
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
    <div className="relative w-full h-screen overflow-hidden bg-[#0A0A0F]">
      {/* Persistent background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.4), transparent 70%)' }}
          animate={{
            x: ['-20%', '40%', '-10%'],
            y: ['-20%', '30%', '-10%'],
            scale: [1, 1.2, 0.9],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(255,60,110,0.3), transparent 70%)' }}
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
