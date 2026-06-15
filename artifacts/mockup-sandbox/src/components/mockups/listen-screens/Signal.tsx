import React from "react";
import { ChevronDown, Type, Zap, Star, X, SkipBack, Pause, SkipForward } from "lucide-react";
import "./_signal.css";

export function Signal() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E5DFD5] p-4 font-sans selection:bg-[#E8956B] selection:text-white">
      {/* Phone Frame */}
      <div className="w-[390px] h-[844px] bg-[#F4EDE4] rounded-[48px] shadow-[0_32px_64px_-16px_rgba(27,42,74,0.2)] overflow-hidden relative flex flex-col border-[8px] border-white/40">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 pt-14 pb-4">
          <button className="w-10 h-10 flex items-center justify-center text-[#1B2A4A] hover:bg-[#1B2A4A]/5 rounded-full transition-colors">
            <ChevronDown size={24} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#3E5C99] uppercase">Pre-Release</span>
            <span className="text-[13px] font-semibold text-[#1B2A4A]/60 mt-0.5">10 days until release</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-[#1B2A4A] hover:bg-[#1B2A4A]/5 rounded-full transition-colors">
            <Type size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Cover Art Area */}
        <div className="px-6 pt-4 pb-8 flex justify-center">
          <div className="w-[300px] h-[300px] rounded-2xl overflow-hidden relative shadow-2xl shadow-[#3E5C99]/20 bg-[#DCE3EE]">
            {/* Abstract generated art placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3E5C99] via-[#2A4170] to-[#1B2A4A]">
              <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#E8956B] rounded-full mix-blend-multiply filter blur-[64px] opacity-60"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F4EDE4] rounded-full mix-blend-overlay filter blur-[48px] opacity-40"></div>
            </div>
            
            {/* Moment badge on cover */}
            <div className="absolute bottom-4 right-4 bg-[#E8956B] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Zap size={14} fill="currentColor" />
              <span className="text-sm font-bold">3</span>
            </div>
          </div>
        </div>

        {/* Song Info */}
        <div className="px-6 flex flex-col items-center text-center">
          <h1 className="text-[34px] font-black text-[#1B2A4A] tracking-tight leading-tight">Midnight Bloom</h1>
          <h2 className="text-[18px] font-bold text-[#3E5C99] mt-1 mb-4">Luna Voss</h2>
          
          <div className="flex items-center gap-2">
            {["Indie Pop", "dreamy", "late night"].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-[#DCE3EE] text-[#1B2A4A] text-xs font-bold uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Transport & Waveform */}
        <div className="px-6 pb-6">
          {/* Waveform Scrubber */}
          <div className="mb-8">
            <div className="h-12 flex items-center gap-[3px] relative mb-2">
              {Array.from({ length: 60 }).map((_, i) => {
                const isPlayed = i < 23; // ~38%
                const height = 20 + Math.sin(i * 0.3) * 15 + Math.cos(i * 0.7) * 10;
                
                return (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full ${isPlayed ? 'bg-[#3E5C99]' : 'bg-[#DCE3EE]'} signal-waveform-bar`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
              
              {/* Moment Markers */}
              <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#E8956B] shadow-[0_0_8px_#E8956B] z-10 border-2 border-[#F4EDE4]"></div>
              <div className="absolute left-[28%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#E8956B] shadow-[0_0_8px_#E8956B] z-10 border-2 border-[#F4EDE4]"></div>
              <div className="absolute left-[38%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#E8956B] shadow-[0_0_12px_#E8956B] z-10 border-2 border-[#F4EDE4] scale-110 transition-transform"></div>
            </div>
            
            <div className="flex justify-between text-[12px] font-bold text-[#1B2A4A]/50 tracking-widest">
              <span>1:21</span>
              <span>3:31</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 mb-8">
            <button className="text-[#3E5C99] hover:text-[#1B2A4A] transition-colors">
              <SkipBack size={28} strokeWidth={2.5} />
            </button>
            <button className="w-[72px] h-[72px] bg-[#1B2A4A] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#1B2A4A]/20 hover:scale-105 active:scale-95 transition-all">
              <Pause size={32} strokeWidth={2.5} fill="currentColor" />
            </button>
            <button className="text-[#3E5C99] hover:text-[#1B2A4A] transition-colors">
              <SkipForward size={28} strokeWidth={2.5} />
            </button>
          </div>

          {/* Primary Action */}
          <button className="w-full h-[64px] bg-[#E8956B] text-white rounded-2xl flex items-center justify-center gap-3 shadow-[0_16px_32px_-12px_rgba(232,149,107,0.5)] hover:bg-[#E5855A] active:scale-[0.98] transition-all group relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <Zap size={22} fill="currentColor" className="relative z-10" />
            <span className="text-[18px] font-black tracking-wide relative z-10">MARK THIS MOMENT</span>
            <div className="relative z-10 bg-white text-[#E8956B] text-sm font-black px-2.5 py-0.5 rounded-full ml-1">
              3
            </div>
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-4">
            <button className="flex-1 h-[56px] bg-white text-[#1B2A4A] rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm border border-[#DCE3EE] hover:border-[#3E5C99]/30 hover:bg-[#F4EDE4]/50 transition-all">
              <Star size={20} className="text-[#3E5C99]" strokeWidth={2.5} />
              <span>Discovered</span>
            </button>
            <button className="flex-1 h-[56px] bg-transparent text-[#1B2A4A]/60 rounded-2xl flex items-center justify-center gap-2 font-bold border-2 border-[#DCE3EE] hover:border-[#1B2A4A]/20 hover:text-[#1B2A4A] transition-all">
              <X size={20} strokeWidth={2.5} />
              <span>Skip</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
