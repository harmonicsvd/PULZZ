import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, AlignLeft, BarChart2 } from 'lucide-react';

export function Scene5Features() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 700),  // Cyanite card fades in sooner
      setTimeout(() => setPhase(3), 5800),
      setTimeout(() => setPhase(4), 10000),
      setTimeout(() => setPhase(5), 13500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  const apis = [
    {
      key: 'cyanite',
      icon: Sparkles,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      name: 'Cyanite',
      role: 'Song DNA Engine',
      description: 'Audio uploaded → Cyanite GraphQL returns mood, genre, BPM, key, energy, valence, arousal & AI caption.',
      uses: [
        'Song DNA on every artist detail page',
        'Cosine similarity powers the Discover feed ranking',
        'Collaboration Wall matches artists by sound',
      ],
      tags: ['Mood', 'Energy', 'BPM', 'Genre', 'Similarity'],
      tagColor: 'bg-blue-50 text-blue-600',
    },
    {
      key: 'musixmatch',
      icon: AlignLeft,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      name: 'Musixmatch',
      role: 'Lyrics & Taste',
      description: 'Three distinct integrations: onboarding taste seeding, synced LRC lyrics in the player, lyric mood/theme/language analysis.',
      uses: [
        'Onboarding: listeners pick songs & genres they love',
        'Player: lyrics scroll line-by-line in sync',
        "Each song's lyrics analysed for mood, theme & language",
      ],
      tags: ['Synced Lyrics', 'Taste seed', 'Lyric mood'],
      tagColor: 'bg-rose-50 text-rose-600',
    },
    {
      key: 'songstats',
      icon: BarChart2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      name: 'Songstats',
      role: 'Post-Release Performance',
      description: 'Attach an ISRC or Spotify link → Songstats Enterprise returns cross-platform performance, pre-release songs are gated.',
      uses: [
        'Per-song: streams, playlist reach, chart activity',
        'Artist-wide rollup by platform (Spotify, Apple, Deezer…)',
        'Closes the loop: pre-release discovery → live numbers',
      ],
      tags: ['Streams', 'Playlists', 'Charts', 'ISRC'],
      tagColor: 'bg-emerald-50 text-emerald-600',
    },
  ] as const;

  const currentApi = phase >= 2 && phase <= 4 ? apis[phase - 2] : null;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#1B2A4A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#1B2A4A] to-[#070D1A]" />

      <div className="absolute inset-0 flex flex-col px-[8vw] py-[5vh]">

        <motion.div
          className="text-center mb-[3vh]"
          initial={{ opacity: 0, y: 24 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="text-[3.8vw] font-black text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Built on real partner APIs.
          </h2>
          <p className="text-slate-400 text-[1.15vw] mt-[0.5vh]">
            Every integration powers a working feature — not a logo on a slide.
          </p>
        </motion.div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">

            {currentApi && (
              <motion.div
                key={currentApi.key}
                className="w-full max-w-[62vw] bg-white rounded-3xl p-[3vw] shadow-2xl"
                initial={{ opacity: 0, scale: 0.88, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -16 }}
                transition={{ duration: 0.3, ease }}
              >
                <div className="flex items-start gap-[1.5vw] mb-[2vw]">
                  <div className={`w-[4.5vw] h-[4.5vw] rounded-2xl ${currentApi.iconBg} flex items-center justify-center shrink-0`}>
                    <currentApi.icon className={`w-[2.2vw] h-[2.2vw] ${currentApi.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-[#1B2A4A] font-black text-[2vw] leading-none">{currentApi.name}</div>
                    <div className="text-slate-500 text-[1vw] mt-[0.3vw]">{currentApi.role}</div>
                  </div>
                </div>

                <p className="text-[1.05vw] text-slate-600 leading-relaxed mb-[1.8vw]">
                  {currentApi.description}
                </p>

                <div className="bg-slate-50 rounded-2xl p-[1.5vw] mb-[1.8vw]">
                  <div className="text-[0.8vw] font-bold text-slate-400 uppercase tracking-widest mb-[1vw]">How we use it</div>
                  <div className="flex flex-col gap-[0.7vw]">
                    {currentApi.uses.map((use, i) => (
                      <motion.div key={i} className="flex items-start gap-[0.8vw]"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 + 0.2 }}>
                        <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-[#FF5C49] mt-[0.5vw] shrink-0" />
                        <span className="text-[#1B2A4A] text-[0.98vw] font-medium">{use}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-[0.6vw]">
                  {currentApi.tags.map(tag => (
                    <span key={tag} className={`${currentApi.tagColor} text-[0.78vw] font-bold px-[0.9vw] py-[0.35vw] rounded-full`}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All 3 together — footer lockup */}
            {phase >= 5 && (
              <motion.div
                key="all"
                className="w-full max-w-[72vw] flex flex-col items-center gap-[2vw]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease }}
              >
                <div className="flex gap-[2vw] w-full">
                  {apis.map((api, i) => (
                    <motion.div key={api.key}
                      className="flex-1 bg-white/10 border border-white/15 rounded-2xl p-[1.5vw] flex flex-col items-center text-center gap-[0.8vw]"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}>
                      <div className={`w-[3.5vw] h-[3.5vw] rounded-xl ${api.iconBg} flex items-center justify-center`}>
                        <api.icon className={`w-[1.8vw] h-[1.8vw] ${api.iconColor}`} />
                      </div>
                      <div className="text-white font-black text-[1.3vw]">{api.name}</div>
                      <div className="text-slate-400 text-[0.82vw] leading-snug">{api.role}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  className="text-slate-400 text-[1vw] text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  Every feature degrades gracefully — missing key → tasteful fallback, never broken.
                </motion.p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
