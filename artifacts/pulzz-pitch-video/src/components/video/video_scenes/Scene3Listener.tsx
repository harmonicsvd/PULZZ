import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Pause, SkipBack, Star, X, Bell, Check, Clock, ExternalLink, User } from 'lucide-react';

export function Scene3Listener() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // problem context -> Phone appears
      setTimeout(() => setPhase(2), 3000),  // player playing
      setTimeout(() => setPhase(3), 8000),  // moment marked
      setTimeout(() => setPhase(4), 11000), // finished -> unlocked reactions
      setTimeout(() => setPhase(5), 14000), // reaction: discovered tapped
      setTimeout(() => setPhase(6), 17000), // discoveries view
      setTimeout(() => setPhase(7), 21000), // release notification appears
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#FBF8F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/bg-audio.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-[0.03] mix-blend-multiply invert"
        initial={{ x: '10%' }}
        animate={{ x: '-10%' }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="absolute inset-0 flex px-[10vw]">
        <div className="w-[45%] h-full flex flex-col justify-center pr-[5vw] z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          >
            <h2 className="text-[4.5vw] font-black text-[#1B2A4A] leading-tight tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {phase < 6 ? (
                <>
                  Listen.<br/>
                  <motion.span 
                    className="text-[#FF5C49] inline-block"
                    animate={phase >= 3 ? { scale: 1.05, color: '#FF5C49' } : { scale: 1, color: '#FF5C49' }}
                  >Mark Moments.</motion.span><br/>
                  React.
                </>
              ) : (
                <>
                  Never Miss <br/>
                  <span className="text-[#FF5C49]">Drop Day.</span>
                </>
              )}
            </h2>
            <p className="text-[1.5vw] text-slate-600 mt-6 max-w-[28vw]">
              {phase < 6 
                ? "The Discovery Pool has unheard tracks. Drop pins on the exact seconds you love and build your reputation."
                : "Get alerted the moment your early discoveries officially release."}
            </p>
          </motion.div>
        </div>

        <div className="w-[55%] h-full relative z-10 flex items-center justify-center perspective-[1200px]">
          {/* Phone Mockup */}
          <motion.div
            className="w-[24vw] h-[48vw] bg-[#FBF8F2] rounded-[3vw] border-[0.8vw] border-[#1B2A4A] overflow-hidden relative shadow-[0_30px_60px_rgba(27,42,74,0.2)]"
            initial={{ opacity: 0, y: 100, rotateY: 25, rotateX: 10 }}
            animate={phase >= 1 ? { opacity: 1, y: 0, rotateY: -15, rotateX: 5 } : { opacity: 0, y: 100, rotateY: 25, rotateX: 10 }}
            transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
          >
            {/* Player UI (Phases 1-5) */}
            <motion.div 
              className="absolute inset-0 bg-[#FBF8F2] flex flex-col pt-[3vw] px-[1.5vw]"
              initial={{ opacity: 1 }}
              animate={phase >= 6 ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            >
              {/* Header */}
              <div className="flex flex-col items-center mb-[2vw]">
                <div className="text-[1vw] font-black text-[#1B2A4A]">PULZZ</div>
                <div className="text-[0.8vw] font-bold text-[#3E5C99] mt-1 tracking-widest">PRE-RELEASE</div>
                <div className="text-[0.7vw] text-slate-500 mt-0.5">14 days until release</div>
              </div>

              {/* Cover Art */}
              <div className="w-full aspect-square rounded-[1.5vw] bg-gradient-to-br from-[#FF5C49] to-[#FF8A7A] shadow-[0_15px_30px_rgba(255,92,73,0.3)] mb-[1.5vw] relative overflow-hidden flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {phase >= 3 && (
                  <motion.div 
                    className="absolute bottom-[1vw] right-[1vw] bg-white/90 backdrop-blur-md px-[0.8vw] py-[0.4vw] rounded-full flex items-center gap-[0.3vw]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                  >
                    <Zap className="w-[0.8vw] h-[0.8vw] text-amber-500" />
                    <span className="text-[#1B2A4A] font-bold text-[0.8vw]">1</span>
                  </motion.div>
                )}
              </div>
              
              <div className="text-[#1B2A4A] text-[1.4vw] font-bold truncate">After You've Gone</div>
              <div className="text-[#3E5C99] text-[1vw] font-semibold mt-0.5 truncate">Marion Harris</div>
              
              <div className="mt-[1vw] bg-slate-200/50 rounded-xl p-[0.8vw] flex justify-between items-center">
                <span className="text-[0.8vw] font-bold text-[#3E5C99] tracking-widest">BEHIND THE SONG</span>
                <ExternalLink className="w-[0.8vw] h-[0.8vw] text-[#3E5C99]" />
              </div>

              {/* Progress Bar */}
              <div className="w-full h-[0.4vw] bg-[#1B2A4A]/10 rounded-full mt-[1.5vw] relative overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-[#FF5C49] rounded-full"
                  initial={{ width: '0%' }}
                  animate={phase >= 2 ? { width: phase >= 4 ? '100%' : '60%' } : { width: '0%' }}
                  transition={{ duration: phase >= 4 ? 1 : 8, ease: "linear" }}
                />
                
                {/* Moment Mark */}
                {phase >= 3 && (
                  <motion.div 
                    className="absolute top-1/2 -translate-y-1/2 w-[0.8vw] h-[0.8vw] bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    initial={{ scale: 0, left: '60%' }}
                    animate={{ scale: 1, left: '60%' }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-[1.5vw] px-[1vw]">
                <div className="w-[2.5vw] h-[2.5vw] flex items-center justify-center opacity-70">
                  <SkipBack className="w-[1.2vw] h-[1.2vw] text-[#3E5C99]" />
                </div>
                <div className="w-[4vw] h-[4vw] rounded-full bg-[#FF5C49] flex items-center justify-center shadow-lg">
                  <Pause className="w-[1.8vw] h-[1.8vw] text-white" fill="white" />
                </div>
                <motion.div 
                  className="w-[2.5vw] h-[2.5vw] rounded-full bg-amber-500 flex items-center justify-center shadow-md relative"
                  animate={phase >= 3 ? { scale: [1, 1.3, 1] } : {}}
                >
                  <Zap className="w-[1.2vw] h-[1.2vw] text-white" />
                  {phase >= 3 && phase < 4 && (
                    <motion.div 
                      className="absolute -top-[2vw] text-amber-500 font-bold text-[0.8vw] whitespace-nowrap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -5 }}
                      exit={{ opacity: 0 }}
                    >
                      + Marked!
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Reaction Row */}
              <div className="mt-auto pb-[2vw]">
                {phase < 4 ? (
                  <div className="border border-[#1B2A4A] border-opacity-15 bg-[#1B2A4A] bg-opacity-5 rounded-full py-[0.8vw] flex justify-center items-center gap-[0.5vw]">
                    <div className="w-[1vw] h-[1vw] border-2 border-slate-500 rounded-full flex items-center justify-center">
                      <div className="w-[0.4vw] h-[0.4vw] bg-slate-500 rounded-full" />
                    </div>
                    <span className="text-[0.9vw] font-bold text-slate-500">Finish the song to react</span>
                  </div>
                ) : (
                  <div className="flex gap-[1vw]">
                    <motion.div 
                      className={`flex-1 rounded-full py-[0.8vw] flex justify-center items-center gap-[0.5vw] ${phase >= 5 ? 'bg-[#FF5C49]' : 'bg-[#E2E8F0]'}`}
                      animate={phase >= 5 ? { scale: 1.05 } : {}}
                    >
                      <Star className={`w-[1vw] h-[1vw] ${phase >= 5 ? 'text-white' : 'text-[#3E5C99]'}`} />
                      <span className={`text-[0.9vw] font-bold ${phase >= 5 ? 'text-white' : 'text-[#3E5C99]'}`}>Discovered</span>
                    </motion.div>
                    <div className="flex-1 border border-[#E2E8F0] rounded-full py-[0.8vw] flex justify-center items-center gap-[0.5vw]">
                      <X className="w-[1vw] h-[1vw] text-slate-500" />
                      <span className="text-[0.9vw] font-bold text-slate-500">Skip</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Discoveries View & Notification (Phase 6+) */}
            {phase >= 6 && (
              <motion.div 
                className="absolute inset-0 bg-[#FBF8F2] flex flex-col pt-[3vw]"
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: '0%' }}
                transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
              >
                <div className="px-[1.5vw] mb-[1.5vw] flex justify-between items-end">
                  <div className="text-[1.8vw] font-black text-[#1B2A4A] tracking-tight">My Discoveries</div>
                  <div className="bg-slate-200 px-[0.8vw] py-[0.4vw] rounded-full flex items-center gap-[0.3vw]">
                    <Star className="w-[0.8vw] h-[0.8vw] text-amber-500" />
                    <span className="text-[0.8vw] font-bold text-amber-500">150 pts</span>
                  </div>
                </div>

                {/* Release Notification Banner */}
                {phase >= 7 && (
                  <motion.div 
                    className="mx-[1vw] bg-[#FF5C49] rounded-[1vw] p-[1vw] flex items-center gap-[1vw] shadow-lg mb-[1vw] z-10"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                  >
                    <div className="w-[2vw] h-[2vw] rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-[1.2vw] h-[1.2vw] text-white" fill="white" />
                    </div>
                    <div>
                      <div className="text-white text-[0.9vw] font-bold">After You've Gone is out now!</div>
                      <div className="text-white/90 text-[0.75vw] mt-[0.2vw] leading-tight">Marion Harris just released a song you discovered early</div>
                    </div>
                  </motion.div>
                )}

                {/* List Items */}
                <div className="px-[1vw] flex flex-col gap-[1vw]">
                  {[
                    { title: "After You've Gone", artist: "Marion Harris", released: phase >= 7, days: 14, color: "from-[#FF5C49] to-[#FF8A7A]" },
                    { title: "Danny Boy", artist: "Ernestine S.", released: false, days: 21, color: "from-[#3E5C99] to-[#5C7EBE]" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="bg-white rounded-[1vw] p-[1vw] flex items-center gap-[1vw] border border-[#1B2A4A]/5 shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      <div className={`w-[3vw] h-[3vw] rounded-[0.8vw] bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <Check className="w-[1.2vw] h-[1.2vw] text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[1vw] font-bold text-[#1B2A4A] truncate">{item.title}</div>
                        <div className="text-[0.8vw] text-slate-500 truncate mt-[0.1vw]">{item.artist}</div>
                        <div className="flex items-center gap-[0.3vw] mt-[0.3vw]">
                          <Clock className={`w-[0.7vw] h-[0.7vw] ${item.released ? 'text-amber-500' : 'text-slate-400'}`} />
                          <span className={`text-[0.75vw] ${item.released ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
                            {item.released ? "Released!" : `${item.days} days left`}
                          </span>
                        </div>
                      </div>
                      {item.released ? (
                        <div className="bg-[#FF5C49] text-white text-[0.75vw] font-bold px-[0.8vw] py-[0.4vw] rounded-full flex items-center gap-[0.3vw]">
                          <ExternalLink className="w-[0.8vw] h-[0.8vw]" />
                          Stream
                        </div>
                      ) : (
                        <div className="w-[2vw] h-[2vw] rounded-full bg-slate-100 flex items-center justify-center">
                          <Bell className="w-[1vw] h-[1vw] text-slate-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Discovery Wall Snippet */}
                <div className="mt-auto px-[1vw] pb-[1vw]">
                  <div className="bg-white rounded-[1vw] p-[1vw] border border-[#1B2A4A]/5 shadow-sm">
                    <div className="flex justify-between items-center mb-[0.5vw]">
                      <span className="text-[1vw] font-bold text-[#1B2A4A]">Discovery Wall</span>
                      <span className="text-[0.8vw] text-[#3E5C99] font-bold">Your rank: #42</span>
                    </div>
                    <div className="flex items-center gap-[0.5vw]">
                      <div className="w-[2vw] h-[2vw] rounded-full bg-slate-100 flex items-center justify-center"><User className="w-[1vw] h-[1vw] text-slate-400" /></div>
                      <div className="flex-1 h-[0.5vw] bg-slate-100 rounded-full" />
                      <div className="w-[2vw] h-[2vw] rounded-full bg-[#FF5C49]/20 flex items-center justify-center"><Star className="w-[1vw] h-[1vw] text-[#FF5C49]" /></div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
