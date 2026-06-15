import React from "react";
import { ChevronLeft, AlignLeft, Zap, Star, X, Play, Pause, SkipBack, SkipForward, Flag } from "lucide-react";
import "./_group.css";

export function Daybreak() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div 
        className="w-[390px] h-[844px] mx-auto overflow-hidden relative shadow-2xl rounded-[40px] flex flex-col"
        style={{ backgroundColor: "#F4EDE4", color: "#1B2A4A" }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 pt-14 pb-4">
          <button className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
            <ChevronLeft size={24} strokeWidth={1.5} color="#1B2A4A" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#3E5C99] uppercase">Pre-Release</span>
            <span className="text-xs text-[#1B2A4A]/60 mt-0.5">10 days until release</span>
          </div>

          <button className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors">
            <AlignLeft size={20} strokeWidth={1.5} color="#1B2A4A" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4 flex flex-col no-scrollbar">
          
          {/* Cover Art Area */}
          <div className="relative w-full aspect-square mb-8">
            <div className="w-full h-full rounded-sm overflow-hidden bg-[#DCE3EE] shadow-sm relative">
              <img 
                src="https://images.unsplash.com/photo-1518556637841-f6236b2d2d60?q=80&w=800&auto=format&fit=crop" 
                alt="Midnight Bloom by Luna Voss"
                className="w-full h-full object-cover mix-blend-multiply opacity-90"
              />
              {/* Subtle grain/texture overlay */}
              <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
            </div>
            
            {/* Moment Count Badge on Cover */}
            <div className="absolute bottom-4 right-4 bg-[#E8956B] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <Zap size={12} fill="currentColor" />
              <span className="text-xs font-bold font-sans">3</span>
            </div>
          </div>

          {/* Song Info */}
          <div className="mb-8 text-center flex flex-col items-center">
            <h1 
              className="text-[32px] leading-tight text-[#1B2A4A] mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontStyle: "italic" }}
            >
              Midnight Bloom
            </h1>
            <p className="text-[#3E5C99] text-[15px] uppercase tracking-wider mb-5">Luna Voss</p>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Indie Pop", "dreamy", "late night"].map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#DCE3EE] text-[#3E5C99] text-[11px] uppercase tracking-wider rounded-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1"></div>

          {/* Waveform / Progress */}
          <div className="mb-10 w-full px-2">
            <div className="h-12 w-full flex items-end justify-between gap-[2px] mb-2 relative">
              {/* Fake Waveform Bars */}
              {Array.from({ length: 48 }).map((_, i) => {
                const isActive = i < 18; // 38% played (18 / 48)
                const isMoment = i === 8 || i === 14 || i === 36;
                const height = Math.max(10, Math.sin(i * 0.4) * 50 + Math.cos(i * 0.7) * 30 + 50);
                
                return (
                  <div key={i} className="relative flex-1 flex flex-col justify-end items-center h-full group">
                    {isMoment && (
                      <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[#E8956B]" />
                    )}
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        isActive ? "bg-[#3E5C99]" : "bg-[#DCE3EE]"
                      } ${!isActive && isMoment ? "bg-[#E8956B]/40" : ""} daybreak-waveform-bar daybreak-anim-${(i % 4) + 1}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center text-[11px] font-medium text-[#1B2A4A]/50 font-sans tracking-wide">
              <span>1:21</span>
              <span>3:31</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-center gap-8 mb-10">
            <button className="text-[#3E5C99]/70 hover:text-[#3E5C99] transition-colors">
              <SkipBack size={24} strokeWidth={1.5} />
            </button>
            <button className="w-16 h-16 rounded-full bg-[#1B2A4A] text-[#F4EDE4] flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Pause size={28} fill="currentColor" className="ml-0.5" />
            </button>
            <button className="text-[#3E5C99]/70 hover:text-[#3E5C99] transition-colors">
              <SkipForward size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Primary Action */}
            <button className="w-full bg-[#E8956B] text-white py-4 rounded-xl font-medium text-[15px] flex items-center justify-center gap-2 shadow-md hover:bg-[#d88459] transition-colors group">
              <Zap size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              <span>Mark this moment</span>
              <div className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">3</div>
            </button>

            {/* Secondary Actions */}
            <div className="flex items-center justify-between gap-4">
              <button className="flex-1 bg-white/40 border border-[#1B2A4A]/10 text-[#1B2A4A] py-3.5 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-white/60 transition-colors">
                <Star size={16} className="text-[#3E5C99]" />
                <span>Discovered</span>
              </button>
              <button className="flex-1 bg-transparent border border-[#1B2A4A]/10 text-[#1B2A4A]/60 py-3.5 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-white/30 transition-colors">
                <X size={16} />
                <span>Skip</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
