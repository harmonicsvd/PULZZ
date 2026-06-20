import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2Why() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute w-[80vw] h-[80vw] bg-[#FF5C49]/10 rounded-full blur-[100px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[10vw]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-[#1B2A4A]/5 px-[1.5vw] py-[0.5vw] rounded-full text-[#1B2A4A] font-bold text-[1vw] uppercase tracking-widest inline-block mb-[2vw]">
            Why we built Pulzz
          </div>
          <h2 className="text-[5vw] font-black leading-tight tracking-tight text-[#1B2A4A] max-w-[65vw]" style={{ fontFamily: 'var(--font-display)' }}>
            A <span className="text-[#FF5C49]">pre-release</span> discovery platform.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-[4vh] flex gap-[4vw]"
        >
          <div className="bg-white p-[2vw] rounded-2xl shadow-xl shadow-[#1B2A4A]/5 border border-[#1B2A4A]/10 w-[24vw]">
            <h3 className="text-[#3E5C99] font-bold text-[1.5vw] mb-[1vw]">For Listeners</h3>
            <p className="text-[1.2vw] text-slate-600 leading-snug">Hear tomorrow's music today and build your discovery reputation.</p>
          </div>
          <div className="bg-white p-[2vw] rounded-2xl shadow-xl shadow-[#1B2A4A]/5 border border-[#1B2A4A]/10 w-[24vw]">
            <h3 className="text-[#FF5C49] font-bold text-[1.5vw] mb-[1vw]">For Artists</h3>
            <p className="text-[1.2vw] text-slate-600 leading-snug">Get real feedback and find collaborators BEFORE release day.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
