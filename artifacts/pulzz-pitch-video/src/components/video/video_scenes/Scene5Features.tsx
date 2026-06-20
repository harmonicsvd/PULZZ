import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Upload, Sparkles, Hash, Calendar, FileText, AlignLeft, Music } from 'lucide-react';

export function Scene5Features() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 7000),
      setTimeout(() => setPhase(4), 12000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#1B2A4A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#1B2A4A] to-[#0A1122]" />

      <div className="absolute inset-0 flex flex-col px-[8vw] py-[6vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          className="mb-[4vh] text-center"
        >
          <h2 className="text-[4vw] font-black text-white leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Powered by the best partner APIs.
          </h2>
          <p className="text-[1.4vw] text-slate-400 mt-[1vh]">Musixmatch · Cyanite · Songstats</p>
        </motion.div>

        <div className="flex-1 relative flex items-center justify-center">
          <AnimatePresence mode="popLayout">

            {/* SUBMIT SONG FORM */}
            {phase === 2 && (
              <motion.div
                key="submit"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                className="w-full max-w-[50vw] bg-[#FBF8F2] rounded-3xl p-[3vw] shadow-2xl flex flex-col gap-[1.5vw]"
              >
                <div className="text-[#1B2A4A] text-[2vw] font-bold">Submit Song to Discovery Pool</div>
                <div className="border-2 border-dashed border-[#3E5C99] bg-[#3E5C99]/5 rounded-xl p-[2vw] flex flex-col items-center justify-center text-[#3E5C99]">
                  <Upload className="w-[3vw] h-[3vw] mb-[1vw]" />
                  <span className="font-bold text-[1.2vw]">Audio upload · MP3 / WAV / FLAC</span>
                </div>
                <div className="grid grid-cols-2 gap-[1vw]">
                  <div className="bg-white p-[1vw] rounded-lg border border-slate-200 flex items-center gap-[1vw]">
                    <Hash className="w-[1.5vw] h-[1.5vw] text-[#FF5C49]" />
                    <div>
                      <span className="font-bold text-slate-700 text-[0.9vw] block">ISRC</span>
                      <span className="text-slate-400 text-[0.75vw]">required for Songstats</span>
                    </div>
                  </div>
                  <div className="bg-white p-[1vw] rounded-lg border border-slate-200 flex items-center gap-[1vw]">
                    <Calendar className="w-[1.5vw] h-[1.5vw] text-slate-400" />
                    <span className="font-bold text-slate-600 text-[0.9vw]">Release Date</span>
                  </div>
                  <div className="bg-white p-[1vw] rounded-lg border border-slate-200 flex items-center gap-[1vw]">
                    <FileText className="w-[1.5vw] h-[1.5vw] text-slate-400" />
                    <span className="font-bold text-slate-600 text-[0.9vw]">Artist Note</span>
                  </div>
                  <div className="bg-white p-[1vw] rounded-lg border border-slate-200 flex items-center gap-[1vw]">
                    <Music className="w-[1.5vw] h-[1.5vw] text-slate-400" />
                    <span className="font-bold text-slate-600 text-[0.9vw]">Spotify Track / URI</span>
                  </div>
                </div>
                <div className="bg-[#FF5C49] text-white w-full py-[1vw] rounded-xl flex items-center justify-center font-bold text-[1.1vw]">
                  Submit to Discovery Pool
                </div>
              </motion.div>
            )}

            {/* MUSIXMATCH — LYRICS SYNC */}
            {phase === 3 && (
              <motion.div
                key="musixmatch"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                className="w-full max-w-[56vw] bg-[#FBF8F2] rounded-3xl p-[3vw] shadow-2xl flex flex-col gap-[1.5vw]"
              >
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-rose-100 flex items-center justify-center">
                    <AlignLeft className="w-[1.8vw] h-[1.8vw] text-rose-600" />
                  </div>
                  <div>
                    <div className="text-[#1B2A4A] font-bold text-[1.6vw]">Musixmatch — Synced Lyrics</div>
                    <div className="text-slate-500 text-[0.9vw]">LRC timestamps per line, genre classification &amp; taste seeding</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-[1.5vw] shadow-sm">
                  <div className="text-[0.85vw] font-bold text-slate-400 uppercase tracking-widest mb-[1vw]">St. Louis Blues · Bessie Smith · 1925</div>
                  <div className="flex flex-col gap-[0.8vw]">
                    {[
                      { time: '0:04', text: "I hate to see that evenin' sun go down", active: false },
                      { time: '0:12', text: "Hate to see that evenin' sun go down", active: true },
                      { time: '0:20', text: "Cause my baby, she done left this town", active: false },
                    ].map((line, i) => (
                      <motion.div
                        key={i}
                        className={`flex items-center gap-[1.5vw] px-[1vw] py-[0.6vw] rounded-lg transition-all ${line.active ? 'bg-rose-50 border border-rose-200' : ''}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        <span className={`font-mono text-[0.8vw] w-[2.5vw] flex-shrink-0 ${line.active ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>{line.time}</span>
                        <span className={`text-[1vw] ${line.active ? 'text-[#1B2A4A] font-bold' : 'text-slate-500'}`}>{line.text}</span>
                        {line.active && (
                          <motion.div
                            className="ml-auto w-[0.6vw] h-[0.6vw] rounded-full bg-rose-500"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-[1.5vw]">
                  <div className="flex-1 bg-white rounded-xl border border-slate-100 p-[1.2vw] shadow-sm flex items-center gap-[1vw]">
                    <Sparkles className="w-[1.5vw] h-[1.5vw] text-rose-500" />
                    <div>
                      <div className="font-bold text-[#1B2A4A] text-[0.95vw]">Genre Classification</div>
                      <div className="text-slate-500 text-[0.8vw]">Blues · Soul</div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-slate-100 p-[1.2vw] shadow-sm flex items-center gap-[1vw]">
                    <Music className="w-[1.5vw] h-[1.5vw] text-rose-500" />
                    <div>
                      <div className="font-bold text-[#1B2A4A] text-[0.95vw]">Taste Seeding</div>
                      <div className="text-slate-500 text-[0.8vw]">Listener preference matching</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CYANITE + SONGSTATS side by side */}
            {phase === 4 && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                className="w-full flex gap-[2vw] justify-center"
              >
                <div className="w-[26vw] bg-white rounded-3xl p-[2vw] shadow-2xl flex flex-col items-center text-center">
                  <div className="w-[5vw] h-[5vw] rounded-full bg-blue-50 flex items-center justify-center mb-[1vw]">
                    <Sparkles className="w-[2.5vw] h-[2.5vw] text-blue-500" />
                  </div>
                  <h3 className="text-[#1B2A4A] font-bold text-[1.5vw]">Cyanite</h3>
                  <p className="text-slate-500 text-[1vw] mt-[0.5vw] leading-snug">AI mood detection, energy, genre tagging &amp; cosine-based sound similarity ranking</p>
                  <div className="mt-[1.5vw] flex flex-wrap gap-[0.5vw] justify-center">
                    {['Mood', 'Energy', 'Genre', 'Similarity'].map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-600 text-[0.8vw] font-bold px-[0.8vw] py-[0.3vw] rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="w-[26vw] bg-white rounded-3xl p-[2vw] shadow-2xl flex flex-col items-center text-center">
                  <div className="w-[5vw] h-[5vw] rounded-full bg-emerald-50 flex items-center justify-center mb-[1vw]">
                    <Upload className="w-[2.5vw] h-[2.5vw] text-emerald-500" />
                  </div>
                  <h3 className="text-[#1B2A4A] font-bold text-[1.5vw]">Songstats Enterprise</h3>
                  <p className="text-slate-500 text-[1vw] mt-[0.5vw] leading-snug">Post-release cross-platform performance — Spotify, Apple Music, playlist reach, chart entries</p>
                  <div className="mt-[1.5vw] flex flex-wrap gap-[0.5vw] justify-center">
                    {['Streams', 'Playlists', 'Charts', 'ISRC lookup'].map(tag => (
                      <span key={tag} className="bg-emerald-50 text-emerald-600 text-[0.8vw] font-bold px-[0.8vw] py-[0.3vw] rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
