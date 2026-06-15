import React from 'react';
import { ChevronDown, Type, Zap, Star, X, SkipBack, Pause, Flag } from 'lucide-react';
import './_group.css';

export function Tide() {
  // Waveform bars generation
  const bars = Array.from({ length: 40 }).map((_, i) => {
    // Generate some random-looking heights for the waveform
    const height = 20 + Math.abs(Math.sin(i * 0.3) * 60) + Math.random() * 20;
    return height;
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      {/* Mobile Frame */}
      <div 
        className="w-[390px] h-[844px] relative overflow-hidden rounded-[40px] shadow-2xl"
        style={{ backgroundColor: '#F4EDE4' }}
      >
        {/* Soft gradient background overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" 
             style={{ background: 'radial-gradient(circle at 50% 0%, #DCE3EE 0%, transparent 70%)' }} />

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 pt-14 pb-4 relative z-10">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 shadow-sm backdrop-blur-md text-[#1B2A4A]">
            <ChevronDown size={22} strokeWidth={2.5} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest text-[#3E5C99] uppercase mb-0.5">
              PRE-RELEASE
            </span>
            <span className="text-xs font-semibold text-[#1B2A4A]/70">
              10 days until release
            </span>
          </div>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 shadow-sm backdrop-blur-md text-[#1B2A4A]">
            <Type size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 flex flex-col h-[calc(100%-100px)] relative z-10">
          
          {/* Cover Art */}
          <div className="mt-6 mb-8 flex justify-center tide-float">
            <div className="relative">
              <div 
                className="w-[280px] h-[280px] rounded-[32px] shadow-xl overflow-hidden relative"
                style={{ 
                  background: 'linear-gradient(135deg, #3E5C99 0%, #1B2A4A 100%)',
                  boxShadow: '0 20px 40px -10px rgba(62, 92, 153, 0.3)'
                }}
              >
                {/* Abstract cover art visualization */}
                <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(circle at 20% 80%, #E8956B 0%, transparent 60%)' }} />
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 80% 20%, #DCE3EE 0%, transparent 60%)' }} />
                
                {/* Moment Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                  <Zap size={14} className="text-[#E8956B] fill-[#E8956B]" />
                  <span className="text-sm font-bold text-[#1B2A4A]">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Song Info */}
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-[28px] font-extrabold text-[#1B2A4A] tracking-tight mb-1">
              Midnight Bloom
            </h1>
            <h2 className="text-[17px] font-medium text-[#3E5C99] mb-4">
              Luna Voss
            </h2>
            <div className="flex items-center gap-2">
              {['Indie Pop', 'dreamy', 'late night'].map((tag) => (
                <div 
                  key={tag} 
                  className="px-3 py-1 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: '#DCE3EE', color: '#3E5C99' }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Waveform & Scrubber */}
          <div className="mb-8 relative">
            <div className="flex items-end justify-between gap-[2px] h-12 mb-3">
              {bars.map((height, i) => {
                const isPlayed = i / bars.length < 0.38;
                // Markers at specific indexes
                const isMarker = [8, 12, 14].includes(i);
                
                return (
                  <div key={i} className="relative flex flex-col justify-end items-center group w-1.5">
                    {isMarker && (
                      <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[#E8956B] shadow-[0_0_8px_rgba(232,149,107,0.8)]" />
                    )}
                    <div 
                      className={`w-full rounded-full tide-breathing ${isPlayed ? 'bg-[#3E5C99]' : 'bg-[#DCE3EE]'}`}
                      style={{ 
                        height: `${height}%`, 
                        animationDelay: `${i * 0.05}s`,
                        opacity: isPlayed ? 1 : 0.6
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-[#1B2A4A]/50 px-1">
              <span>1:21</span>
              <span>3:31</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button className="text-[#3E5C99] hover:text-[#1B2A4A] transition-colors">
              <SkipBack size={24} strokeWidth={2.5} />
            </button>
            <button 
              className="w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg shadow-[#3E5C99]/30"
              style={{ background: 'linear-gradient(135deg, #3E5C99 0%, #2A4070 100%)' }}
            >
              <Pause size={28} strokeWidth={2.5} className="fill-white" />
            </button>
            <button className="text-[#3E5C99] hover:text-[#1B2A4A] transition-colors">
              <Flag size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Primary Action */}
          <button 
            className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] text-white shadow-lg mb-4 tide-pulse"
            style={{ backgroundColor: '#E8956B' }}
          >
            <Zap size={20} className="fill-white" />
            <span className="text-lg font-bold">Mark this moment</span>
            <div className="ml-1 bg-white/20 px-2 py-0.5 rounded-lg text-sm font-bold">
              3
            </div>
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center gap-3">
            <button 
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[16px] font-bold text-[#3E5C99] transition-colors"
              style={{ backgroundColor: '#DCE3EE' }}
            >
              <Star size={18} />
              <span>Discovered</span>
            </button>
            <button 
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[16px] font-bold text-[#1B2A4A]/60 transition-colors bg-white/50"
            >
              <X size={18} />
              <span>Skip</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
