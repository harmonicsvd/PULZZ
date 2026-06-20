import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1Problem() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 4600),
      setTimeout(() => setPhase(4), 6800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#0A1122]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle at center, #7B61FF 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        animate={{ y: [0, -120] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B2A4A]/60 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[10vw]">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase === 1 ? { opacity: 1, y: 0 } : phase >= 2 ? { opacity: 0, y: -20 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          <p className="text-[4.5vw] font-black text-white/80 leading-tight tracking-tight">
            120,000+ songs drop<br />every single day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase === 2 ? { opacity: 1, y: 0 } : phase >= 3 ? { opacity: 0, y: -20 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          <p className="text-[4vw] font-black text-white/80 leading-tight tracking-tight max-w-[65vw]">
            Artists release <span className="text-[#FF5C49]">blind</span> —<br />
            no real listener signal before drop day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase === 3 ? { opacity: 1, y: 0 } : phase >= 4 ? { opacity: 0, y: -20 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          <p className="text-[4vw] font-black text-white/80 leading-tight tracking-tight max-w-[65vw]">
            Listeners can't find the <span className="text-[#3E5C99]">next hit</span><br />
            before everyone else does.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          <h2 className="text-[6.5vw] font-black leading-tight tracking-tight text-[#FF5C49]" style={{ fontFamily: 'var(--font-display)' }}>
            Pre-release discovery<br />is broken.
          </h2>
        </motion.div>

      </div>
    </motion.div>
  );
}
