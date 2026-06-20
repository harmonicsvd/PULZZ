import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3Listener() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 3000), // phone appears
      setTimeout(() => setPhase(3), 6000), // song playing
      setTimeout(() => setPhase(4), 10000), // moment marked
      setTimeout(() => setPhase(5), 14000), // reaction
      setTimeout(() => setPhase(6), 19000), // earned points
      setTimeout(() => setPhase(7), 24000),
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
        <div className="w-1/2 h-full flex flex-col justify-center pr-[5vw] z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          >
            <h2 className="text-[4vw] font-black text-[#1B2A4A] leading-tight tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Listen.<br/>
              <motion.span 
                className="text-[#FF5C49] inline-block"
                animate={phase >= 4 ? { scale: 1.1, color: '#FF5C49' } : { scale: 1, color: '#FF5C49' }}
              >Mark Moments.</motion.span><br/>
              React.
            </h2>
            <p className="text-[1.5vw] text-slate-600 mt-6 max-w-[25vw]">
              Be the first to discover. Drop pins on the exact seconds you love.
            </p>
          </motion.div>
        </div>

        <div className="w-1/2 h-full relative z-10 flex items-center justify-center perspective-[1200px]">
          {/* Phone Mockup */}
          <motion.div
            className="w-[22vw] h-[45vw] bg-[#FEFCF7] rounded-[3vw] border-[0.8vw] border-[#1B2A4A] overflow-hidden relative shadow-2xl"
            initial={{ opacity: 0, y: 100, rotateY: 25, rotateX: 10 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateY: -15, rotateX: 5 } : { opacity: 0, y: 100, rotateY: 25, rotateX: 10 }}
            transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
          >
            {/* App UI */}
            <div className="absolute inset-0 bg-[#FBF8F2] flex flex-col items-center pt-[4vw]">
              <div className="w-[16vw] h-[16vw] rounded-2xl bg-gradient-to-br from-[#FF5C49] to-[#FF8A7A] shadow-[0_20px_40px_rgba(255,92,73,0.2)] mb-[2vw] relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-white/30"
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <div className="text-[#1B2A4A] text-[1.5vw] font-bold text-center px-4">After You've Gone</div>
              <div className="text-[#1B2A4A]/60 text-[1vw] mt-1">Marion Harris</div>
              
              {/* Progress Bar */}
              <div className="w-[18vw] h-[0.5vw] bg-[#1B2A4A]/10 rounded-full mt-[3vw] relative overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-[#FF5C49] rounded-full"
                  initial={{ width: '0%' }}
                  animate={phase >= 3 ? { width: '60%' } : { width: '0%' }}
                  transition={{ duration: 8, ease: "linear" }}
                />
                
                {/* Moment Mark */}
                {phase >= 4 && (
                  <motion.div 
                    className="absolute top-1/2 -translate-y-1/2 w-[1vw] h-[1vw] bg-[#1B2A4A] rounded-full shadow-[0_0_10px_rgba(27,42,74,0.3)]"
                    initial={{ scale: 0, left: '60%' }}
                    animate={{ scale: 1, left: '60%' }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-[2vw] mt-[4vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-[#1B2A4A]/5 flex items-center justify-center">
                  <div className="w-[1.5vw] h-[1.5vw] border-t-2 border-l-2 border-[#1B2A4A]/50 -rotate-45" />
                </div>
                <motion.div 
                  className="w-[4vw] h-[4vw] rounded-full bg-[#FF5C49] flex items-center justify-center relative"
                  animate={phase >= 5 ? { scale: [1, 1.2, 1] } : {}}
                >
                  <div className="w-[1vw] h-[1vw] border-r-2 border-b-2 border-white rotate-45 mb-[0.2vw]" />
                  {phase >= 5 && (
                    <motion.div 
                      className="absolute -top-12 text-[#FF5C49] font-bold text-[1.2vw] whitespace-nowrap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -20 }}
                      exit={{ opacity: 0 }}
                    >
                      + Discovered!
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Earned Points Overlay */}
              {phase >= 6 && (
                <motion.div 
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="text-[#FF5C49] text-[4vw] font-black"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    +50
                  </motion.div>
                  <div className="text-[#1B2A4A] text-[1.2vw] font-bold uppercase tracking-widest mt-2">Points Earned</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}