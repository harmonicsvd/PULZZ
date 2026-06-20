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
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FEFCF7] to-[#FBF8F2]" />
      
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh]">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          className="mb-[4vh] z-20"
        >
          <h2 className="text-[3.5vw] font-black text-[#1B2A4A] leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Real-time analytics for <span className="text-[#FF5C49]">Creators.</span>
          </h2>
          <p className="text-[1.2vw] text-slate-600">Watch your pre-release momentum build live.</p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          className="flex-1 w-full bg-white rounded-t-[2vw] border-t border-x border-[#1B2A4A]/5 relative overflow-hidden shadow-2xl p-[3vw] flex gap-[2vw]"
          initial={{ y: '100%' }}
          animate={phase >= 2 ? { y: '0%' } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Content Area */}
          <div className="flex-[2] flex flex-col gap-[2vw]">
            {/* Top Stats */}
            <div className="flex gap-[2vw]">
              {[
                { label: 'Total Discoveries', val: '2,408', color: '#FF5C49' },
                { label: 'Moment Marks', val: '14,392', color: 'hsl(26 85% 62%)' },
                { label: 'Skip Rate', val: '8.4%', color: 'hsl(152 48% 42%)' }
              ].map((stat, i) => (
                <div key={i} className="flex-1 bg-[#FBF8F2] rounded-xl p-[1.5vw] border border-[#1B2A4A]/5 relative overflow-hidden">
                  <div className="text-slate-500 text-[1vw] uppercase tracking-wider mb-2">{stat.label}</div>
                  <motion.div 
                    className="text-[2.5vw] font-bold text-[#1B2A4A]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: phase >= 3 ? i * 0.2 : 0 }}
                  >
                    {stat.val}
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: stat.color, opacity: 0.8 }} />
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="flex-1 bg-[#FBF8F2] rounded-xl border border-[#1B2A4A]/5 p-[2vw] flex flex-col">
              <div className="text-[#1B2A4A] text-[1.2vw] font-bold mb-[2vw]">Discovery Momentum</div>
              <div className="flex-1 flex items-end gap-[1vw] pt-[2vw]">
                {[40, 60, 45, 80, 55, 90, 70, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#FF5C49]/20 to-[#FF5C49] rounded-t-sm"
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
            className="flex-1 bg-[#FEFCF7] rounded-xl border border-[#1B2A4A]/10 p-[2vw] relative overflow-hidden"
            animate={phase >= 4 ? { scale: 1.05, boxShadow: '0 20px 50px rgba(27,42,74,0.05)', zIndex: 10 } : { scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-[2vw]">
              <div className="text-[#1B2A4A] font-bold text-[1.5vw]">Discovery Wall</div>
              <div className="text-[#FF5C49] text-[1vw] font-mono animate-pulse">LIVE</div>
            </div>
            
            <div className="flex flex-col gap-[1vw]">
              {[
                { user: "User_8492", song: "After You've Gone" },
                { user: "User_8509", song: "Danny Boy" },
                { user: "User_8526", song: "St. Louis Blues" },
                { user: "User_8543", song: "Some of These Days" }
              ].map((discovery, i) => (
                <motion.div 
                  key={i}
                  className="bg-white p-[1vw] rounded-lg border border-[#1B2A4A]/5 shadow-sm flex gap-[1vw] items-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ delay: phase >= 4 ? i * 0.2 : 0 }}
                >
                  <img src={`${import.meta.env.BASE_URL}images/avatar.png`} className="w-[3vw] h-[3vw] rounded-full object-cover border border-[#FF5C49]/20" />
                  <div className="flex-1">
                    <div className="text-[#1B2A4A] text-[1vw] font-bold">{discovery.user}</div>
                    <div className="text-[#FF5C49] text-[0.8vw]">Just discovered "{discovery.song}"</div>
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