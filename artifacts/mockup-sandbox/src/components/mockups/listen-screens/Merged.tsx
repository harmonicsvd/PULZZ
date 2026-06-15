import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Zap,
  Star,
  X,
  SkipBack,
  Pause,
  Lock,
} from "lucide-react";
import "./_group.css";

type Sheet = "none" | "lyrics" | "artist";

export function Merged() {
  const [sheet, setSheet] = useState<Sheet>("none");
  const [storyExpanded, setStoryExpanded] = useState(false);
  const [finished, setFinished] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEndPlayer = (e: React.TouchEvent) => {
    const start = touchStartY.current;
    if (start != null && e.changedTouches[0].clientY - start < -45) {
      setSheet("lyrics");
    }
    touchStartY.current = null;
  };
  const onTouchEndSheet = (e: React.TouchEvent) => {
    const start = touchStartY.current;
    if (start != null && e.changedTouches[0].clientY - start > 55) {
      setSheet("none");
    }
    touchStartY.current = null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E5DFD5] p-4 font-sans selection:bg-[#E8956B] selection:text-white">
      {/* Mobile Frame */}
      <div
        className="w-[390px] h-[844px] relative overflow-hidden rounded-[40px] shadow-2xl flex flex-col border-[8px] border-white/20"
        style={{ backgroundColor: "#F4EDE4" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
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

          {/* spacer keeps the title centered */}
          <div className="w-10 h-10" />
        </div>

        {/* View Container */}
        <div className="flex-1 relative w-full overflow-hidden">
          {/* PLAYER (base view) */}
          <div
            className="absolute inset-0 flex flex-col px-6 pb-5"
            style={{ animation: "merged-fade 0.4s ease" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEndPlayer}
          >
            {/* Cover Art */}
            <div className="mt-1 mb-4 flex justify-center tide-float">
              <div
                className="w-[226px] h-[226px] rounded-[32px] shadow-xl overflow-hidden relative"
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
            <div className="flex flex-col items-center text-center mb-3">
              <h1 className="text-[30px] font-black text-[#1B2A4A] tracking-tight leading-tight mb-0.5">
                Midnight Bloom
              </h1>
              <button
                onClick={() => setSheet("artist")}
                className="inline-flex items-center gap-1 text-[16px] font-bold text-[#3E5C99] mb-3 hover:text-[#1B2A4A] transition-colors"
              >
                Luna Voss
                <ChevronRight size={15} strokeWidth={2.75} />
              </button>

              {/* Behind the song — expandable */}
              <div className="w-full text-left bg-[#DCE3EE]/50 rounded-2xl px-4 py-3 mx-1">
                <span className="text-[9px] font-bold tracking-[0.18em] text-[#3E5C99] uppercase">
                  Behind the song
                </span>
                <p
                  className={`text-[12.5px] font-medium text-[#1B2A4A]/80 leading-relaxed mt-1 ${
                    storyExpanded ? "max-h-[92px] overflow-y-auto no-scrollbar" : "line-clamp-2"
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
            <div className="mb-4">
              <div
                onClick={() => setFinished(true)}
                className="h-11 w-full flex items-end justify-between gap-[2px] mb-2 relative cursor-pointer"
              >
                {Array.from({ length: 48 }).map((_, i) => {
                  const isActive = i < 18;
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
            <div className="flex items-center justify-center gap-7 mb-4">
              <button className="text-[#3E5C99] hover:text-[#1B2A4A] transition-colors">
                <SkipBack size={26} strokeWidth={2.5} />
              </button>
              <button
                className="w-[66px] h-[66px] rounded-[26px] flex items-center justify-center text-white shadow-lg shadow-[#3E5C99]/30 hover:scale-105 active:scale-95 transition-all"
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
              <div className="flex items-center gap-3" style={{ animation: "merged-fade 0.4s ease" }}>
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

            {/* Swipe-up handle → lyrics & song details */}
            <button
              onClick={() => setSheet("lyrics")}
              className="mt-3 w-full flex flex-col items-center gap-1 text-[#1B2A4A]/40 hover:text-[#1B2A4A]/70 transition-colors"
            >
              <div className="w-9 h-1 rounded-full bg-[#1B2A4A]/15" />
              <div className="flex items-center gap-1">
                <ChevronUp size={13} strokeWidth={2.75} />
                <span className="text-[10.5px] font-bold tracking-wide uppercase">
                  Swipe up · Lyrics &amp; details
                </span>
              </div>
            </button>
          </div>

          {/* LYRICS + SONG DETAILS SHEET */}
          {sheet === "lyrics" && (
            <div
              className="absolute inset-0 z-30 flex flex-col"
              style={{
                backgroundColor: "#F4EDE4",
                animation: "merged-sheet-up 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEndSheet}
            >
              <button
                onClick={() => setSheet("none")}
                className="pt-3 pb-2 flex flex-col items-center shrink-0 group"
              >
                <div className="w-10 h-1.5 rounded-full bg-[#1B2A4A]/15 group-hover:bg-[#1B2A4A]/30 transition-colors" />
              </button>

              <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6">
                <h3 className="text-[11px] font-bold tracking-[0.18em] text-[#3E5C99] uppercase mb-3">
                  Lyrics
                </h3>
                <div className="flex flex-col gap-2.5">
                  <p className="text-[18px] font-bold text-[#1B2A4A]/30">I was waiting for the sign</p>
                  <p className="text-[18px] font-bold text-[#1B2A4A]/30">In the static on the line</p>
                  <p className="text-[18px] font-bold text-[#1B2A4A]/35">Shadows moving in my mind</p>
                  <div className="py-1">
                    <p className="text-[22px] font-black text-[#1B2A4A] leading-tight">
                      Just a spark in the dark
                    </p>
                    <p className="text-[22px] font-black text-[#E8956B] leading-tight">
                      Now it's tearing us apart
                    </p>
                  </div>
                  <p className="text-[18px] font-bold text-[#1B2A4A]/55">Midnight bloom, fading soon</p>
                  <p className="text-[18px] font-bold text-[#1B2A4A]/55">Caught between the sun and moon</p>
                  <p className="text-[18px] font-bold text-[#1B2A4A]/30">If you leave before I wake</p>
                  <p className="text-[18px] font-bold text-[#1B2A4A]/30">Take the pieces I can't fake</p>
                </div>

                <div className="h-px bg-[#1B2A4A]/10 my-5" />

                <h3 className="text-[11px] font-bold tracking-[0.18em] text-[#3E5C99] uppercase mb-3">
                  Song details
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                  {[
                    ["Genre", "Indie Pop"],
                    ["Length", "3:31"],
                    ["Key", "F♯ minor"],
                    ["Tempo", "92 BPM"],
                    ["Releases", "Jun 25, 2026"],
                    ["Label", "Independent"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="text-[10px] font-bold tracking-wide text-[#1B2A4A]/40 uppercase">
                        {label}
                      </div>
                      <div className="text-[14px] font-bold text-[#1B2A4A]">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#DCE3EE]/50 rounded-2xl px-4 py-3 mb-2">
                  <div className="text-[10px] font-bold tracking-wide text-[#1B2A4A]/40 uppercase mb-1">
                    Credits
                  </div>
                  <p className="text-[12.5px] font-medium text-[#1B2A4A]/80 leading-relaxed">
                    Written, performed &amp; produced by Luna Voss. Recorded in Tokyo, mixed in Lisbon.
                  </p>
                </div>
              </div>

              {/* Mini player */}
              <div className="px-6 pb-6 pt-2 shrink-0">
                <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-3 flex items-center gap-3 shadow-[0_8px_32px_-8px_rgba(27,42,74,0.15)] border border-white">
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
            </div>
          )}

          {/* ARTIST SHEET */}
          {sheet === "artist" && (
            <div
              className="absolute inset-0 z-30 flex flex-col"
              style={{
                backgroundColor: "#F4EDE4",
                animation: "merged-sheet-up 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEndSheet}
            >
              <button
                onClick={() => setSheet("none")}
                className="pt-3 pb-2 flex flex-col items-center shrink-0 group"
              >
                <div className="w-10 h-1.5 rounded-full bg-[#1B2A4A]/15 group-hover:bg-[#1B2A4A]/30 transition-colors" />
              </button>

              <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 pb-4">
                <div className="flex flex-col items-center text-center mt-2">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden relative shadow-lg shadow-[#3E5C99]/20 mb-3"
                    style={{ background: "linear-gradient(135deg, #E8956B 0%, #3E5C99 100%)" }}
                  >
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{ background: "radial-gradient(circle at 30% 30%, #F4EDE4 0%, transparent 55%)" }}
                    />
                  </div>
                  <h2 className="text-[24px] font-black text-[#1B2A4A] leading-tight">Luna Voss</h2>
                  <span className="mt-1.5 text-[11px] font-bold tracking-wide text-[#3E5C99] bg-[#DCE3EE]/70 px-3 py-1 rounded-full">
                    Indie Pop · Lisbon
                  </span>
                  <button className="mt-3 px-6 py-2.5 rounded-full bg-[#1B2A4A] text-white text-[13px] font-bold hover:bg-[#3E5C99] transition-colors">
                    Follow
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {[
                    ["12.4k", "Listeners"],
                    ["3", "In discovery"],
                    ["1.8k", "Discovered"],
                  ].map(([value, label]) => (
                    <div key={label} className="bg-[#DCE3EE]/50 rounded-2xl py-3 text-center">
                      <div className="text-[18px] font-black text-[#1B2A4A]">{value}</div>
                      <div className="text-[10px] font-bold tracking-wide text-[#1B2A4A]/45 uppercase mt-0.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div className="mt-5">
                  <h3 className="text-[11px] font-bold tracking-[0.18em] text-[#3E5C99] uppercase mb-2">
                    About
                  </h3>
                  <p className="text-[13px] font-medium text-[#1B2A4A]/80 leading-relaxed">
                    Luna Voss is a Lisbon-based indie-pop songwriter known for nocturnal, diaristic
                    songs and lo-fi textures. She writes alone — usually long after midnight — and
                    releases everything independently, demos and all.
                  </p>
                </div>

                {/* More from */}
                <div className="mt-5">
                  <h3 className="text-[11px] font-bold tracking-[0.18em] text-[#3E5C99] uppercase mb-2">
                    More from Luna Voss
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[
                      ["Paper Tides", "Out now"],
                      ["Slow Burn", "Pre-release · 24 days"],
                    ].map(([title, status]) => (
                      <div
                        key={title}
                        className="flex items-center gap-3 bg-white/70 rounded-2xl p-2.5 border border-white"
                      >
                        <div
                          className="w-11 h-11 rounded-[12px] overflow-hidden relative shadow-sm shrink-0"
                          style={{ background: "linear-gradient(135deg, #3E5C99 0%, #1B2A4A 100%)" }}
                        >
                          <div
                            className="absolute inset-0 opacity-50"
                            style={{ background: "radial-gradient(circle at 25% 75%, #E8956B 0%, transparent 60%)" }}
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-[14px] font-bold text-[#1B2A4A] truncate">{title}</h4>
                          <p className="text-[11.5px] font-semibold text-[#1B2A4A]/45 truncate">
                            {status}
                          </p>
                        </div>
                        <ChevronRight size={18} className="text-[#1B2A4A]/30 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
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
        @keyframes merged-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes merged-sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `,
        }}
      />
    </div>
  );
}
