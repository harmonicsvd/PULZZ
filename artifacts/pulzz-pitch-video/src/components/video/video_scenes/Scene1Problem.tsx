import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1Problem() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 7200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#0A1122]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle at center, #7B61FF 1px, transparent 1px)', backgroundSize: '52px 52px' }}
        animate={{ y: [0, -104] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[10vw]">

        <motion.p
          className="absolute text-[4.8vw] font-black text-white/85 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 22 }}
          animate={phase === 1 ? { opacity: 1, y: 0 } : phase >= 2 ? { opacity: 0, y: -22 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.55, ease }}
        >
          Streaming is a crowded jungle.
        </motion.p>

        <motion.p
          className="absolute text-[4vw] font-black text-white/85 leading-tight tracking-tight max-w-[68vw]"
          initial={{ opacity: 0, y: 22 }}
          animate={phase === 2 ? { opacity: 1, y: 0 } : phase >= 3 ? { opacity: 0, y: -22 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.55, ease }}
        >
          Emerging artists get <span className="text-[#FF5C49]">buried</span> —<br />
          no buzz, no early fans, no fair shot.
        </motion.p>

        <motion.p
          className="absolute text-[4vw] font-black text-white/85 leading-tight tracking-tight max-w-[68vw]"
          initial={{ opacity: 0, y: 22 }}
          animate={phase === 3 ? { opacity: 1, y: 0 } : phase >= 4 ? { opacity: 0, y: -22 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.55, ease }}
        >
          Listeners miss rising talent<br />
          before it <span className="text-[#3E5C99]">disappears</span>.
        </motion.p>

        <motion.h2
          className="absolute text-[7vw] font-black leading-tight tracking-tight text-[#FF5C49]"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.65, ease }}
        >
          Discovery is broken.
        </motion.h2>

      </div>
    </motion.div>
  );
}
