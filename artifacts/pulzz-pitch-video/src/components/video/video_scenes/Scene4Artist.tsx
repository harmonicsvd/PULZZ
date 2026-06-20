import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4Artist() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500), // dashboard UI enter
      setTimeout(() => setPhase(3), 5000), // stats populate
      setTimeout(() => setPhase(4), 9000), // discovery wall focus
      setTimeout(() => setPhase(5), 14000), // highlights
      setTimeout(() => setPhase(6), 20000), // fade out
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#0A0A0F]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1A1A24] to-[#0A0A0F]" />
      
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh]">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          className="mb-[4vh] z-20"
        >
          <h2 className="text-[3.5vw] font-black text-white leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Real-time analytics for <span className="text-[#7B61FF]">Creators.</span>
          </h2>
          <p className="text-[1.2vw] text-white/60">Watch your pre-release momentum build live.</p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          className="flex-1 w-full bg-[#14141E] rounded-t-[2vw] border-t border-x border-white/10 relative overflow-hidden shadow-2xl p-[3vw] flex gap-[2vw]"
          initial={{ y: '100%' }}
          animate={phase >= 2 ? { y: '0%' } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Content Area */}
          <div className="flex-[2] flex flex-col gap-[2vw]">
            {/* Top Stats */}
            <div className="flex gap-[2vw]">
              {[
                { label: 'Total Discoveries', val: '2,408', color: '#7B61FF' },
                { label: 'Moment Marks', val: '14,392', color: '#FF3C6E' },
                { label: 'Skip Rate', val: '8.4%', color: '#10B981' }
              ].map((stat, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-xl p-[1.5vw] border border-white/5 relative overflow-hidden">
                  <div className="text-white/50 text-[1vw] uppercase tracking-wider mb-2">{stat.label}</div>
                  <motion.div 
                    className="text-[2.5vw] font-bold text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: phase >= 3 ? i * 0.2 : 0 }}
                  >
                    {stat.val}
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: stat.color, opacity: 0.5 }} />
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-[2vw] flex flex-col">
              <div className="text-white/70 text-[1.2vw] font-bold mb-[2vw]">Discovery Momentum</div>
              <div className="flex-1 flex items-end gap-[1vw] pt-[2vw]">
                {[40, 60, 45, 80, 55, 90, 70, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#7B61FF]/20 to-[#7B61FF] rounded-t-sm"
                    initial={{ height: '0%' }}
                    animate={phase >= 3 ? { height: `${h}%` } : { height: '0%' }}
                    transition={{ duration: 1, delay: phase >= 3 ? i * 0.1 : 0, ease: "easeOut" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Discovery Wall Sidebar */}
          <motion.div 
            className="flex-1 bg-[#0A0A0F] rounded-xl border border-white/10 p-[2vw] relative overflow-hidden"
            animate={phase >= 4 ? { scale: 1.05, boxShadow: '0 0 50px rgba(255,60,110,0.2)', zIndex: 10 } : { scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-[2vw]">
              <div className="text-white font-bold text-[1.5vw]">Discovery Wall</div>
              <div className="text-[#FF3C6E] text-[1vw] font-mono animate-pulse">LIVE</div>
            </div>
            
            <div className="flex flex-col gap-[1vw]">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  className="bg-white/5 p-[1vw] rounded-lg border border-white/5 flex gap-[1vw] items-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ delay: phase >= 4 ? i * 0.2 : 0 }}
                >
                  <img src={`${import.meta.env.BASE_URL}images/avatar.png`} className="w-[3vw] h-[3vw] rounded-full object-cover border border-[#7B61FF]/50" />
                  <div>
                    <div className="text-white text-[1vw] font-bold">User_{8492 + i*17}</div>
                    <div className="text-[#FF3C6E] text-[0.8vw]">Just discovered "Midnight City"</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}