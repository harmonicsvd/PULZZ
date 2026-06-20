import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Feather } from 'lucide-react';

export function Scene4Artist() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500), // dashboard UI enter
      setTimeout(() => setPhase(3), 5000), // stats populate
      setTimeout(() => setPhase(4), 9000), // discovery wall focus
      setTimeout(() => setPhase(5), 14000), // collaborator section appears
      setTimeout(() => setPhase(6), 18000), // collaborator highlight
      setTimeout(() => setPhase(7), 26000), // fade out
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
      
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[6vh]">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          className="mb-[3vh] z-20 flex justify-between items-end"
        >
          <div>
            <h2 className="text-[3.5vw] font-black text-[#1B2A4A] leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {phase < 5 ? (
                <>Real-time analytics for <span className="text-[#FF5C49]">Creators.</span></>
              ) : (
                <>Find your <span className="text-[#FF5C49]">Creative Match.</span></>
              )}
            </h2>
            <p className="text-[1.2vw] text-slate-600">
              {phase < 5 
                ? "Watch your pre-release momentum build live." 
                : "Match with artists based on sonic identity and complementary roles."}
            </p>
          </div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          className="flex-1 w-full bg-[#FBF8F2] rounded-t-[2vw] border-t border-x border-[#1B2A4A]/10 relative overflow-hidden shadow-2xl p-[2vw] flex gap-[2vw]"
          initial={{ y: '100%' }}
          animate={phase >= 2 ? { y: '0%' } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Content Area */}
          <div className="flex-[2] flex flex-col gap-[2vw]">
            
            <AnimatePresence mode="popLayout">
              {phase < 5 ? (
                <motion.div 
                  key="dashboard"
                  className="flex flex-col gap-[2vw] flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, position: 'absolute' }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Top Stats */}
                  <div className="grid grid-cols-4 gap-[1vw]">
                    {[
                      { label: 'Total Listeners', val: '12,408', icon: 'users', color: '#3E5C99' },
                      { label: 'Total Discovered', val: '8,204', icon: 'play', color: '#10b981' },
                      { label: 'Total Skipped', val: '4,204', icon: 'skip-forward', color: '#FF5C49' },
                      { label: 'Moment Marks', val: '24,392', icon: 'activity', color: '#f59e0b' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white rounded-xl p-[1.2vw] border border-[#1B2A4A]/5 relative overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center mb-[1vw]">
                          <div className="text-slate-500 text-[0.8vw] font-medium">{stat.label}</div>
                          <Feather name={stat.icon} className="w-[1vw] h-[1vw]" style={{ color: stat.color }} />
                        </div>
                        <motion.div 
                          className="text-[2vw] font-bold text-[#1B2A4A]"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ delay: phase >= 3 ? i * 0.1 : 0 }}
                        >
                          {stat.val}
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.5vw] flex flex-col shadow-sm">
                    <div className="text-[#1B2A4A] text-[1.2vw] font-bold mb-[1vw]">Recent Activity</div>
                    <div className="flex flex-col gap-[0.8vw]">
                      {[
                        { title: "Midnight Echoes", genre: "Jazz", discovered: 420, skipped: 180, color: '#3E5C99' },
                        { title: "Neon Pulse", genre: "Electronic", discovered: 850, skipped: 210, color: '#FF5C49' }
                      ].map((song, i) => (
                        <div key={i} className="flex items-center justify-between p-[1vw] rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="flex items-center gap-[1vw]">
                            <div className="w-[3vw] h-[3vw] rounded-md" style={{ backgroundColor: song.color }} />
                            <div>
                              <div className="font-semibold text-[#1B2A4A] text-[1vw]">{song.title}</div>
                              <div className="text-[0.8vw] text-slate-500">In Discovery Pool • {song.genre}</div>
                            </div>
                          </div>
                          <div className="flex gap-[2vw] text-[0.9vw]">
                            <div className="flex flex-col items-end">
                              <span className="text-slate-500">Discovered</span>
                              <span className="font-semibold text-emerald-500">{song.discovered}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-slate-500">Skipped</span>
                              <span className="font-semibold text-[#FF5C49]">{song.skipped}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="collaborators"
                  className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-[0.5vw] mb-[1.5vw]">
                    <Feather name="sparkles" className="w-[1.5vw] h-[1.5vw] text-[#FF5C49]" />
                    <div className="text-[#1B2A4A] text-[1.5vw] font-bold tracking-tight">Suggested collaborators</div>
                  </div>
                  <div className="text-[1vw] text-slate-500 mb-[2vw]">Matched to fill the gaps around your roles (Singer, Composer).</div>
                  
                  <div className="grid grid-cols-2 gap-[1.5vw]">
                    {[
                      { name: "Alex Rivers", role: "Producer, Mix Engineer", match: 92, initial: "AR" },
                      { name: "Sam Chen", role: "Lyricist, Instrumentalist", match: 85, initial: "SC" }
                    ].map((collab, i) => (
                      <motion.div 
                        key={i}
                        className={`bg-white rounded-xl border p-[1.5vw] shadow-sm relative overflow-hidden ${i === 0 && phase >= 6 ? 'border-[#FF5C49] ring-2 ring-[#FF5C49]/20' : 'border-[#1B2A4A]/10'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        {i === 0 && phase >= 6 && (
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-[#FF5C49]/5 to-transparent pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                        <div className="flex items-center gap-[1vw] mb-[1.5vw]">
                          <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-[#1B2A4A]/5 text-[#1B2A4A] flex items-center justify-center font-bold text-[1.2vw]">
                            {collab.initial}
                          </div>
                          <div>
                            <div className="font-bold text-[#1B2A4A] text-[1.2vw]">{collab.name}</div>
                            <div className="text-[0.85vw] text-slate-500">Electronic • London</div>
                          </div>
                        </div>
                        <div className="text-[0.9vw] text-slate-500 mb-[1vw]">
                          Brings: <span className="font-semibold text-[#1B2A4A]">{collab.role}</span>
                        </div>
                        <div className="bg-slate-100 text-[#1B2A4A] text-[0.8vw] font-semibold px-[0.8vw] py-[0.4vw] rounded-full inline-block mb-[1.5vw]">
                          Sounds {collab.match}% alike
                        </div>
                        <motion.div 
                          className={`w-full py-[0.8vw] rounded-lg flex items-center justify-center gap-[0.5vw] text-[0.9vw] font-bold ${i === 0 && phase >= 6 ? 'bg-[#FF5C49] text-white' : 'bg-slate-100 text-[#1B2A4A] hover:bg-slate-200'}`}
                          animate={i === 0 && phase >= 6 ? { scale: [1, 1.03, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <Feather name="handshake" className="w-[1vw] h-[1vw]" />
                          Request collaboration
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Discovery Wall Sidebar */}
          <motion.div 
            className="flex-1 bg-white rounded-xl border border-[#1B2A4A]/10 p-[1.5vw] relative overflow-hidden shadow-sm"
            animate={phase >= 4 && phase < 5 ? { scale: 1.02, boxShadow: '0 20px 50px rgba(27,42,74,0.08)', zIndex: 10 } : { scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-[1.5vw]">
              <div className="text-[#1B2A4A] font-bold text-[1.2vw]">Discovery Wall</div>
            </div>
            <div className="text-[0.85vw] text-slate-500 mb-[1.5vw]">Top listeners who discovered your songs in the pool this week.</div>
            
            <div className="flex flex-col gap-[1vw]">
              {[
                { name: "Sarah J.", found: 42, pts: "1,250", rank: 1, color: "from-[#FF5C49]/10 to-transparent" },
                { name: "Mike T.", found: 38, pts: "1,120", rank: 2, color: "from-[#3E5C99]/10 to-transparent" },
                { name: "Elena R.", found: 31, pts: "980", rank: 3, color: "from-amber-500/10 to-transparent" }
              ].map((entry, i) => (
                <motion.div 
                  key={i}
                  className={`bg-white p-[1vw] rounded-lg border flex gap-[1vw] items-center relative overflow-hidden ${entry.rank === 1 ? 'border-[#FF5C49]/30 ring-1 ring-[#FF5C49]/20' : 'border-[#1B2A4A]/5'}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ delay: phase >= 3 ? i * 0.15 : 0 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${entry.color} pointer-events-none`} />
                  <div className="text-[2vw] font-black text-slate-200/50 absolute -right-[0.5vw] -top-[0.5vw]">#{entry.rank}</div>
                  
                  <div className="w-[2.5vw] h-[2.5vw] rounded-full bg-slate-100 flex items-center justify-center z-10">
                    <Feather name="user" className="w-[1.2vw] h-[1.2vw] text-slate-500" />
                  </div>
                  <div className="flex-1 z-10">
                    <div className="text-[#1B2A4A] text-[1vw] font-bold">{entry.name}</div>
                    <div className="flex items-center gap-[1vw] mt-[0.2vw]">
                      <div className="flex items-center gap-[0.3vw]">
                        <Feather name="star" className="w-[0.7vw] h-[0.7vw] text-[#3E5C99]" />
                        <span className="text-[0.75vw] text-slate-600"><span className="font-bold text-[#1B2A4A]">{entry.found}</span> discovered</span>
                      </div>
                      <div className="flex items-center gap-[0.3vw]">
                        <Feather name="zap" className="w-[0.7vw] h-[0.7vw] text-amber-500" />
                        <span className="text-[0.75vw] text-slate-600"><span className="font-bold text-[#1B2A4A]">{entry.pts}</span> pts</span>
                      </div>
                    </div>
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