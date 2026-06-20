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
      className="absolute inset-0 overflow-hidden flex items-center justify-center bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#FEFCF7] to-[#FBF8F2]" />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          className="flex items-center gap-6"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.5, opacity: 0, y: 50 }}
          transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
        >
          {/* Logo Mark */}
          <div className="w-[6vw] h-[6vw] rounded-2xl bg-[#FF5C49] flex items-center justify-center shadow-[0_20px_40px_rgba(255,92,73,0.3)]">
            <svg viewBox="0 0 24 24" className="w-[3vw] h-[3vw] text-white" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
            </svg>
          </div>
          {/* Wordmark */}
          <h1 className="text-[6vw] font-black text-[#1B2A4A] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            Pulzz.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
          className="mt-[4vh]"
        >
          <p className="text-[2vw] text-slate-600 font-medium">The pre-release discovery platform.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="mt-[8vh] px-8 py-3 rounded-full border border-[#1B2A4A]/10 bg-white/50 backdrop-blur-md text-[#1B2A4A] text-[1.2vw] font-mono tracking-widest uppercase"
        >
          Musicathon 2026
        </motion.div>
      </div>
      
      {/* Accent flashes */}
      {phase >= 4 && (
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