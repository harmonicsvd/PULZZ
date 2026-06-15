import { useState } from "react";
import { ChevronDown, Type, Zap, Star, X, SkipBack, Pause, Lock } from "lucide-react";
import "./_group.css";

export function Merged() {
  const [activeTab, setActiveTab] = useState<"player" | "lyrics">("player");
  const [storyExpanded, setStoryExpanded] = useState(false);
  const [finished, setFinished] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E5DFD5] p-4 font-sans selection:bg-[#E8956B] selection:text-white">
      {/* Mobile Frame */}
      <div
        className="w-[390px] h-[844px] relative overflow-hidden rounded-[40px] shadow-2xl flex flex-col border-[8px] border-white/20"
        style={{ backgroundColor: "#F4EDE4" }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 pt-12 pb-3 relative z-20 shrink-0">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-[#1B2A4A]">
            <ChevronDown size={24} strokeWidth={2.5} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#3E5C99] uppercase">
              PRE-RELEASE
            </span>
            <span className="text-[13px] font-semibold text-[#1B2A4A]/60 mt-0.5">
              10 days until release
            </span>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === "player" ? "lyrics" : "player")}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              activeTab === "lyrics" ? "bg-[#3E5C99] text-white" : "hover:bg-black/5 text-[#1B2A4A]"
            }`}
          >
            <Type size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab Dots */}
        <div className="flex justify-center gap-2 mb-1 relative z-20 shrink-0">
          <button
            onClick={() => setActiveTab("player")}
            className={`h-1.5 rounded-full transition-all ${
              activeTab === "player" ? "w-4 bg-[#1B2A4A]" : "w-1.5 bg-[#1B2A4A]/20"
            }`}
          />
          <button
            onClick={() => setActiveTab("lyrics")}
            className={`h-1.5 rounded-full transition-all ${
              activeTab === "lyrics" ? "w-4 bg-[#1B2A4A]" : "w-1.5 bg-[#1B2A4A]/20"
            }`}
          />
        </div>

        {/* View Container — one view at a time, fully clipped */}
        <div className="flex-1 relative w-full overflow-hidden">
          {activeTab === "player" ? (
            /* PANEL 1: Player */
            <div
              key="player"
              className="absolute inset-0 flex flex-col px-6 pb-7"
              style={{ animation: "merged-fade 0.4s ease" }}
            >
              {/* Cover Art */}
              <div className="mt-1 mb-5 flex justify-center tide-float">
                <div
                  className="w-[240px] h-[240px] rounded-[32px] shadow-xl overflow-hidden relative"
                  style={{
                    background: "linear-gradient(135deg, #3E5C99 0%, #1B2A4A 100%)",
                    boxShadow: "0 20px 40px -10px rgba(62, 92, 153, 0.3)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{ background: "radial-gradient(circle at 20% 80%, #E8956B 0%, transparent 60%)" }}
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{ background: "radial-gradient(circle at 80% 20%, #DCE3EE 0%, transparent 60%)" }}
                  />

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                    <Zap size={14} className="text-[#E8956B] fill-[#E8956B]" />
                    <span className="text-sm font-bold text-[#1B2A4A]">3</span>
                  </div>
                </div>
              </div>

              {/* Title + Artist */}
              <div className="flex flex-col items-center text-center mb-4">
                <h1 className="text-[32px] font-black text-[#1B2A4A] tracking-tight leading-tight mb-0.5">
                  Midnight Bloom
                </h1>
                <h2 className="text-[17px] font-bold text-[#3E5C99] mb-3">Luna Voss</h2>

                {/* Behind the song — expandable */}
                <div className="w-full text-left bg-[#DCE3EE]/50 rounded-2xl px-4 py-3 mx-1">
                  <span className="text-[9px] font-bold tracking-[0.18em] text-[#3E5C99] uppercase">
                    Behind the song
                  </span>
                  <p
                    className={`text-[12.5px] font-medium text-[#1B2A4A]/80 leading-relaxed mt-1 ${
                      storyExpanded ? "max-h-[104px] overflow-y-auto no-scrollbar" : "line-clamp-2"
                    }`}
                  >
                    Written at 3AM in a Tokyo hotel room, Luna wrote{" "}
                    <span className="italic font-semibold text-[#1B2A4A]">"Midnight Bloom"</span> about
                    the quiet seconds right before everything changes — the last calm breath before a
                    goodbye. She recorded the demo on her phone before sunrise and kept that raw,
                    half-whispered vocal in the final cut.{" "}
                    <span className="italic font-semibold text-[#1B2A4A]">
                      "Just a spark in the dark, now it's tearing us apart."
                    </span>
                  </p>
                  <button
                    onClick={() => setStoryExpanded((v) => !v)}
                    className="text-[11px] font-bold text-[#3E5C99] mt-1.5"
                  >
                    {storyExpanded ? "Show less" : "Read the full story"}
                  </button>
                </div>
              </div>

              <div className="flex-1" />

              {/* Waveform & Scrubber */}
              <div className="mb-5">
                <div
                  onClick={() => setFinished(true)}
                  className="h-12 w-full flex items-end justify-between gap-[2px] mb-2 relative cursor-pointer"
                >
                  {Array.from({ length: 48 }).map((_, i) => {
                    const isActive = i < 18; // ~38%
                    const isMoment = i === 8 || i === 14 || i === 36;
                    const height = Math.max(10, Math.sin(i * 0.4) * 50 + Math.cos(i * 0.7) * 30 + 50);

                    return (
                      <div
                        key={i}
                        className="relative flex-1 flex flex-col justify-end items-center h-full"
                      >
                        {isMoment && (
                          <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[#E8956B] shadow-[0_0_6px_rgba(232,149,107,0.8)]" />
                        )}
                        <div
                          className={`w-full rounded-full ${
                            isActive ? "bg-[#1B2A4A]" : "bg-[#DCE3EE]"
                          } ${!isActive && isMoment ? "bg-[#E8956B]/40" : ""} merged-waveform-bar merged-anim-${
                            (i % 4) + 1
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[12px] font-bold text-[#1B2A4A]/50 tracking-widest">
                  <span>1:21</span>
                  <span>3:31</span>
                </div>
              </div>

              {/* Transport Controls (inline Mark Moment) */}
              <div className="flex items-center justify-center gap-7 mb-6">
                <button className="text-[#3E5C99] hover:text-[#1B2A4A] transition-colors">
                  <SkipBack size={26} strokeWidth={2.5} />
                </button>

                <button
                  className="w-[68px] h-[68px] rounded-[26px] flex items-center justify-center text-white shadow-lg shadow-[#3E5C99]/30 hover:scale-105 active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg, #3E5C99 0%, #2A4070 100%)" }}
                >
                  <Pause size={30} strokeWidth={2.5} className="fill-white" />
                </button>

                <button className="w-14 h-14 bg-[#E8956B] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#E8956B]/30 hover:bg-[#E5855A] active:scale-95 transition-all relative tide-pulse">
                  <Zap size={20} fill="currentColor" />
                  <div className="absolute -top-1 -right-1 bg-white text-[#E8956B] text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                    3
                  </div>
                </button>
              </div>

              {/* Reactions — unlock only after the full song is heard */}
              {finished ? (
                <div
                  className="flex items-center gap-3"
                  style={{ animation: "merged-fade 0.4s ease" }}
                >
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[16px] font-bold text-[#3E5C99] transition-colors hover:bg-[#DCE3EE]/80"
                    style={{ backgroundColor: "#DCE3EE" }}
                  >
                    <Star size={18} />
                    <span className="text-[15px]">Discovered</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[16px] font-bold text-[#1B2A4A]/60 transition-colors border-2 border-[#DCE3EE] hover:bg-white/50">
                    <X size={18} />
                    <span className="text-[15px]">Skip</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setFinished(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] text-[#1B2A4A]/40 font-semibold bg-[#1B2A4A]/[0.04] border border-dashed border-[#1B2A4A]/15 cursor-pointer"
                >
                  <Lock size={14} />
                  <span className="text-[13px]">Finish the song to react</span>
                </button>
              )}
            </div>
          ) : (
            /* PANEL 2: Lyrics */
            <div
              key="lyrics"
              className="absolute inset-0 flex flex-col px-6 pt-2 pb-7"
              style={{ animation: "merged-fade 0.4s ease" }}
            >
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center gap-4 mask-lyrics">
                <p className="text-[19px] font-bold text-[#1B2A4A]/25">I was waiting for the sign</p>
                <p className="text-[19px] font-bold text-[#1B2A4A]/25">In the static on the line</p>
                <p className="text-[19px] font-bold text-[#1B2A4A]/30">Shadows moving in my mind</p>

                <div className="py-1">
                  <p className="text-[24px] font-black text-[#1B2A4A] leading-tight mb-2">
                    Just a spark in the dark
                  </p>
                  <p className="text-[24px] font-black text-[#E8956B] leading-tight">
                    Now it's tearing us apart
                  </p>
                </div>

                <p className="text-[19px] font-bold text-[#1B2A4A]/55">Midnight bloom, fading soon</p>
                <p className="text-[19px] font-bold text-[#1B2A4A]/55">Caught between the sun and moon</p>
                <p className="text-[19px] font-bold text-[#1B2A4A]/30">If you leave before I wake</p>
                <p className="text-[19px] font-bold text-[#1B2A4A]/30">Take the pieces I can't fake</p>
              </div>

              {/* Mini Player as normal flex child */}
              <div className="mt-4 bg-white/90 backdrop-blur-xl rounded-[24px] p-3 flex items-center gap-3 shadow-[0_8px_32px_-8px_rgba(27,42,74,0.15)] border border-white">
                <div
                  className="w-12 h-12 rounded-[14px] overflow-hidden relative shadow-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, #3E5C99 0%, #1B2A4A 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{ background: "radial-gradient(circle at 20% 80%, #E8956B 0%, transparent 60%)" }}
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <h3 className="text-[14px] font-black text-[#1B2A4A] truncate">Midnight Bloom</h3>
                  <p className="text-[12px] font-semibold text-[#3E5C99] truncate">Luna Voss</p>
                </div>

                <button className="w-10 h-10 bg-[#E8956B] text-white rounded-full flex items-center justify-center shadow-md shrink-0">
                  <Zap size={14} fill="currentColor" />
                </button>
                <button className="w-10 h-10 text-[#1B2A4A] rounded-full flex items-center justify-center bg-[#DCE3EE]/50 shrink-0">
                  <Pause size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-lyrics {
          mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 78%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 78%, transparent 100%);
        }
        @keyframes merged-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </div>
  );
}
