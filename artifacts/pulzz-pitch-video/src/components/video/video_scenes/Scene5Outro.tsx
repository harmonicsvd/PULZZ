import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5Outro() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 6000),
      setTimeout(() => setPhase(5), 14000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden flex items-center justify-center bg-[#0A0A0F]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A24] to-[#0A0A0F]" />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          className="flex items-center gap-6"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.5, opacity: 0, y: 50 }}
          transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
        >
          {/* Logo Mark */}
          <div className="w-[6vw] h-[6vw] rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#FF3C6E] flex items-center justify-center shadow-[0_0_80px_rgba(123,97,255,0.4)]">
            <svg viewBox="0 0 24 24" className="w-[3vw] h-[3vw] text-white" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
            </svg>
          </div>
          {/* Wordmark */}
          <h1 className="text-[6vw] font-black text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            Pulzz.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
          className="mt-[4vh]"
        >
          <p className="text-[2vw] text-white/70 font-medium">The pre-release discovery platform.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="mt-[8vh] px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-[1.2vw] font-mono tracking-widest uppercase"
        >
          Musicathon 2026
        </motion.div>
      </div>
      
      {/* Accent flashes */}
      {phase >= 4 && (
        <motion.div 
          className="absolute inset-0 bg-[#7B61FF] mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}