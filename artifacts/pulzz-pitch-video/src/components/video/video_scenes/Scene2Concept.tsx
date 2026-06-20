import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2Concept() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 8000),
      setTimeout(() => setPhase(5), 11000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 bg-[#FBF8F2]" />
      
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full flex flex-col justify-center pl-[10vw] pr-[5vw] z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-[#1B2A4A]/5 text-[#1B2A4A] font-mono text-[1vw] mb-6 tracking-widest uppercase border border-[#1B2A4A]/10">
              The Discovery Pool
            </div>
            <h2 className="text-[5vw] font-black text-[#1B2A4A] leading-[1.1] tracking-tight mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              Unreleased <br/><span className="text-[#FF5C49]">exclusives.</span>
            </h2>
            
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={phase >= 2 ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[1.8vw] text-slate-600 font-body leading-relaxed max-w-[30vw]">
                A platform where artists drop tracks early. Listeners discover and curate the next big thing.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div className="w-1/2 h-full relative z-10 flex items-center justify-center">
          <motion.div
            className="absolute right-[5vw] w-[40vw] h-[60vh] bg-gradient-to-br from-[#FEFCF7] to-[#FBF8F2] rounded-3xl border border-[#1B2A4A]/10 overflow-hidden shadow-[0_20px_60px_rgba(27,42,74,0.05)]"
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1, rotateY: -5 } : { opacity: 0, scale: 0.8, rotateY: 20 }}
            transition={{ duration: 1.5, type: 'spring', bounce: 0.3 }}
            style={{ perspective: 1000 }}
          >
            <div className="p-8 h-full flex flex-col gap-6">
              <div className="h-[2vw] w-1/3 bg-[#1B2A4A]/5 rounded-md mb-[1vw]" />
              {[
                { title: "Danny Boy", artist: "Ernestine Schumann-Heink" },
                { title: "Swing Low, Sweet Chariot", artist: "Fisk Jubilee Quartet" },
                { title: "After You've Gone", artist: "Marion Harris" },
                { title: "Some of These Days", artist: "Sophie Tucker" },
              ].map((song, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-[1vw] p-[1vw] rounded-xl bg-white border border-[#1B2A4A]/5 shadow-sm"
                  initial={{ opacity: 0, x: 50 }}
                  animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ delay: i * 0.15 + (phase >= 3 ? 0 : 0) }}
                >
                  <div className="w-[4vw] h-[4vw] rounded-md bg-[#FF5C49]/10" />
                  <div className="flex-1">
                    <div className="text-[#1B2A4A] text-[1.1vw] font-bold mb-[0.2vw]">{song.title}</div>
                    <div className="text-[#1B2A4A]/60 text-[0.9vw]">{song.artist}</div>
                  </div>
                  <div className="px-[0.8vw] py-[0.3vw] rounded-full bg-[#FF5C49]/10 text-[#FF5C49] text-[0.8vw] font-bold">Unreleased</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}