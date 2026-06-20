import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Handshake, Upload, Sparkles, Check, Hash, Calendar, FileText } from 'lucide-react';

export function Scene5Features() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Collab
      setTimeout(() => setPhase(3), 6000), // Submit
      setTimeout(() => setPhase(4), 10000),// Sound DNA / Musixmatch
      setTimeout(() => setPhase(5), 14000),// Outro transition
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
            Use everything we have.
          </h2>
        </motion.div>

        <div className="flex-1 relative flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {/* COLLABORATION */}
            {phase === 2 && (
              <motion.div
                key="collab"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="w-full max-w-[60vw] bg-[#FBF8F2] rounded-3xl p-[3vw] shadow-2xl"
              >
                <div className="flex items-center gap-[1vw] mb-[2vw]">
                  <Sparkles className="w-[2vw] h-[2vw] text-[#FF5C49]" />
                  <div className="text-[#1B2A4A] text-[2vw] font-bold">Suggested Collaborators</div>
                </div>
                <div className="grid grid-cols-2 gap-[2vw]">
                  <div className="bg-white rounded-xl border border-slate-200 p-[1.5vw]">
                    <div className="flex items-center gap-[1vw] mb-[1vw]">
                      <div className="w-[4vw] h-[4vw] bg-[#1B2A4A]/5 rounded-full flex items-center justify-center font-bold text-[#1B2A4A] text-[1.5vw]">AR</div>
                      <div>
                        <div className="font-bold text-[#1B2A4A] text-[1.2vw]">Alex Rivers</div>
                        <div className="text-[0.9vw] text-slate-500">Producer, Mix Engineer</div>
                      </div>
                    </div>
                    <div className="bg-slate-100 text-[#1B2A4A] text-[0.8vw] font-bold px-[0.8vw] py-[0.4vw] rounded-full inline-block mb-[1vw]">Sounds 92% alike</div>
                    <div className="bg-[#FF5C49] text-white w-full py-[0.8vw] rounded-lg flex items-center justify-center gap-[0.5vw] font-bold text-[1vw]">
                      <Handshake className="w-[1.2vw] h-[1.2vw]" />
                      Request collaboration
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUBMIT SONG */}
            {phase === 3 && (
              <motion.div
                key="submit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="w-full max-w-[50vw] bg-[#FBF8F2] rounded-3xl p-[3vw] shadow-2xl flex flex-col gap-[1.5vw]"
              >
                <div className="text-[#1B2A4A] text-[2vw] font-bold">Submit Song</div>
                <div className="border-2 border-dashed border-[#3E5C99] bg-[#3E5C99]/5 rounded-xl p-[2vw] flex flex-col items-center justify-center text-[#3E5C99]">
                  <Upload className="w-[3vw] h-[3vw] mb-[1vw]" />
                  <span className="font-bold text-[1.2vw]">Audio Track upload (MP3/WAV/FLAC)</span>
                </div>
                <div className="grid grid-cols-2 gap-[1vw]">
                  <div className="bg-white p-[1vw] rounded-lg border border-slate-200 flex items-center gap-[1vw]">
                    <Hash className="w-[1.5vw] h-[1.5vw] text-slate-400" />
                    <span className="font-bold text-slate-600">ISRC</span>
                  </div>
                  <div className="bg-white p-[1vw] rounded-lg border border-slate-200 flex items-center gap-[1vw]">
                    <Calendar className="w-[1.5vw] h-[1.5vw] text-slate-400" />
                    <span className="font-bold text-slate-600">Release Date</span>
                  </div>
                  <div className="col-span-2 bg-white p-[1vw] rounded-lg border border-slate-200 flex items-center gap-[1vw]">
                    <FileText className="w-[1.5vw] h-[1.5vw] text-slate-400" />
                    <span className="font-bold text-slate-600">Artist Note & Lyrics</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INTEGRATIONS */}
            {phase === 4 && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="w-full flex gap-[2vw] justify-center"
              >
                <div className="w-[25vw] bg-white rounded-3xl p-[2vw] shadow-2xl flex flex-col items-center text-center">
                  <div className="w-[5vw] h-[5vw] rounded-full bg-blue-50 flex items-center justify-center mb-[1vw]">
                    <Sparkles className="w-[2.5vw] h-[2.5vw] text-blue-500" />
                  </div>
                  <h3 className="text-[#1B2A4A] font-bold text-[1.5vw]">Cyanite</h3>
                  <p className="text-slate-500 text-[1vw] mt-[0.5vw]">Sound DNA matching (acoustic + mood + genre)</p>
                </div>
                <div className="w-[25vw] bg-white rounded-3xl p-[2vw] shadow-2xl flex flex-col items-center text-center">
                  <div className="w-[5vw] h-[5vw] rounded-full bg-rose-50 flex items-center justify-center mb-[1vw]">
                    <FileText className="w-[2.5vw] h-[2.5vw] text-rose-500" />
                  </div>
                  <h3 className="text-[#1B2A4A] font-bold text-[1.5vw]">Musixmatch</h3>
                  <p className="text-slate-500 text-[1vw] mt-[0.5vw]">Lyrics search (LRC) & taste seeding</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
