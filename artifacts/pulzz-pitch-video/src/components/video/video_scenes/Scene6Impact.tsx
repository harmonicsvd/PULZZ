import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6Impact() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 7000),
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
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="absolute w-[70vw] h-[70vw] bg-[#FF5C49]/8 rounded-full blur-[140px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-[10vw]">

        <AnimatePresence mode="popLayout">
          {phase >= 1 && phase < 3 && (
            <motion.h2
              key="tagline"
              className="text-[6vw] font-black text-[#1B2A4A] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28, filter: 'blur(6px)' }}
              transition={{ duration: 0.65, ease }}
            >
              Discovery, <span className="text-[#FF5C49]">fixed.</span>
            </motion.h2>
          )}
        </AnimatePresence>

        {phase >= 3 && (
          <motion.div
            className="flex flex-col items-center gap-[1.5vh]"
            initial={{ scale: 0.88, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.28 }}
          >
            <div className="flex items-center gap-[2vw]">
              <div className="w-[6vw] h-[6vw] rounded-[1.5vw] bg-[#FF5C49] flex items-center justify-center shadow-[0_16px_36px_rgba(255,92,73,0.35)]">
                <div className="w-[2vw] h-[2vw] rounded-full bg-[#FBF8F2]" />
              </div>
              <h1 className="text-[8vw] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                <span className="text-[#1B2A4A]">Pul</span><span className="text-[#FF5C49]">zz</span>
              </h1>
            </div>

            <motion.p
              className="text-[1.8vw] text-slate-500 font-medium tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Catch a song's pulse before the drop.
            </motion.p>

            <motion.div
              className="flex items-center gap-[2vw] mt-[1.5vh]"
              initial={{ opacity: 0, y: 8 }}
              animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[0.85vw] text-slate-400 font-medium tracking-widest uppercase">Powered by</span>
              {['Musixmatch', 'Cyanite', 'Songstats'].map((name, i) => (
                <span key={name} className="text-[0.9vw] font-bold text-slate-500 bg-slate-100 px-[0.9vw] py-[0.35vw] rounded-full">
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
