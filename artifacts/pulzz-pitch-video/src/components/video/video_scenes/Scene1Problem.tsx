import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1Problem() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 6000),
      setTimeout(() => setPhase(4), 9000),
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
        
        {/* Phase 1 & 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            phase === 0 ? { opacity: 0, y: 20 } :
            phase === 1 ? { opacity: 1, y: 0 } :
            phase === 2 ? { opacity: 0.3, y: -20, scale: 0.95 } :
            { opacity: 0, y: -40 }
          }
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[30%]"
        >
          <h2 className="text-[3vw] font-medium text-[#FBF8F2] opacity-80" style={{ fontFamily: 'var(--font-display)' }}>
            Listening has never been easier.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            phase <= 1 ? { opacity: 0, y: 20 } :
            phase === 2 ? { opacity: 1, y: 0 } :
            { opacity: 0, y: -20 }
          }
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[40%]"
        >
          <h2 className="text-[3vw] font-medium text-[#FBF8F2] opacity-80" style={{ fontFamily: 'var(--font-display)' }}>
            Distributing has never been easier.
          </h2>
        </motion.div>

        {/* Phase 3: Discovery is broken */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            phase >= 3 ? { opacity: 1, scale: 1, y: phase >= 4 ? -40 : 0 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-10"
        >
          <h2 className="text-[6vw] font-black leading-tight tracking-tight text-[#FF5C49]" style={{ fontFamily: 'var(--font-display)' }}>
            But discovery is broken.
          </h2>
        </motion.div>

        {/* Phase 4: Artists can't... Listeners can't... */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 4 ? { opacity: 1, y: 50 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-10"
        >
          <p className="text-[2.2vw] text-slate-300 max-w-[60vw] font-medium leading-snug">
            Artists can't get discovered.<br/>
            <span className="opacity-80">Listeners can't find new talent.</span>
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
