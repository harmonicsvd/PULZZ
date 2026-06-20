import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Users, Play, SkipForward, Activity, Clock, Music2, BarChart2, Globe } from 'lucide-react';

export function Scene4Dashboard() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // title enter
      setTimeout(() => setPhase(2), 2500),  // overall dashboard
      setTimeout(() => setPhase(3), 8000),  // per-song analytics 
      setTimeout(() => setPhase(4), 16000), // sound DNA
      setTimeout(() => setPhase(5), 20000), // streaming stats / songstats
      setTimeout(() => setPhase(6), 26000), // fade out
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
          className="mb-[3vh] z-20"
        >
          <h2 className="text-[3.5vw] font-black text-[#1B2A4A] leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Real-time analytics for <span className="text-[#FF5C49]">Creators.</span>
          </h2>
          <p className="text-[1.2vw] text-slate-600">
            {phase < 5 
              ? "Watch your pre-release momentum build live." 
              : "Track overall impact across Apple Music & Spotify via Songstats."}
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          className="flex-1 w-full bg-[#FBF8F2] rounded-t-[2vw] border-t border-x border-[#1B2A4A]/10 relative overflow-hidden shadow-2xl p-[2vw] flex flex-col gap-[2vw]"
          initial={{ y: '100%' }}
          animate={phase >= 2 ? { y: '0%' } : { y: '100%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="popLayout">
            {/* OVERALL ANALYTICS (Phase 2) */}
            {phase === 2 && (
              <motion.div 
                key="overall"
                className="flex flex-col gap-[2vw] flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, position: 'absolute' }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-4 gap-[1vw]">
                  {[
                    { label: 'Total Listeners', val: '12,408', icon: Users, color: '#3E5C99' },
                    { label: 'Total Discovered', val: '8,204', icon: Play, color: '#10b981' },
                    { label: 'Total Skipped', val: '4,204', icon: SkipForward, color: '#FF5C49' },
                    { label: 'Moment Marks', val: '24,392', icon: Activity, color: '#f59e0b' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-[1.2vw] border border-[#1B2A4A]/5 relative overflow-hidden shadow-sm">
                      <div className="flex justify-between items-center mb-[1vw]">
                        <div className="text-slate-500 text-[0.8vw] font-medium">{stat.label}</div>
                        <stat.icon className="w-[1vw] h-[1vw]" style={{ color: stat.color }} />
                      </div>
                      <div className="text-[2vw] font-bold text-[#1B2A4A]">{stat.val}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.5vw] shadow-sm">
                  <div className="text-[#1B2A4A] text-[1.2vw] font-bold mb-[1vw]">Recent Activity</div>
                  <div className="flex flex-col gap-[0.8vw]">
                    <div className="flex items-center justify-between p-[1vw] rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-[1vw]">
                        <div className="w-[3vw] h-[3vw] rounded-md bg-[#3E5C99]" />
                        <div>
                          <div className="font-semibold text-[#1B2A4A] text-[1vw]">Midnight Echoes</div>
                          <div className="text-[0.8vw] text-slate-500">In Discovery Pool • Jazz</div>
                        </div>
                      </div>
                      <div className="flex gap-[2vw] text-[0.9vw]">
                        <div className="flex flex-col items-end">
                          <span className="text-slate-500">Discovered</span>
                          <span className="font-semibold text-emerald-500">420</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-slate-500">Skipped</span>
                          <span className="font-semibold text-[#FF5C49]">180</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PER-SONG ANALYTICS (Phase 3 & 4) */}
            {(phase >= 3 && phase <= 4) && (
              <motion.div 
                key="per-song"
                className="flex flex-col gap-[2vw] flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, position: 'absolute' }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[4vw] h-[4vw] rounded-lg bg-[#3E5C99]" />
                  <div>
                    <div className="text-[1.5vw] font-bold text-[#1B2A4A]">Midnight Echoes</div>
                    <div className="text-[0.9vw] text-slate-500">Song Detail</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-[2vw]">
                  {/* Reactions */}
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.5vw] shadow-sm">
                    <div className="text-[#1B2A4A] text-[1.2vw] font-bold mb-[1.5vw]">Reaction Breakdown</div>
                    <div className="flex items-center gap-[1vw] mb-[1vw]">
                      <span className="text-[0.9vw] text-slate-500 w-[5vw]">Discovered</span>
                      <div className="flex-1 h-[0.6vw] bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[70%]" />
                      </div>
                      <span className="text-[0.9vw] font-bold text-emerald-500 w-[2vw]">70%</span>
                    </div>
                    <div className="flex items-center gap-[1vw]">
                      <span className="text-[0.9vw] text-slate-500 w-[5vw]">Skipped</span>
                      <div className="flex-1 h-[0.6vw] bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF5C49] w-[30%]" />
                      </div>
                      <span className="text-[0.9vw] font-bold text-[#FF5C49] w-[2vw]">30%</span>
                    </div>
                  </div>

                  {/* Moments */}
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.5vw] shadow-sm">
                    <div className="text-[#1B2A4A] text-[1.2vw] font-bold mb-[1vw]">Top Moments</div>
                    <div className="space-y-[0.8vw]">
                      {[
                        { time: "1:24", pct: 100, marks: 450 },
                        { time: "0:45", pct: 75, marks: 320 }
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-[1vw]">
                          <div className="flex items-center gap-[0.3vw] w-[3vw] text-slate-500">
                            <Clock className="w-[0.8vw] h-[0.8vw]" />
                            <span className="text-[0.8vw] font-mono">{m.time}</span>
                          </div>
                          <div className="flex-1 h-[0.4vw] bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1B2A4A]" style={{ width: `${m.pct}%` }} />
                          </div>
                          <span className="text-[0.8vw] text-slate-500">{m.marks} marks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sound DNA */}
                {phase >= 4 && (
                  <motion.div 
                    className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.5vw] shadow-sm flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-[#1B2A4A] text-[1.2vw] font-bold mb-[1vw]">Sound DNA (Cyanite)</div>
                    <div className="grid grid-cols-4 gap-[2vw]">
                      <div>
                        <div className="text-[0.8vw] text-slate-500 mb-1">Tempo</div>
                        <div className="text-[1.2vw] font-bold text-[#1B2A4A]">124 BPM</div>
                      </div>
                      <div>
                        <div className="text-[0.8vw] text-slate-500 mb-1">Key</div>
                        <div className="text-[1.2vw] font-bold text-[#1B2A4A]">C Minor</div>
                      </div>
                      <div>
                        <div className="text-[0.8vw] text-slate-500 mb-1">Energy</div>
                        <div className="h-[0.4vw] bg-slate-100 rounded-full overflow-hidden mt-[0.5vw]">
                          <div className="h-full bg-amber-500 w-[85%]" />
                        </div>
                      </div>
                      <div>
                        <div className="text-[0.8vw] text-slate-500 mb-1">Positivity</div>
                        <div className="h-[0.4vw] bg-slate-100 rounded-full overflow-hidden mt-[0.5vw]">
                          <div className="h-full bg-[#3E5C99] w-[60%]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-[1vw] mt-[1vw]">
                      <span className="bg-slate-100 text-slate-600 px-[0.8vw] py-[0.4vw] rounded-full text-[0.8vw] font-bold">Jazz</span>
                      <span className="bg-slate-100 text-slate-600 px-[0.8vw] py-[0.4vw] rounded-full text-[0.8vw] font-bold">Electronic</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SONGSTATS / POST-RELEASE (Phase 5) */}
            {phase >= 5 && (
              <motion.div 
                key="streaming"
                className="flex flex-col gap-[2vw] flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex gap-[1vw] mb-[1vw]">
                  <div className="bg-[#1B2A4A] text-white px-[1.5vw] py-[0.5vw] rounded-full font-bold text-[1vw]">Your songs</div>
                  <div className="bg-slate-100 text-slate-500 px-[1.5vw] py-[0.5vw] rounded-full font-bold text-[1vw]">Artist overall</div>
                </div>

                <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.5vw] shadow-sm flex-1">
                  <div className="flex items-center gap-[0.5vw] mb-[2vw]">
                    <BarChart2 className="w-[1.5vw] h-[1.5vw] text-[#3E5C99]" />
                    <div className="text-[#1B2A4A] text-[1.2vw] font-bold">Streaming Stats</div>
                    <span className="bg-emerald-100 text-emerald-700 text-[0.7vw] font-bold px-[0.6vw] py-[0.2vw] rounded-full ml-auto flex items-center gap-[0.3vw]">
                      <div className="w-[0.4vw] h-[0.4vw] bg-emerald-500 rounded-full" /> Live
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-[2vw]">
                    <div className="bg-slate-50 p-[1.5vw] rounded-xl border border-slate-100 flex items-center gap-[1vw]">
                      <div className="w-[3vw] h-[3vw] bg-[#1DB954]/20 rounded-full flex items-center justify-center">
                        <Music2 className="w-[1.5vw] h-[1.5vw] text-[#1DB954]" />
                      </div>
                      <div>
                        <div className="text-[0.9vw] text-slate-500">Spotify Streams</div>
                        <div className="text-[1.8vw] font-bold text-[#1B2A4A]">1.2M</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-[1.5vw] rounded-xl border border-slate-100 flex items-center gap-[1vw]">
                      <div className="w-[3vw] h-[3vw] bg-[#FA243C]/20 rounded-full flex items-center justify-center">
                        <Music2 className="w-[1.5vw] h-[1.5vw] text-[#FA243C]" />
                      </div>
                      <div>
                        <div className="text-[0.9vw] text-slate-500">Apple Music</div>
                        <div className="text-[1.8vw] font-bold text-[#1B2A4A]">850K</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-[1.5vw] rounded-xl border border-slate-100 flex items-center gap-[1vw]">
                      <div className="w-[3vw] h-[3vw] bg-amber-500/20 rounded-full flex items-center justify-center">
                        <Globe className="w-[1.5vw] h-[1.5vw] text-amber-500" />
                      </div>
                      <div>
                        <div className="text-[0.9vw] text-slate-500">Playlist Reach</div>
                        <div className="text-[1.8vw] font-bold text-[#1B2A4A]">4.5M</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-[1.5vw] rounded-xl border border-slate-100 flex items-center gap-[1vw]">
                      <div className="w-[3vw] h-[3vw] bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Activity className="w-[1.5vw] h-[1.5vw] text-purple-500" />
                      </div>
                      <div>
                        <div className="text-[0.9vw] text-slate-500">Chart Entries</div>
                        <div className="text-[1.8vw] font-bold text-[#1B2A4A]">12</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
