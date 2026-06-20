import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6Impact() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // To change timings: edit the ms values below.
    // Phase 5 controls when partners appear — move it closer to scene end to reduce their screen time.
    const timers = [
      setTimeout(() => setPhase(1), 600),   // "Discover" — ~1.3 s solo
      setTimeout(() => setPhase(2), 1900),  // "new music." joins — phrase shows ~3.1 s
      setTimeout(() => setPhase(3), 5000),  // Pulzz logo springs in
      setTimeout(() => setPhase(4), 8500),  // Tagline fades in
      setTimeout(() => setPhase(5), 14500), // Partners — ~2.5 s before scene ends at 17000
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

        {/* "Discover new music." — exits at phase 3 */}
        <AnimatePresence mode="popLayout">
          {phase >= 1 && phase < 3 && (
            <motion.div
              key="discover-text"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -36, filter: 'blur(8px)' }}
              transition={{ duration: 0.85, ease }}
            >
              <h2
                className="text-[7vw] font-black leading-tight tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="text-[#1B2A4A]">Discover</span>
                {phase >= 2 && (
                  <motion.span
                    className="text-[#FF5C49]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.65, ease }}
                  >
                    {' '}new music.
                  </motion.span>
                )}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulzz logo lockup — phase 3+ */}
        {phase >= 3 && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
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

            {/* Tagline — below logo */}
            <motion.p
              className="text-[2vw] font-black text-slate-500 tracking-tight"
              initial={{ opacity: 0, y: 12 }}
              animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.75, ease }}
            >
              Catch a song's pulse before the drop.
            </motion.p>

            {/* Partner footer — appears near end, ~2.5 s before scene ends */}
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
      </div>
    </motion.div>
  );
}
