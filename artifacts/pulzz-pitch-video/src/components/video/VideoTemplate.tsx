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
  why: 13000,
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
  const { currentScene, currentSceneKey, paused, jumpToScene, togglePause } = useVideoPlayer({ durations, loop });
  const [progress, setProgress] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(Date.now());
  const pausedElapsedRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  // Reset elapsed on scene change
  useEffect(() => {
    pausedElapsedRef.current = 0;
    startRef.current = Date.now();
    setProgress(0);
  }, [currentScene]);

  // rAF progress tracker — stops when paused
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const sceneDuration = durations[currentSceneKey] ?? 10000;

    if (paused) {
      // Snapshot how far we got
      pausedElapsedRef.current = Date.now() - startRef.current;
      return;
    }

    // Resume from where we left off
    startRef.current = Date.now() - pausedElapsedRef.current;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(elapsed / sceneDuration, 1));
      if (elapsed < sceneDuration) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, currentScene, currentSceneKey, durations]);

  // Auto-hide nav after 3s of no mouse movement
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't hijack if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        jumpToScene(currentScene + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        jumpToScene(currentScene - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentScene, jumpToScene, togglePause]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A1122]">
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-[2vw] py-[1vw] flex items-center gap-[0.8vw]">
              <div className="flex gap-[0.4vw]">
                <div className="w-[0.5vw] h-[2vw] bg-white rounded-full" />
                <div className="w-[0.5vw] h-[2vw] bg-white rounded-full" />
              </div>
              <span className="text-white text-[1.1vw] font-bold">Paused — Space to resume</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene Navigator — positioned clear of the bottom edge */}
      <motion.div
        className="absolute left-0 right-0 z-50 flex justify-center"
        style={{ bottom: '7vh' }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : 10 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-[0.7vw] bg-black/45 backdrop-blur-md px-[1.4vw] py-[0.7vw] rounded-full border border-white/12 shadow-xl">
          {SCENE_KEYS.map((key, i) => {
            const isActive = i === currentScene;
            const isPast = i < currentScene;
            return (
              <button
                key={key}
                onClick={() => jumpToScene(i)}
                className="flex items-center gap-[0.5vw] cursor-pointer"
                title={`${SCENE_LABELS[key]} (${i + 1}/${SCENE_KEYS.length})`}
              >
                <div
                  className={`relative rounded-full overflow-hidden transition-all duration-300 h-[0.65vw] ${
                    isActive ? 'w-[8vw] bg-white/20' : 'w-[0.65vw] hover:bg-white/50'
                  } ${isPast && !isActive ? 'bg-white/55' : !isActive ? 'bg-white/22' : ''}`}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#FF5C49] rounded-full transition-none"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                </div>
                {isActive && (
                  <motion.span
                    className="text-[0.72vw] font-bold text-white/90 whitespace-nowrap select-none"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {SCENE_LABELS[key]}
                  </motion.span>
                )}
              </button>
            );
          })}

          {/* Keyboard hint */}
          <div className="ml-[0.4vw] pl-[0.7vw] border-l border-white/15 flex items-center gap-[0.4vw]">
            {['←', '→', '⎵'].map(k => (
              <kbd key={k} className="text-[0.6vw] text-white/50 font-mono bg-white/10 px-[0.4vw] py-[0.15vw] rounded">
                {k}
              </kbd>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
