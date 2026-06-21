import { useCallback, useEffect, useRef, useState } from 'react';
import { Repeat, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import VideoTemplate, { SCENE_DURATIONS } from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const PROGRESS_TICK_MS = 60;

interface ControlBarProps {
  visible: boolean;
  collapsed: boolean;
  locked: boolean;
  muted: boolean;
  audioReady: boolean;
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  tick: number;
  onToggleLock: () => void;
  onJumpTo: (index: number) => void;
  onToggleCollapsed: () => void;
  onToggleMute: () => void;
}

function ProgressSegments({
  sceneKeys, activeIndex, activeDuration, tick, onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  tick: number;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const start = performance.now();
    const id = window.setInterval(() => {
      setElapsed(performance.now() - start);
    }, PROGRESS_TICK_MS);
    return () => window.clearInterval(id);
  }, [tick]);

  const progress = activeDuration > 0 ? Math.min(1, elapsed / activeDuration) : 0;

  return (
    <div className="flex-1 flex items-center gap-1.5">
      {sceneKeys.map((key, i) => {
        const isActive = i === activeIndex;
        const fill = isActive ? progress * 100 : 0;
        return (
          <button
            key={key}
            onClick={() => onJumpTo(i)}
            className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-4 hover:bg-white/25 transition-all relative min-h-[12px]"
            aria-label={`Jump to scene ${i + 1}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <div
              className="absolute inset-y-0 left-0 bg-white/90 rounded-full transition-[width] duration-100"
              style={{ width: `${fill}%` }}
            />
          </button>
        );
      })}
    </div>
  );
}

function ControlBar({
  visible, collapsed, locked, muted, audioReady,
  sceneKeys, activeIndex, activeDuration, tick,
  onToggleLock, onJumpTo, onToggleCollapsed, onToggleMute,
}: ControlBarProps) {
  return (
    <div
      className={`flex items-center gap-3 bg-black/50 backdrop-blur-sm px-5 py-4 transition-all duration-200 ease-out ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <button
        onClick={onToggleLock}
        className={`w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 ${
          locked
            ? 'text-white bg-white/15 hover:bg-white/25'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-label={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-pressed={locked}
      >
        <Repeat className="w-8 h-8" />
      </button>

      <div className="w-px self-stretch bg-white/15" aria-hidden="true" />

      <ProgressSegments
        sceneKeys={sceneKeys}
        activeIndex={activeIndex}
        activeDuration={activeDuration}
        tick={tick}
        onJumpTo={onJumpTo}
      />

      <div className="text-xl text-white/60 font-mono tabular-nums shrink-0">
        {activeIndex + 1}/{sceneKeys.length}
      </div>

      {/* Sound toggle — only shown once audio is ready */}
      {audioReady && (
        <button
          onClick={onToggleMute}
          className={`w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 ${
            muted
              ? 'text-white/40 hover:text-white hover:bg-white/10'
              : 'text-white bg-white/15 hover:bg-white/25'
          }`}
          title={muted ? 'Unmute background music' : 'Mute background music'}
          aria-label={muted ? 'Unmute background music' : 'Mute background music'}
          aria-pressed={!muted}
        >
          {muted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
        </button>
      )}

      <button
        onClick={onToggleCollapsed}
        className="w-14 h-14 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg shrink-0"
        title={collapsed ? 'Show controls' : 'Hide controls'}
        aria-label={collapsed ? 'Show controls' : 'Hide controls'}
        aria-expanded={!collapsed}
      >
        {collapsed ? <ChevronUp className="w-10 h-10" /> : <ChevronDown className="w-10 h-10" />}
      </button>
    </div>
  );
}

export default function VideoWithControls() {
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;

  const {
    sceneKeys, activeIndex, locked, mountKey, tick,
    durations, activeDuration, onSceneChange, jumpTo, toggleLock,
  } = useSceneControls(SCENE_DURATIONS);

  const sensorRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioStartedRef = useRef(false);

  // Create audio element once on mount
  useEffect(() => {
    if (!isIframed) return;
    const audio = new Audio('/audio/background.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';
    audioRef.current = audio;
    audio.addEventListener('canplaythrough', () => setAudioReady(true), { once: true });
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [isIframed]);

  // Start playing on first user interaction (browsers require it)
  const tryStartAudio = useCallback(() => {
    if (audioStartedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => {
      audioStartedRef.current = true;
    }).catch(() => {
      // autoplay blocked — user can toggle manually
    });
  }, []);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') { setHovering(true); tryStartAudio(); }
  }, [tryStartAudio]);
  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') setHovering(false);
  }, []);
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    tryStartAudio();
    if (e.pointerType === 'mouse') return;
    if (collapsed) setTapPinned(true);
  }, [collapsed, tryStartAudio]);
  const handleToggleCollapsed = useCallback(() => {
    setCollapsed(c => {
      if (!c) { setHovering(false); setTapPinned(false); }
      return !c;
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      if (!next) tryStartAudio();
      return next;
    });
  }, [tryStartAudio]);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const sensor = sensorRef.current;
      if (sensor && !sensor.contains(e.target as Node)) setTapPinned(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [collapsed, tapPinned]);

  const barVisible = !collapsed || hovering || tapPinned;

  // Export path: no props, preserves recording markers
  if (!isIframed) return <VideoTemplate />;

  return (
    <div
      className="relative w-full h-screen"
      onClick={tryStartAudio}
    >
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        onSceneChange={onSceneChange}
        controlled
      />
      <div
        ref={sensorRef}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col justify-end"
        style={{ height: '25%' }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <div className="flex-1 w-full" aria-hidden="true" />
        <ControlBar
          visible={barVisible}
          collapsed={collapsed}
          locked={locked}
          muted={muted}
          audioReady={audioReady}
          sceneKeys={sceneKeys}
          activeIndex={activeIndex}
          activeDuration={activeDuration}
          tick={tick}
          onToggleLock={toggleLock}
          onJumpTo={jumpTo}
          onToggleCollapsed={handleToggleCollapsed}
          onToggleMute={handleToggleMute}
        />
      </div>
    </div>
  );
}
