export interface DemoSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tags: string[];
  story: string;
  lyrics: string;
  releaseDate: string;
  daysUntilRelease: number;
  durationSeconds: number;
  audioUrl: string;
  coverGradient: [string, string];
  matchReason: string;
  bpm: number;
  instruments: string[];
}

export const DEMO_SONGS: DemoSong[] = [
  {
    id: "1",
    title: "Midnight Bloom",
    artist: "Luna Voss",
    genre: "Indie Pop",
    tags: ["dreamy", "late night", "introspective"],
    story:
      "I wrote this at 3am after a conversation I couldn't stop thinking about. It's about the feeling of being on the edge of something — not sure if it's ending or beginning. The reverb on the guitar was an accident that I kept.",
    lyrics:
      "In the quiet between us / Something starts to grow / Midnight bloom, midnight bloom / Where only we will know\n\nYou're the light I never planned / A garden in my hands / Midnight bloom, midnight bloom / Still learning how to stand",
    releaseDate: "2026-06-25",
    daysUntilRelease: 10,
    durationSeconds: 211,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverGradient: ["#1A0533", "#4A1A6E"],
    matchReason: "Matches your indie taste",
    bpm: 82,
    instruments: ["guitar", "piano", "vocals", "synth"],
  },
  {
    id: "2",
    title: "Electric Reverie",
    artist: "NXVUS",
    genre: "Electronic",
    tags: ["atmospheric", "hypnotic", "instrumental"],
    story:
      "Built entirely from one chord I played on a broken keyboard. The distortion was the keyboard malfunctioning — I recorded it immediately and built the whole track around that texture.",
    lyrics: "",
    releaseDate: "2026-06-22",
    daysUntilRelease: 7,
    durationSeconds: 195,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverGradient: ["#0A1128", "#1A3A6E"],
    matchReason: "Based on your electronic picks",
    bpm: 128,
    instruments: ["synthesizer", "drums", "bass"],
  },
  {
    id: "3",
    title: "Chasing Echoes",
    artist: "The Veil",
    genre: "Alternative",
    tags: ["raw", "cathartic", "heartbreak"],
    story:
      "This is the song I needed to write but kept avoiding. About a friendship that became something else and then became nothing. We recorded it live, all in one room, no click track.",
    lyrics:
      "I hear you in the corners of the room / Ghost of something I once knew / Chasing echoes, chasing you / Into the blue, into the blue\n\nYou left a season in my chest / A winter I can't seem to shed / Chasing echoes, chasing you / All I've left, all I've left",
    releaseDate: "2026-06-28",
    daysUntilRelease: 13,
    durationSeconds: 238,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverGradient: ["#1A0A1A", "#4A0A3A"],
    matchReason: "Matches your alternative mood",
    bpm: 76,
    instruments: ["guitar", "bass", "drums", "vocals"],
  },
  {
    id: "4",
    title: "Golden Hours",
    artist: "Aisha Kaine",
    genre: "R&B",
    tags: ["warm", "nostalgic", "love"],
    story:
      "For my grandmother, who used to say that the best hours of her life happened when nobody was watching. I hope this song makes you feel like you're in a warm room with someone you love.",
    lyrics:
      "Golden hours slip away / Still I hold them close / In the places that you stay / You're there the most\n\nSunlight through the curtain lace / Your laugh inside my bones / Golden hours, golden days / Never felt alone",
    releaseDate: "2026-06-24",
    daysUntilRelease: 9,
    durationSeconds: 224,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverGradient: ["#1A0E00", "#5A3000"],
    matchReason: "Matches your R&B preferences",
    bpm: 88,
    instruments: ["piano", "vocals", "strings", "bass"],
  },
  {
    id: "5",
    title: "Neon Prayer",
    artist: "Valo",
    genre: "Synth-pop",
    tags: ["euphoric", "danceable", "urban"],
    story:
      "Written after walking through the city at 2am after a show. Everything felt too big and too small at once. The drop was designed to feel like a street light flickering on.",
    lyrics:
      "City speaks in frequencies / I translate them to dreams / Neon prayer, neon prayer / Nothing's what it seems\n\nDance until the light breaks in / Until we're found again / Neon prayer, neon prayer / Let us begin",
    releaseDate: "2026-06-23",
    daysUntilRelease: 8,
    durationSeconds: 202,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    coverGradient: ["#001A1A", "#003A4A"],
    matchReason: "Trending in your area",
    bpm: 118,
    instruments: ["synthesizer", "drums", "bass", "vocals"],
  },
];
