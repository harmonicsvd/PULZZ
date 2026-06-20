import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1Problem() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 3500),
      setTimeout(() => setPhase(3), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#1B2A4A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B2A4A] to-[#0A1122]" />

      {/* Atmospheric dark particles */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at center, #FBF8F2 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        animate={{ y: [0, -200], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[10vw]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#FBF8F2]"
        >
          <h2 className="text-[5vw] font-black leading-tight tracking-tight max-w-[60vw]" style={{ fontFamily: 'var(--font-display)' }}>
            Artists release into <span className="text-white/40">silence.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-[4vh]"
        >
          <p className="text-[2.2vw] text-slate-300/80 max-w-[55vw] font-medium leading-snug">
            With no pre-release signal, great unreleased music has nowhere to be discovered early.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
