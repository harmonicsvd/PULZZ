import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6Impact() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Core message
      setTimeout(() => setPhase(3), 5500), // Logo lockup
      setTimeout(() => setPhase(4), 8500), // Tagline
      setTimeout(() => setPhase(5), 14000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden flex items-center justify-center bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#FEFCF7] to-[#FBF8F2]" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-[10vw]">
        
        {phase >= 1 && phase < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 -translate-y-1/2"
          >
            <h2 className="text-[5vw] font-black text-[#1B2A4A] leading-snug max-w-[60vw]" style={{ fontFamily: 'var(--font-display)' }}>
              Discovery, <span className="text-[#FF5C49]">fixed.</span>
            </h2>
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: 'spring', bounce: 0.3 }}
          >
            <div className="flex items-center gap-[2vw]">
              {/* Real Logo Mark */}
              <div className="w-[6vw] h-[6vw] rounded-[1.5vw] bg-[#FF5C49] flex items-center justify-center shadow-[0_20px_40px_rgba(255,92,73,0.3)]">
                <div className="w-[2vw] h-[2vw] rounded-full bg-[#FBF8F2]" />
              </div>
              {/* Wordmark */}
              <h1 className="text-[8vw] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                <span className="text-[#1B2A4A]">Pul</span><span className="text-[#FF5C49]">zz</span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 1 }}
              className="mt-[2vh]"
            >
              <p className="text-[2vw] text-slate-500 font-medium tracking-wide">
                Catch a song's pulse before the drop.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Accent flashes */}
      {phase >= 5 && (
        <motion.div 
          className="absolute inset-0 bg-[#FF5C49] mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}
