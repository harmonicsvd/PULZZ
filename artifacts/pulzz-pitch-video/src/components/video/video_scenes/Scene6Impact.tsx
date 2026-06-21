import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6Impact() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),   // "Discover" appears solo ~1.3 s
      setTimeout(() => setPhase(2), 1900),  // "new music." slides in from behind Discover
      setTimeout(() => setPhase(3), 4200),  // text fades OUT quicker → Pulzz enters sooner
      setTimeout(() => setPhase(4), 5800),  // tagline — 1.6 s after Pulzz appears
      setTimeout(() => setPhase(5), 7000),  // partners — appear earlier (~5 s visible before scene end)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden flex items-center justify-center bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="absolute w-[75vw] h-[75vw] bg-[#FF5C49]/8 rounded-full blur-[160px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-[10vw]">

        {/*
          mode="wait" — the "discover-text" block fully exits before "pulzz-logo" enters.
          This prevents the two from ever being on screen at the same time.
        */}
        <AnimatePresence mode="wait">

          {/* ── "Discover new music." ── */}
          {phase >= 1 && phase < 3 && (
            <motion.div
              key="discover-text"
              className="flex items-baseline justify-center"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
              transition={{ duration: 0.75, ease }}
            >
              <h2
                className="text-[7vw] font-black leading-tight tracking-tight flex items-baseline"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {/* "Discover" fades in first */}
                <motion.span
                  className="text-[#1B2A4A]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, ease }}
                >
                  Discover
                </motion.span>

                {/*
                  Clipping wrapper — same inline-block width as the text inside.
                  overflow:hidden clips the child while it starts at x:-100%
                  (fully to the left, hidden behind "Discover"), then springs
                  rightward into its final position.
                */}
                <span style={{ overflow: 'hidden', display: 'inline-block', verticalAlign: 'baseline' }}>
                  <motion.span
                    className="text-[#FF5C49] inline-block"
                    initial={{ x: '-100%' }}
                    animate={phase >= 2 ? { x: 0 } : { x: '-100%' }}
                    transition={{ type: 'spring', stiffness: 55, damping: 11, delay: 0.06 }}
                  >
                    &nbsp;new music.
                  </motion.span>
                </span>
              </h2>
            </motion.div>
          )}

          {/* ── Pulzz logo — only enters after text fully exits ── */}
          {phase >= 3 && (
            <motion.div
              key="pulzz-logo"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.88, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.0, type: 'spring', bounce: 0.22 }}
            >
              <div className="flex items-center gap-[2vw] mb-[2vh]">
                <div className="w-[7vw] h-[7vw] rounded-[1.8vw] bg-[#FF5C49] flex items-center justify-center shadow-[0_20px_48px_rgba(255,92,73,0.4)]">
                  <div className="w-[2.5vw] h-[2.5vw] rounded-full bg-[#FBF8F2]" />
                </div>
                <h1
                  className="text-[9vw] font-black tracking-tight leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="text-[#1B2A4A]">Pul</span><span className="text-[#FF5C49]">zz</span>
                </h1>
              </div>

              {/* Tagline */}
              <motion.p
                className="text-[2vw] font-black text-slate-500 tracking-tight"
                initial={{ opacity: 0, y: 12 }}
                animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.75, ease }}
              >
                Catch a song's pulse before the drop.
              </motion.p>

              {/* Partners — ~2.5 s before scene ends */}
              <motion.div
                className="flex items-center gap-[2vw] mt-[3vh]"
                initial={{ opacity: 0, y: 10 }}
                animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.65 }}
              >
                <span className="text-[0.85vw] text-slate-400 font-medium tracking-widest uppercase">Powered by</span>
                {['Musixmatch', 'Cyanite', 'Songstats'].map(name => (
                  <span key={name} className="text-[0.9vw] font-bold text-slate-500 bg-slate-100 px-[1vw] py-[0.4vw] rounded-full">
                    {name}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
