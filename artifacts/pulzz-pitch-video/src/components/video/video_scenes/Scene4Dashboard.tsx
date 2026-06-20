import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Users, Play, SkipForward, Activity, Clock, Music2, BarChart2, Globe, Handshake } from 'lucide-react';

export function Scene4Dashboard() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 350),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 7000),
      setTimeout(() => setPhase(4), 13000),
      setTimeout(() => setPhase(5), 17500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(16px)' }}
      transition={{ duration: 0.45 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FEFCF7] to-[#FBF8F2]" />

      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[5vh]">
        <motion.div
          className="mb-[2.5vh] z-20"
          initial={{ opacity: 0, y: -24 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="text-[3.2vw] font-black text-[#1B2A4A] leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Real signal for <span className="text-[#FF5C49]">emerging artists.</span>
          </h2>
          <p className="text-[1.1vw] text-slate-500 mt-[0.3vh]">
            {phase < 4
              ? 'Watch pre-release momentum build — before you commit to a release date.'
              : phase === 4
              ? 'Find collaborators whose sound matches yours — on the Collaboration Wall.'
              : 'Post-release: track your song across every streaming platform via Songstats.'}
          </p>
        </motion.div>

        <motion.div
          className="flex-1 w-full bg-[#FBF8F2] rounded-t-[2vw] border-t border-x border-[#1B2A4A]/10 relative overflow-hidden shadow-2xl p-[1.8vw] flex flex-col gap-[1.8vw]"
          initial={{ y: '100%' }}
          animate={phase >= 2 ? { y: '0%' } : { y: '100%' }}
          transition={{ duration: 0.9, ease }}
        >
          <AnimatePresence mode="popLayout">

            {/* DISCOVERY POOL OVERVIEW */}
            {phase === 2 && (
              <motion.div key="overview" className="flex flex-col gap-[1.6vw] flex-1"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, position: 'absolute' }} transition={{ duration: 0.45 }}>
                <div className="grid grid-cols-4 gap-[1vw]">
                  {[
                    { label: 'Listeners', val: '12,408', icon: Users, color: '#3E5C99' },
                    { label: 'Discovered', val: '8,204', icon: Play, color: '#10b981' },
                    { label: 'Skipped', val: '4,204', icon: SkipForward, color: '#FF5C49' },
                    { label: 'Moment Marks', val: '24,392', icon: Activity, color: '#f59e0b' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-[1.1vw] border border-[#1B2A4A]/5 shadow-sm">
                      <div className="flex justify-between items-center mb-[0.8vw]">
                        <span className="text-slate-500 text-[0.78vw] font-medium">{s.label}</span>
                        <s.icon className="w-[1vw] h-[1vw]" style={{ color: s.color }} />
                      </div>
                      <div className="text-[1.9vw] font-bold text-[#1B2A4A]">{s.val}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.4vw] shadow-sm">
                  <div className="text-[#1B2A4A] text-[1.1vw] font-bold mb-[0.9vw]">Discovery Pool</div>
                  <div className="flex flex-col gap-[0.7vw]">
                    {[
                      { title: "St. Louis Blues", artist: "Bessie Smith", genre: "Blues", disc: 620, skip: 180 },
                      { title: "After You've Gone", artist: "Marion Harris", genre: "Jazz", disc: 480, skip: 120 },
                      { title: "Danny Boy", artist: "Ernestine Schumann-Heink", genre: "Folk", disc: 390, skip: 95 },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-[0.9vw] rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-[0.9vw]">
                          <div className="w-[2.8vw] h-[2.8vw] rounded-md bg-[#1B2A4A] opacity-80" style={{ opacity: 0.7 + i * 0.1 }} />
                          <div>
                            <div className="font-semibold text-[#1B2A4A] text-[0.95vw]">{s.title}</div>
                            <div className="text-[0.75vw] text-slate-500">{s.artist} · {s.genre}</div>
                          </div>
                        </div>
                        <div className="flex gap-[2vw] text-[0.85vw]">
                          <div className="text-right"><div className="text-slate-400 text-[0.72vw]">Discovered</div><div className="font-bold text-emerald-500">{s.disc}</div></div>
                          <div className="text-right"><div className="text-slate-400 text-[0.72vw]">Skipped</div><div className="font-bold text-[#FF5C49]">{s.skip}</div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PER-SONG ANALYTICS + SOUND DNA */}
            {phase === 3 && (
              <motion.div key="per-song" className="flex flex-col gap-[1.6vw] flex-1"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, position: 'absolute' }} transition={{ duration: 0.45 }}>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[4vw] h-[4vw] rounded-lg bg-[#1B2A4A]" />
                  <div>
                    <div className="text-[1.4vw] font-bold text-[#1B2A4A]">St. Louis Blues</div>
                    <div className="text-[0.85vw] text-slate-500">Bessie Smith · Blues · Pre-release</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[1.6vw] flex-1">
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.3vw] shadow-sm">
                    <div className="text-[#1B2A4A] text-[1.1vw] font-bold mb-[1.2vw]">Reactions</div>
                    {[{ label: 'Discovered', pct: 77, color: 'bg-emerald-500', tc: 'text-emerald-500' }, { label: 'Skipped', pct: 23, color: 'bg-[#FF5C49]', tc: 'text-[#FF5C49]' }].map((r, i) => (
                      <div key={i} className="flex items-center gap-[0.8vw] mb-[0.8vw]">
                        <span className="text-[0.82vw] text-slate-500 w-[5vw] shrink-0">{r.label}</span>
                        <div className="flex-1 h-[0.55vw] bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className={`h-full ${r.color} rounded-full`}
                            initial={{ width: 0 }} animate={{ width: `${r.pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }} />
                        </div>
                        <span className={`text-[0.82vw] font-bold ${r.tc} w-[2.2vw] text-right`}>{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.3vw] shadow-sm">
                    <div className="text-[#1B2A4A] text-[1.1vw] font-bold mb-[1vw]">Top Moments</div>
                    {[{ time: '0:32', pct: 100, marks: 450 }, { time: '1:10', pct: 68, marks: 308 }, { time: '2:05', pct: 42, marks: 189 }].map((m, i) => (
                      <div key={i} className="flex items-center gap-[0.8vw] mb-[0.6vw]">
                        <div className="flex items-center gap-[0.3vw] w-[2.8vw] text-slate-500">
                          <Clock className="w-[0.7vw] h-[0.7vw]" />
                          <span className="text-[0.75vw] font-mono">{m.time}</span>
                        </div>
                        <div className="flex-1 h-[0.38vw] bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-[#1B2A4A] rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                            transition={{ duration: 0.7, delay: i * 0.1 }} />
                        </div>
                        <span className="text-[0.72vw] text-slate-500 w-[3.5vw] text-right">{m.marks} marks</span>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-2 bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.3vw] shadow-sm">
                    <div className="flex items-center gap-[0.5vw] mb-[1vw]">
                      <div className="text-[#1B2A4A] text-[1.1vw] font-bold">Sound DNA</div>
                      <span className="bg-blue-100 text-blue-700 text-[0.65vw] font-bold px-[0.6vw] py-[0.15vw] rounded-full ml-auto">Cyanite AI</span>
                    </div>
                    <div className="grid grid-cols-5 gap-[1.5vw]">
                      {[
                        { label: 'Mood', val: 'Melancholic' },
                        { label: 'Genre', val: 'Blues · Soul' },
                        { label: 'Era', val: '1920s' },
                      ].map((d, i) => (
                        <div key={i}>
                          <div className="text-[0.72vw] text-slate-400 mb-[0.3vw]">{d.label}</div>
                          <div className="text-[1vw] font-bold text-[#1B2A4A]">{d.val}</div>
                        </div>
                      ))}
                      <div>
                        <div className="text-[0.72vw] text-slate-400 mb-[0.5vw]">Energy</div>
                        <div className="h-[0.38vw] bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[88%]" />
                        </div>
                      </div>
                      <div>
                        <div className="text-[0.72vw] text-slate-400 mb-[0.5vw]">Positivity</div>
                        <div className="h-[0.38vw] bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#3E5C99] w-[38%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* COLLABORATION WALL */}
            {phase === 4 && (
              <motion.div key="collab" className="flex flex-col gap-[1.8vw] flex-1 items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }}>
                <div className="text-center mb-[1vw]">
                  <div className="flex items-center justify-center gap-[0.8vw] mb-[1vw]">
                    <Handshake className="w-[2vw] h-[2vw] text-[#FF5C49]" />
                    <h3 className="text-[2.5vw] font-black text-[#1B2A4A]">Collaboration Wall</h3>
                  </div>
                  <p className="text-[1.1vw] text-slate-500 max-w-[50vw] mx-auto">Artists whose Sound DNA matches yours — find your next collaborator before you release.</p>
                </div>
                <div className="grid grid-cols-3 gap-[1.5vw] w-full max-w-[70vw]">
                  {[
                    { initials: 'BS', name: 'Bessie Smith', role: 'Blues · Vocalist', match: '94%', color: '#1B2A4A' },
                    { initials: 'MH', name: 'Marion Harris', role: 'Jazz · Vocalist', match: '89%', color: '#3E5C99' },
                    { initials: 'ST', name: 'Sophie Tucker', role: 'Jazz · Performer', match: '82%', color: '#FF5C49' },
                  ].map((a, i) => (
                    <motion.div key={i} className="bg-white rounded-2xl border border-[#1B2A4A]/8 p-[1.5vw] shadow-sm flex flex-col gap-[0.8vw]"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}>
                      <div className="flex items-center gap-[1vw]">
                        <div className="w-[3.5vw] h-[3.5vw] rounded-full flex items-center justify-center font-black text-white text-[1.2vw]"
                          style={{ background: a.color }}>{a.initials}</div>
                        <div>
                          <div className="font-bold text-[#1B2A4A] text-[1vw]">{a.name}</div>
                          <div className="text-[0.78vw] text-slate-500">{a.role}</div>
                        </div>
                      </div>
                      <div className="bg-slate-100 rounded-full px-[0.8vw] py-[0.35vw] text-[0.8vw] font-bold text-[#1B2A4A] inline-block w-fit">
                        Sound match: {a.match}
                      </div>
                      <div className="bg-[#FF5C49] text-white rounded-lg py-[0.6vw] text-center font-bold text-[0.82vw] cursor-pointer">
                        Request collaboration
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SONGSTATS POST-RELEASE */}
            {phase >= 5 && (
              <motion.div key="streaming" className="flex flex-col gap-[1.6vw] flex-1"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}>
                <div className="flex gap-[0.8vw] mb-[0.5vw]">
                  <div className="bg-[#1B2A4A] text-white px-[1.3vw] py-[0.45vw] rounded-full font-bold text-[0.9vw]">Your songs</div>
                  <div className="bg-slate-100 text-slate-400 px-[1.3vw] py-[0.45vw] rounded-full font-bold text-[0.9vw]">Artist overall</div>
                </div>
                <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.4vw] shadow-sm flex-1">
                  <div className="flex items-center gap-[0.5vw] mb-[1.8vw]">
                    <BarChart2 className="w-[1.4vw] h-[1.4vw] text-[#3E5C99]" />
                    <div className="text-[#1B2A4A] text-[1.1vw] font-bold">Streaming Stats</div>
                    <span className="text-[0.72vw] text-slate-400 ml-[0.4vw]">Songstats Enterprise</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[0.65vw] font-bold px-[0.6vw] py-[0.15vw] rounded-full ml-auto flex items-center gap-[0.3vw]">
                      <div className="w-[0.4vw] h-[0.4vw] bg-emerald-500 rounded-full" />Live
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-[1.5vw]">
                    {[
                      { label: 'Spotify Streams', val: '1.2M', color: '#1DB954', Icon: Music2 },
                      { label: 'Apple Music', val: '850K', color: '#FA243C', Icon: Music2 },
                      { label: 'Playlist Reach', val: '4.5M', color: '#f59e0b', Icon: Globe },
                      { label: 'Chart Entries', val: '12', color: '#8b5cf6', Icon: Activity },
                    ].map(({ label, val, color, Icon }, i) => (
                      <div key={i} className="bg-slate-50 p-[1.2vw] rounded-xl border border-slate-100 flex items-center gap-[0.9vw]">
                        <div className="w-[2.8vw] h-[2.8vw] rounded-full flex items-center justify-center" style={{ background: `${color}20` }}>
                          <Icon className="w-[1.4vw] h-[1.4vw]" style={{ color }} />
                        </div>
                        <div>
                          <div className="text-[0.8vw] text-slate-500">{label}</div>
                          <div className="text-[1.7vw] font-bold text-[#1B2A4A]">{val}</div>
                        </div>
                      </div>
                    ))}
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
