import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, BarChart2, Star, Music } from 'lucide-react';

export function Scene2Why() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute w-[70vw] h-[70vw] bg-[#FF5C49]/8 rounded-full blur-[120px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8vw]">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[3vh]"
        >
          <div className="bg-[#FF5C49]/10 px-[1.5vw] py-[0.5vw] rounded-full text-[#FF5C49] font-bold text-[1vw] uppercase tracking-widest inline-block mb-[1.5vw]">
            Introducing Pulzz
          </div>
          <h2 className="text-[5vw] font-black leading-tight tracking-tight text-[#1B2A4A] max-w-[70vw]" style={{ fontFamily: 'var(--font-display)' }}>
            The <span className="text-[#FF5C49]">pre-release</span> discovery<br />platform for music.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-[3vw] w-full max-w-[80vw]"
        >
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-[#1B2A4A]/8 p-[2vw] text-left">
            <div className="flex items-center gap-[0.8vw] mb-[1.2vw]">
              <div className="w-[2.5vw] h-[2.5vw] rounded-lg bg-[#3E5C99]/10 flex items-center justify-center">
                <Music className="w-[1.3vw] h-[1.3vw] text-[#3E5C99]" />
              </div>
              <h3 className="text-[#3E5C99] font-black text-[1.4vw]">For Listeners</h3>
            </div>
            <ul className="space-y-[0.6vw]">
              {[
                'Discover unreleased tracks before drop day',
                'Mark exact moments you love as you listen',
                'React Discovered or Skip — build your rep',
                'Get notified the moment your picks release',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-[0.6vw] text-[1vw] text-slate-600">
                  <span className="text-[#3E5C99] font-bold mt-[0.1vw]">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-[#1B2A4A]/8 p-[2vw] text-left">
            <div className="flex items-center gap-[0.8vw] mb-[1.2vw]">
              <div className="w-[2.5vw] h-[2.5vw] rounded-lg bg-[#FF5C49]/10 flex items-center justify-center">
                <BarChart2 className="w-[1.3vw] h-[1.3vw] text-[#FF5C49]" />
              </div>
              <h3 className="text-[#FF5C49] font-black text-[1.4vw]">For Artists</h3>
            </div>
            <ul className="space-y-[0.6vw]">
              {[
                'Submit tracks to the Discovery Pool pre-release',
                'Real-time reactions, moment marks & analytics',
                'Per-song Sound DNA via Cyanite AI',
                'Discovery Wall — your most engaged listeners',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-[0.6vw] text-[1vw] text-slate-600">
                  <span className="text-[#FF5C49] font-bold mt-[0.1vw]">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6 }}
          className="mt-[2.5vh] flex items-center gap-[1.5vw]"
        >
          <div className="flex items-center gap-[0.5vw] bg-amber-50 border border-amber-200 px-[1.2vw] py-[0.5vw] rounded-full">
            <Star className="w-[1vw] h-[1vw] text-amber-500" fill="currentColor" />
            <span className="text-[0.9vw] font-bold text-amber-700">Points system for top discoverers</span>
          </div>
          <div className="flex items-center gap-[0.5vw] bg-[#FF5C49]/10 border border-[#FF5C49]/20 px-[1.2vw] py-[0.5vw] rounded-full">
            <Zap className="w-[1vw] h-[1vw] text-[#FF5C49]" fill="currentColor" />
            <span className="text-[0.9vw] font-bold text-[#FF5C49]">Local-first, syncs in real time</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
