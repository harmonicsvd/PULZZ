import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1Hook() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5500),
      setTimeout(() => setPhase(5), 7000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/bg-waves.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 w-full max-w-[90vw]">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <h1 className="text-[8vw] font-black leading-[1.1] tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            <motion.span className="block text-white">Hear tomorrow's</motion.span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <h1 className="text-[8vw] font-black leading-[1.1] tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            <motion.span className="block text-[#FF3C6E]">hits today.</motion.span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={phase >= 3 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-[20vw] h-[4px] bg-[#7B61FF] mt-[4vh] origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[2vw] text-white/70 mt-[4vh] font-medium tracking-wide max-w-[60vw]"
        >
          Before the release radar. Before the playlists.
        </motion.p>
      </div>
    </motion.div>
  );
}