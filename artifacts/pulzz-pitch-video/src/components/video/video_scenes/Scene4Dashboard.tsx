import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Users, Play, SkipForward, Activity, Clock, Music2, BarChart2, Globe, Handshake, AlignLeft } from 'lucide-react';

export function Scene4Dashboard() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 7000),  // Discovery Pool → 4.8 s
      setTimeout(() => setPhase(4), 12000), // Per-song → 5 s
      setTimeout(() => setPhase(5), 17000), // Artist overall (collab wall = 5 s)
      setTimeout(() => setPhase(6), 21000), // Your songs (artist overall = 4 s)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  const subtitles: Record<number, string> = {
    2: 'Watch pre-release momentum build — before you commit to a release date.',
    3: 'Per-song analytics: reactions, moment marks, Sound DNA and lyric analysis.',
    4: 'Find collaborators whose sound matches yours — on the Collaboration Wall.',
    5: 'Post-release: track your song across every streaming platform via Songstats.',
    6: 'Drill into each song — see which tracks are breaking out on which platforms.',
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(16px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FEFCF7] to-[#FBF8F2]" />

      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[4vh]">

        {/* Header */}
        <motion.div
          className="mb-[2vh] z-20"
          initial={{ opacity: 0, y: -24 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
          transition={{ duration: 0.75, ease }}
        >
          <h2
            className="text-[3.2vw] font-black text-[#1B2A4A] leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Real signal for <span className="text-[#FF5C49]">emerging artists.</span>
          </h2>
          <motion.p
            key={phase}
            className="text-[1.1vw] text-slate-500 mt-[0.3vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {subtitles[phase] ?? subtitles[2]}
          </motion.p>
        </motion.div>

        {/* Dashboard panel */}
        <motion.div
          className="flex-1 w-full bg-[#FBF8F2] rounded-t-[2vw] border-t border-x border-[#1B2A4A]/10 relative overflow-hidden shadow-2xl p-[1.8vw] flex flex-col gap-[1.6vw]"
          initial={{ y: '100%' }}
          animate={phase >= 2 ? { y: '0%' } : { y: '100%' }}
          transition={{ duration: 1.0, ease }}
        >
          {/* mode="wait" — each panel fully exits before the next enters */}
          <AnimatePresence mode="wait">

            {/* DISCOVERY POOL OVERVIEW */}
            {phase === 2 && (
              <motion.div key="overview" className="flex flex-col gap-[1.6vw] flex-1"
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }} transition={{ duration: 0.3 }}>
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
                      <div className="text-[2vw] font-bold text-[#1B2A4A]">{s.val}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.4vw] shadow-sm">
                  <div className="text-[#1B2A4A] text-[1.1vw] font-bold mb-[1vw]">Discovery Pool</div>
                  <div className="flex flex-col gap-[0.75vw]">
                    {[
                      { title: 'St. Louis Blues', artist: 'Bessie Smith', genre: 'Blues', disc: 620, skip: 180 },
                      { title: "After You've Gone", artist: 'Marion Harris', genre: 'Jazz', disc: 480, skip: 120 },
                      { title: 'Danny Boy', artist: 'Ernestine Schumann-Heink', genre: 'Folk', disc: 390, skip: 95 },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-[0.9vw] rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-[0.9vw]">
                          <div className="w-[2.8vw] h-[2.8vw] rounded-md bg-[#1B2A4A]" style={{ opacity: 0.7 + i * 0.1 }} />
                          <div>
                            <div className="font-semibold text-[#1B2A4A] text-[0.95vw]">{s.title}</div>
                            <div className="text-[0.75vw] text-slate-500">{s.artist} · {s.genre}</div>
                          </div>
                        </div>
                        <div className="flex gap-[2vw]">
                          <div className="text-right"><div className="text-slate-400 text-[0.72vw]">Discovered</div><div className="font-bold text-emerald-500 text-[0.85vw]">{s.disc}</div></div>
                          <div className="text-right"><div className="text-slate-400 text-[0.72vw]">Skipped</div><div className="font-bold text-[#FF5C49] text-[0.85vw]">{s.skip}</div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PER-SONG: Reactions + Moments + Sound DNA + Lyrics Analysis */}
            {phase === 3 && (
              <motion.div key="per-song" className="flex flex-col gap-[1.4vw] flex-1"
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[3.5vw] h-[3.5vw] rounded-lg bg-[#1B2A4A]" />
                  <div>
                    <div className="text-[1.3vw] font-bold text-[#1B2A4A]">St. Louis Blues</div>
                    <div className="text-[0.82vw] text-slate-500">Bessie Smith · Blues · Pre-release</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[1.4vw] flex-1">
                  {/* Reactions */}
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.2vw] shadow-sm">
                    <div className="text-[#1B2A4A] text-[1vw] font-bold mb-[1vw]">Reactions</div>
                    {[{ label: 'Discovered', pct: 77, color: 'bg-emerald-500', tc: 'text-emerald-500' }, { label: 'Skipped', pct: 23, color: 'bg-[#FF5C49]', tc: 'text-[#FF5C49]' }].map((r, i) => (
                      <div key={i} className="flex items-center gap-[0.8vw] mb-[0.8vw]">
                        <span className="text-[0.78vw] text-slate-500 w-[5vw] shrink-0">{r.label}</span>
                        <div className="flex-1 h-[0.5vw] bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className={`h-full ${r.color} rounded-full`}
                            initial={{ width: 0 }} animate={{ width: `${r.pct}%` }}
                            transition={{ duration: 1.0, delay: i * 0.18, ease: 'easeOut' }} />
                        </div>
                        <span className={`text-[0.78vw] font-bold ${r.tc} w-[2.2vw] text-right`}>{r.pct}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Top Moments */}
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.2vw] shadow-sm">
                    <div className="text-[#1B2A4A] text-[1vw] font-bold mb-[0.9vw]">Top Moments</div>
                    {[{ time: '0:32', pct: 100, marks: 450 }, { time: '1:10', pct: 68, marks: 308 }, { time: '2:05', pct: 42, marks: 189 }].map((m, i) => (
                      <div key={i} className="flex items-center gap-[0.8vw] mb-[0.6vw]">
                        <div className="flex items-center gap-[0.3vw] w-[2.8vw] text-slate-500">
                          <Clock className="w-[0.65vw] h-[0.65vw]" />
                          <span className="text-[0.72vw] font-mono">{m.time}</span>
                        </div>
                        <div className="flex-1 h-[0.38vw] bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-[#1B2A4A] rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                            transition={{ duration: 0.9, delay: i * 0.12 }} />
                        </div>
                        <span className="text-[0.68vw] text-slate-500 w-[3.5vw] text-right">{m.marks} marks</span>
                      </div>
                    ))}
                  </div>

                  {/* Sound DNA — Cyanite */}
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.2vw] shadow-sm">
                    <div className="flex items-center gap-[0.5vw] mb-[0.9vw]">
                      <div className="text-[#1B2A4A] text-[1vw] font-bold">Sound DNA</div>
                      <span className="bg-blue-100 text-blue-700 text-[0.62vw] font-bold px-[0.6vw] py-[0.12vw] rounded-full ml-auto">Cyanite AI</span>
                    </div>
                    <div className="grid grid-cols-3 gap-[0.8vw] mb-[0.9vw]">
                      {[{ label: 'Mood', val: 'Melancholic' }, { label: 'Genre', val: 'Blues' }, { label: 'Era', val: '1920s' }].map((d, i) => (
                        <div key={i}>
                          <div className="text-[0.68vw] text-slate-400 mb-[0.2vw]">{d.label}</div>
                          <div className="text-[0.88vw] font-bold text-[#1B2A4A]">{d.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-[0.5vw]">
                      {[{ label: 'Energy', pct: 88, color: 'bg-amber-500' }, { label: 'Valence', pct: 38, color: 'bg-[#3E5C99]' }, { label: 'Arousal', pct: 72, color: 'bg-[#FF5C49]' }].map((b, i) => (
                        <div key={i} className="flex items-center gap-[0.6vw]">
                          <span className="text-[0.65vw] text-slate-400 w-[3.5vw] shrink-0">{b.label}</span>
                          <div className="flex-1 h-[0.32vw] bg-slate-100 rounded-full overflow-hidden">
                            <motion.div className={`h-full ${b.color} rounded-full`}
                              initial={{ width: 0 }} animate={{ width: `${b.pct}%` }}
                              transition={{ duration: 0.9, delay: i * 0.1 + 0.3 }} />
                          </div>
                          <span className="text-[0.62vw] font-bold text-slate-500 w-[2vw] text-right">{b.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lyrics Analysis — Musixmatch */}
                  <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.2vw] shadow-sm">
                    <div className="flex items-center gap-[0.5vw] mb-[0.9vw]">
                      <AlignLeft className="w-[1vw] h-[1vw] text-rose-500" />
                      <div className="text-[#1B2A4A] text-[1vw] font-bold">Lyrics Analysis</div>
                      <span className="bg-rose-100 text-rose-700 text-[0.62vw] font-bold px-[0.6vw] py-[0.12vw] rounded-full ml-auto">Musixmatch</span>
                    </div>
                    <div className="grid grid-cols-2 gap-[0.9vw] mb-[0.9vw]">
                      {[{ label: 'Mood', val: 'Sorrowful' }, { label: 'Theme', val: 'Lost love' }, { label: 'Language', val: 'English' }, { label: 'LRC Sync', val: '✓ Line-by-line' }].map((d, i) => (
                        <div key={i}>
                          <div className="text-[0.68vw] text-slate-400 mb-[0.2vw]">{d.label}</div>
                          <div className="text-[0.88vw] font-bold text-[#1B2A4A]">{d.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-[0.7vw] border border-slate-100">
                      <div className="text-[0.68vw] text-slate-400 mb-[0.4vw]">Synced lyric preview</div>
                      {["♪ I hate to see that evening sun go down", "Hate to see that evening sun go down"].map((line, i) => (
                        <motion.div key={i}
                          className={`text-[0.72vw] font-medium ${i === 0 ? 'text-[#FF5C49]' : 'text-slate-400'} truncate`}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.2 + 0.5 }}>{line}</motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* COLLABORATION WALL */}
            {phase === 4 && (
              <motion.div key="collab" className="flex flex-col gap-[1.8vw] flex-1 items-center justify-center"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-[1vw]">
                  <div className="flex items-center justify-center gap-[0.8vw] mb-[1vw]">
                    <Handshake className="w-[2vw] h-[2vw] text-[#FF5C49]" />
                    <h3 className="text-[2.5vw] font-black text-[#1B2A4A]">Collaboration Wall</h3>
                  </div>
                  <p className="text-[1.1vw] text-slate-500 max-w-[52vw] mx-auto">
                    Artists whose Sound DNA matches yours — find your next collaborator before you release.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-[1.8vw] w-full max-w-[72vw]">
                  {[
                    { initials: 'BS', name: 'Bessie Smith', role: 'Blues · Vocalist', match: '94%', color: '#1B2A4A' },
                    { initials: 'MH', name: 'Marion Harris', role: 'Jazz · Vocalist', match: '89%', color: '#3E5C99' },
                    { initials: 'ST', name: 'Sophie Tucker', role: 'Jazz · Performer', match: '82%', color: '#FF5C49' },
                  ].map((a, i) => (
                    <motion.div key={i} className="bg-white rounded-2xl border border-[#1B2A4A]/8 p-[1.5vw] shadow-sm flex flex-col gap-[0.8vw]"
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 + 0.25 }}>
                      <div className="flex items-center gap-[1vw]">
                        <div className="w-[3.5vw] h-[3.5vw] rounded-full flex items-center justify-center font-black text-white text-[1.2vw]"
                          style={{ background: a.color }}>{a.initials}</div>
                        <div>
                          <div className="font-bold text-[#1B2A4A] text-[1vw]">{a.name}</div>
                          <div className="text-[0.78vw] text-slate-500">{a.role}</div>
                        </div>
                      </div>
                      <div className="bg-slate-100 rounded-full px-[0.8vw] py-[0.35vw] text-[0.8vw] font-bold text-[#1B2A4A] w-fit">
                        Sound match: {a.match}
                      </div>
                      <div className="bg-[#FF5C49] text-white rounded-lg py-[0.6vw] text-center font-bold text-[0.82vw]">
                        Request collaboration
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SONGSTATS — Artist overall (phase 5) then Your songs (phase 6) */}
            {phase >= 5 && (
              <motion.div key={phase >= 6 ? 'your-songs' : 'artist-overall'}
                className="flex flex-col gap-[1.6vw] flex-1"
                initial={{ opacity: 0, x: phase >= 6 ? 18 : -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}>

                {/* Tab bar — active tab animates */}
                <div className="flex gap-[0.8vw] mb-[0.4vw]">
                  <motion.div
                    className="px-[1.3vw] py-[0.45vw] rounded-full font-bold text-[0.9vw]"
                    animate={phase >= 6
                      ? { backgroundColor: '#F1F5F9', color: '#94a3b8' }
                      : { backgroundColor: '#1B2A4A', color: '#ffffff' }}
                    transition={{ duration: 0.35 }}
                  >Artist overall</motion.div>
                  <motion.div
                    className="px-[1.3vw] py-[0.45vw] rounded-full font-bold text-[0.9vw]"
                    animate={phase >= 6
                      ? { backgroundColor: '#1B2A4A', color: '#ffffff' }
                      : { backgroundColor: '#F1F5F9', color: '#94a3b8' }}
                    transition={{ duration: 0.35 }}
                  >Your songs</motion.div>
                </div>

                <div className="bg-white rounded-xl border border-[#1B2A4A]/5 p-[1.4vw] shadow-sm flex-1">
                  <div className="flex items-center gap-[0.5vw] mb-[1.4vw]">
                    <BarChart2 className="w-[1.4vw] h-[1.4vw] text-[#3E5C99]" />
                    <div className="text-[#1B2A4A] text-[1.1vw] font-bold">
                      {phase >= 6 ? 'Your Songs' : 'Streaming Stats'}
                    </div>
                    <span className="text-[0.82vw] font-semibold text-[#1B2A4A]/60 ml-[0.2vw]">· Bessie Smith</span>
                    <span className="text-[0.72vw] text-slate-400 ml-[0.4vw]">Songstats Enterprise</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[0.65vw] font-bold px-[0.6vw] py-[0.15vw] rounded-full ml-auto flex items-center gap-[0.3vw]">
                      <div className="w-[0.4vw] h-[0.4vw] bg-emerald-500 rounded-full" />Live
                    </span>
                  </div>

                  {/* Artist overall content */}
                  {phase < 6 && (
                    <div className="grid grid-cols-2 gap-[1.4vw]">
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
                            <div className="text-[1.8vw] font-bold text-[#1B2A4A]">{val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Your songs content */}
                  {phase >= 6 && (
                    <div className="flex flex-col gap-[0.9vw]">
                      {[
                        { title: 'St. Louis Blues', artist: 'Bessie Smith', spotify: '480K', apple: '320K', playlist: '1.8M', trend: '+12%' },
                        { title: 'Downhearted Blues', artist: 'Bessie Smith', spotify: '390K', apple: '280K', playlist: '1.2M', trend: '+8%' },
                        { title: 'Back Water Blues', artist: 'Bessie Smith', spotify: '210K', apple: '180K', playlist: '900K', trend: '+5%' },
                      ].map((song, i) => (
                        <motion.div
                          key={i}
                          className="bg-slate-50 rounded-xl border border-slate-100 p-[1vw] flex items-center gap-[1vw]"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 + 0.15 }}
                        >
                          <div className="w-[3vw] h-[3vw] rounded-lg bg-[#1B2A4A] shrink-0" style={{ opacity: 0.65 + i * 0.12 }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[0.95vw] font-bold text-[#1B2A4A] truncate">{song.title}</div>
                            <div className="text-[0.72vw] text-slate-500 truncate">{song.artist}</div>
                          </div>
                          <div className="flex gap-[1.5vw] shrink-0">
                            <div className="text-center">
                              <div className="text-[0.65vw] text-slate-400 mb-[0.1vw]">Spotify</div>
                              <div className="text-[0.9vw] font-bold text-[#1DB954]">{song.spotify}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[0.65vw] text-slate-400 mb-[0.1vw]">Apple</div>
                              <div className="text-[0.9vw] font-bold text-[#FA243C]">{song.apple}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[0.65vw] text-slate-400 mb-[0.1vw]">Playlists</div>
                              <div className="text-[0.9vw] font-bold text-amber-500">{song.playlist}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[0.65vw] text-slate-400 mb-[0.1vw]">7d</div>
                              <div className="text-[0.9vw] font-bold text-emerald-500">{song.trend}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
