import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Pause, SkipBack, Star, X, Bell, Check, Clock, ExternalLink, User } from 'lucide-react';

export function Scene3Listener() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Full-screen tagline — 3.5 s
      setTimeout(() => setPhase(2), 4000),  // Phone + copy appears
      setTimeout(() => setPhase(3), 7700),  // Song playing
      setTimeout(() => setPhase(4), 11700), // Moment marked
      setTimeout(() => setPhase(5), 15200), // Reactions unlocked
      setTimeout(() => setPhase(6), 18200), // Discovered tapped
      setTimeout(() => setPhase(7), 21700), // Discoveries view
      setTimeout(() => setPhase(8), 25200), // Notification
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6 }}
    >
      {/* Full-screen tagline — phase 1 only */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-[10vw] z-30"
        initial={{ opacity: 0 }}
        animate={phase === 1 ? { opacity: 1 } : { opacity: 0, pointerEvents: 'none' }}
        transition={{ duration: 0.85, ease }}
      >
        <motion.p
          className="text-[1.2vw] font-bold text-slate-400 uppercase tracking-[0.3em] mb-[2vw]"
          initial={{ opacity: 0, y: 16 }}
          animate={phase === 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.75, ease, delay: 0.15 }}
        >
          For Listeners
        </motion.p>
        <motion.h2
          className="text-[5.5vw] font-black text-[#1B2A4A] leading-tight tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={phase === 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
          transition={{ duration: 0.85, ease, delay: 0.28 }}
        >
          Catch a song's pulse<br />
          <span className="text-[#FF5C49]">before the drop.</span>
        </motion.h2>
      </motion.div>

      {/* Phone layout — phase 2+ */}
      <motion.div
        className="absolute inset-0 flex px-[10vw]"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.75, ease }}
      >
        {/* Left copy */}
        <div className="w-[45%] h-full flex flex-col justify-center pr-[4vw] z-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.8, ease }}
          >
            <h2
              className="text-[4.5vw] font-black text-[#1B2A4A] leading-tight tracking-tight mb-[1.5vw]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {phase < 7 ? (
                <>Listen.<br /><span className="text-[#FF5C49]">Mark Moments.</span><br />React.</>
              ) : (
                <>Never Miss<br /><span className="text-[#FF5C49]">Drop Day.</span></>
              )}
            </h2>
            <p className="text-[1.3vw] text-slate-600 max-w-[26vw] leading-snug">
              {phase < 7
                ? 'The Discovery Pool has unheard tracks from emerging artists. Pin the exact seconds that move you — and build your discoverer reputation.'
                : 'Get notified the moment your early discoveries officially release. You were first.'}
            </p>
          </motion.div>
        </div>

        {/* Phone mockup */}
        <div className="w-[55%] h-full relative z-10 flex items-center justify-center">
          <motion.div
            className="w-[24vw] h-[48vw] bg-[#FBF8F2] rounded-[3vw] border-[0.8vw] border-[#1B2A4A] overflow-hidden relative shadow-[0_30px_60px_rgba(27,42,74,0.2)]"
            initial={{ opacity: 0, y: 80, rotateY: 18 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateY: -12 } : { opacity: 0, y: 80, rotateY: 18 }}
            transition={{ duration: 1.05, type: 'spring', bounce: 0.18 }}
          >
            {/* Player screen */}
            <motion.div
              className="absolute inset-0 bg-[#FBF8F2] flex flex-col pt-[3vw] px-[1.5vw]"
              animate={phase >= 7 ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Pulzz header — brand colors */}
              <div className="flex flex-col items-center mb-[1.8vw]">
                <div className="text-[1.1vw] font-black tracking-tight">
                  <span className="text-[#1B2A4A]">PUL</span><span className="text-[#FF5C49]">ZZ</span>
                </div>
                <div className="text-[0.72vw] font-bold text-[#3E5C99] mt-[0.1vw] tracking-widest">DISCOVERY POOL</div>
                <div className="text-[0.62vw] text-slate-400 mt-[0.1vw]">14 days until release</div>
              </div>

              <div className="w-full aspect-square rounded-[1.5vw] bg-gradient-to-br from-[#FF5C49] to-[#FF8A7A] shadow-[0_15px_30px_rgba(255,92,73,0.3)] mb-[1.5vw] relative overflow-hidden flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ scale: [1, 1.15, 1], opacity: [0, 0.35, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                {phase >= 4 && (
                  <motion.div
                    className="absolute bottom-[1vw] right-[1vw] bg-white/90 backdrop-blur-md px-[0.8vw] py-[0.4vw] rounded-full flex items-center gap-[0.3vw]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.55 }}
                  >
                    <Zap className="w-[0.8vw] h-[0.8vw] text-amber-500" />
                    <span className="text-[#1B2A4A] font-bold text-[0.8vw]">1</span>
                  </motion.div>
                )}
              </div>

              <div className="text-[#1B2A4A] text-[1.35vw] font-bold truncate">After You've Gone</div>
              <div className="text-[#3E5C99] text-[0.95vw] font-semibold mt-[0.1vw] truncate">Marion Harris · Jazz · 1918</div>

              {/* Progress bar */}
              <div className="w-full h-[0.4vw] bg-[#1B2A4A]/10 rounded-full mt-[1.4vw] relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-[#FF5C49] rounded-full"
                  initial={{ width: '0%' }}
                  animate={phase >= 3 ? { width: phase >= 5 ? '100%' : '58%' } : { width: '0%' }}
                  transition={{ duration: phase >= 5 ? 0.8 : 8, ease: 'linear' }}
                />
                {phase >= 4 && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-[0.8vw] h-[0.8vw] bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    style={{ left: '58%' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.55 }}
                  />
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center mt-[1.4vw] px-[1vw]">
                <div className="opacity-60"><SkipBack className="w-[1.2vw] h-[1.2vw] text-[#3E5C99]" /></div>
                <div className="w-[4vw] h-[4vw] rounded-full bg-[#FF5C49] flex items-center justify-center shadow-lg">
                  <Pause className="w-[1.8vw] h-[1.8vw] text-white" fill="white" />
                </div>
                <motion.div
                  className="w-[2.5vw] h-[2.5vw] rounded-full bg-amber-500 flex items-center justify-center shadow-md"
                  animate={phase === 4 ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.45 }}
                >
                  <Zap className="w-[1.2vw] h-[1.2vw] text-white" />
                </motion.div>
              </div>

              {/* Reaction area */}
              <div className="mt-auto pb-[2vw]">
                {phase < 5 ? (
                  <div className="border border-[#1B2A4A]/12 bg-[#1B2A4A]/5 rounded-full py-[0.8vw] flex justify-center">
                    <span className="text-[0.85vw] font-bold text-slate-500">Finish to react</span>
                  </div>
                ) : (
                  <div className="flex gap-[1vw]">
                    <motion.div
                      className={`flex-1 rounded-full py-[0.8vw] flex justify-center items-center gap-[0.5vw] ${phase >= 6 ? 'bg-[#FF5C49]' : 'bg-[#E2E8F0]'}`}
                      animate={phase >= 6 ? { scale: 1.04 } : {}}
                    >
                      <Star className={`w-[1vw] h-[1vw] ${phase >= 6 ? 'text-white' : 'text-[#3E5C99]'}`} />
                      <span className={`text-[0.9vw] font-bold ${phase >= 6 ? 'text-white' : 'text-[#3E5C99]'}`}>Discovered</span>
                    </motion.div>
                    <div className="flex-1 border border-[#E2E8F0] rounded-full py-[0.8vw] flex justify-center items-center gap-[0.5vw]">
                      <X className="w-[1vw] h-[1vw] text-slate-500" />
                      <span className="text-[0.9vw] font-bold text-slate-500">Skip</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Discoveries screen — phase 7+ */}
            {phase >= 7 && (
              <motion.div
                className="absolute inset-0 bg-[#FBF8F2] flex flex-col pt-[3vw]"
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: '0%' }}
                transition={{ type: 'spring', bounce: 0.08, duration: 0.65 }}
              >
                <div className="px-[1.5vw] mb-[1.2vw] flex justify-between items-end">
                  <div className="text-[1.8vw] font-black text-[#1B2A4A]">My Discoveries</div>
                  <div className="bg-amber-100 px-[0.8vw] py-[0.35vw] rounded-full flex items-center gap-[0.3vw]">
                    <Star className="w-[0.8vw] h-[0.8vw] text-amber-500" />
                    <span className="text-[0.8vw] font-bold text-amber-600">150 pts</span>
                  </div>
                </div>

                {phase >= 8 && (
                  <motion.div
                    className="mx-[1vw] bg-[#FF5C49] rounded-[1vw] p-[1vw] flex items-center gap-[0.8vw] shadow-lg mb-[0.8vw]"
                    initial={{ opacity: 0, y: -16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.38 }}
                  >
                    <div className="w-[2vw] h-[2vw] rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Bell className="w-[1.1vw] h-[1.1vw] text-white" fill="white" />
                    </div>
                    <div>
                      <div className="text-white text-[0.85vw] font-bold">After You've Gone is out now!</div>
                      <div className="text-white/85 text-[0.72vw] mt-[0.1vw]">Marion Harris just dropped — you found it first</div>
                    </div>
                  </motion.div>
                )}

                <div className="px-[1vw] flex flex-col gap-[0.8vw]">
                  {[
                    { title: "After You've Gone", artist: 'Marion Harris', released: phase >= 8, color: 'from-[#FF5C49] to-[#FF8A7A]' },
                    { title: 'Danny Boy', artist: 'Ernestine S.', released: false, color: 'from-[#3E5C99] to-[#5C7EBE]' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="bg-white rounded-[1vw] p-[0.9vw] flex items-center gap-[0.8vw] border border-[#1B2A4A]/5 shadow-sm"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.09 + 0.2 }}
                    >
                      <div className={`w-[3vw] h-[3vw] rounded-[0.8vw] bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                        <Check className="w-[1.2vw] h-[1.2vw] text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.95vw] font-bold text-[#1B2A4A] truncate">{item.title}</div>
                        <div className="text-[0.78vw] text-slate-500 truncate">{item.artist}</div>
                        <div className="flex items-center gap-[0.3vw] mt-[0.15vw]">
                          <Clock className={`w-[0.65vw] h-[0.65vw] ${item.released ? 'text-amber-500' : 'text-slate-400'}`} />
                          <span className={`text-[0.72vw] ${item.released ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
                            {item.released ? 'Released!' : '21 days left'}
                          </span>
                        </div>
                      </div>
                      {item.released
                        ? <div className="bg-[#FF5C49] text-white text-[0.72vw] font-bold px-[0.7vw] py-[0.35vw] rounded-full flex items-center gap-[0.3vw]"><ExternalLink className="w-[0.7vw] h-[0.7vw]" />Stream</div>
                        : <div className="w-[1.8vw] h-[1.8vw] rounded-full bg-slate-100 flex items-center justify-center"><Bell className="w-[0.9vw] h-[0.9vw] text-slate-400" /></div>
                      }
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto px-[1vw] pb-[1vw]">
                  <div className="bg-white rounded-[1vw] p-[1vw] border border-[#1B2A4A]/5 shadow-sm">
                    <div className="flex justify-between items-center mb-[0.4vw]">
                      <span className="text-[0.95vw] font-bold text-[#1B2A4A]">Discovery Wall</span>
                      <span className="text-[0.78vw] text-[#3E5C99] font-bold">Rank #42</span>
                    </div>
                    <div className="flex items-center gap-[0.5vw]">
                      <div className="w-[1.8vw] h-[1.8vw] rounded-full bg-slate-100 flex items-center justify-center"><User className="w-[0.9vw] h-[0.9vw] text-slate-400" /></div>
                      <div className="flex-1 h-[0.4vw] bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF5C49] w-[38%]" />
                      </div>
                      <div className="w-[1.8vw] h-[1.8vw] rounded-full bg-[#FF5C49]/15 flex items-center justify-center"><Star className="w-[0.9vw] h-[0.9vw] text-[#FF5C49]" /></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
