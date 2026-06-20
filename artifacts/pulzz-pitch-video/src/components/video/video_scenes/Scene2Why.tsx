import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, BarChart2, Star, Users } from 'lucide-react';

export function Scene2Why() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 4500),
      setTimeout(() => setPhase(3), 9500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="absolute w-[65vw] h-[65vw] bg-[#FF5C49]/8 rounded-full blur-[140px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-[8vw]">

        {/* Intro: "Introducing" eyebrow + big PULZZ wordmark */}
        <motion.div
          className="text-center mb-[4vh]"
          initial={{ opacity: 0, y: 36 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 1.0, ease }}
        >
          <p className="text-[1.1vw] font-bold text-slate-400 uppercase tracking-[0.35em] mb-[1.2vw]">
            Introducing
          </p>
          <div className="flex items-center justify-center gap-[1.5vw] mb-[2vw]">
            <div className="w-[5vw] h-[5vw] rounded-[1.2vw] bg-[#FF5C49] flex items-center justify-center shadow-[0_12px_32px_rgba(255,92,73,0.35)]">
              <div className="w-[1.8vw] h-[1.8vw] rounded-full bg-[#FBF8F2]" />
            </div>
            <h1 className="text-[7vw] font-black tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-[#1B2A4A]">Pul</span><span className="text-[#FF5C49]">zz</span>
            </h1>
          </div>
          <p className="text-[2vw] font-black text-[#1B2A4A] tracking-tight leading-tight">
            A space <span className="text-[#FF5C49]">before release day</span> where emerging artists<br />find their first audience.
          </p>
        </motion.div>

        {/* Two-column cards */}
        <motion.div
          className="flex gap-[2.5vw] w-full max-w-[84vw]"
          initial={{ opacity: 0, y: 24 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-[#1B2A4A]/8 p-[1.8vw] text-left">
            <div className="flex items-center gap-[0.8vw] mb-[1.2vw]">
              <div className="w-[2.5vw] h-[2.5vw] rounded-lg bg-[#3E5C99]/10 flex items-center justify-center">
                <Zap className="w-[1.3vw] h-[1.3vw] text-[#3E5C99]" />
              </div>
              <h3 className="text-[#3E5C99] font-black text-[1.3vw]">For Listeners</h3>
            </div>
            <ul className="space-y-[0.55vw]">
              {[
                'Discover unreleased tracks before anyone else',
                'Mark the exact seconds that move you',
                'React: Discovered or Skip',
                'Earn points — build your discoverer rep',
                'Get notified the moment your picks release',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-[0.6vw] text-[0.95vw] text-slate-600">
                  <span className="text-[#3E5C99] font-bold shrink-0">→</span>{item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-[#1B2A4A]/8 p-[1.8vw] text-left">
            <div className="flex items-center gap-[0.8vw] mb-[1.2vw]">
              <div className="w-[2.5vw] h-[2.5vw] rounded-lg bg-[#FF5C49]/10 flex items-center justify-center">
                <BarChart2 className="w-[1.3vw] h-[1.3vw] text-[#FF5C49]" />
              </div>
              <h3 className="text-[#FF5C49] font-black text-[1.3vw]">For Artists</h3>
            </div>
            <ul className="space-y-[0.55vw]">
              {[
                'Submit tracks to the Discovery Pool pre-release',
                'Real-time reactions & moment-mark analytics',
                'See which songs are ready — before you release',
                'Meet your earliest supporters',
                'Find collaborators on the Collaboration Wall',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-[0.6vw] text-[0.95vw] text-slate-600">
                  <span className="text-[#FF5C49] font-bold shrink-0">→</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="mt-[2.5vh] flex items-center gap-[1.5vw]"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-[0.5vw] bg-amber-50 border border-amber-200 px-[1.2vw] py-[0.5vw] rounded-full">
            <Star className="w-[1vw] h-[1vw] text-amber-500" fill="currentColor" />
            <span className="text-[0.9vw] font-bold text-amber-700">Points for top discoverers</span>
          </div>
          <div className="flex items-center gap-[0.5vw] bg-[#FF5C49]/10 border border-[#FF5C49]/20 px-[1.2vw] py-[0.5vw] rounded-full">
            <Users className="w-[1vw] h-[1vw] text-[#FF5C49]" />
            <span className="text-[0.9vw] font-bold text-[#FF5C49]">Collaboration Wall</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
