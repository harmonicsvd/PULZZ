import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1Problem } from './video_scenes/Scene1Problem';
import { Scene2Why } from './video_scenes/Scene2Why';
import { Scene3Listener } from './video_scenes/Scene3Listener';
import { Scene4Dashboard } from './video_scenes/Scene4Dashboard';
import { Scene5Features } from './video_scenes/Scene5Features';
import { Scene6Impact } from './video_scenes/Scene6Impact';

export const SCENE_DURATIONS = {
  problem: 17000,
  why: 15000,
  listener: 29000,
  dashboard: 34000,
  features: 22000,
  impact: 18000,
};

const SCENE_LABELS: Record<string, string> = {
  problem: 'The Problem',
  why: 'Introducing Pulzz',
  listener: 'For Listeners',
  dashboard: 'Artist Dashboard',
  features: 'Partner APIs',
  impact: 'Discover',
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  problem: Scene1Problem,
  why: Scene2Why,
  listener: Scene3Listener,
  dashboard: Scene4Dashboard,
  features: Scene5Features,
  impact: Scene6Impact,
};

const SCENE_KEYS = Object.keys(SCENE_DURATIONS);

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey, jumpToScene } = useVideoPlayer({ durations, loop });
  const [progress, setProgress] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  // Track progress within current scene
  useEffect(() => {
    startRef.current = Date.now();
    setProgress(0);
    const sceneDuration = durations[currentSceneKey] ?? 10000;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(elapsed / sceneDuration, 1));
      if (elapsed < sceneDuration) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentScene, currentSceneKey, durations]);

  // Auto-hide nav after 3 s of no mouse movement
  useEffect(() => {
    const show = () => {
      setNavVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setNavVisible(false), 3000);
    };
    window.addEventListener('mousemove', show);
    show();
    return () => {
      window.removeEventListener('mousemove', show);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A1122]">
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {/* Scene Navigator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pb-[2vh]"
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : 12 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-[0.6vw] bg-black/40 backdrop-blur-md px-[1.2vw] py-[0.6vw] rounded-full border border-white/10 shadow-lg">
          {SCENE_KEYS.map((key, i) => {
            const isActive = i === currentScene;
            const isPast = i < currentScene;
            return (
              <button
                key={key}
                onClick={() => jumpToScene(i)}
                className="flex items-center gap-[0.5vw] group"
                title={SCENE_LABELS[key]}
              >
                {/* Pill */}
                <div className={`relative flex items-center rounded-full overflow-hidden transition-all duration-300 ${isActive ? 'w-[7vw] bg-white/20' : 'w-[0.6vw] bg-white/25 hover:bg-white/40'} h-[0.6vw]`}>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 bg-[#FF5C49] rounded-full"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                  {isPast && !isActive && (
                    <div className="absolute inset-0 bg-white/60 rounded-full" />
                  )}
                </div>

                {/* Label — only active */}
                {isActive && (
                  <motion.span
                    className="text-[0.7vw] font-bold text-white whitespace-nowrap"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {SCENE_LABELS[key]}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
