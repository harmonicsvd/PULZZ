export interface SongCredits {
  lyricist?: string;
  composer?: string;
  vocalist?: string;
  mixEngineer?: string;
  producer?: string;
}

export interface DemoSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tags: string[];
  story: string;
  lyrics: string;
  lrc?: string;
  credits?: SongCredits;
  releaseDate: string;
  daysUntilRelease: number;
  durationSeconds: number;
  audioUrl: string;
  artworkUrl?: string;
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
    lrc: "[00:17.00] In the quiet between us\n[00:21.50] Something starts to grow\n[00:26.00] Midnight bloom, midnight bloom\n[00:30.50] Where only we will know\n[00:39.00] You're the light I never planned\n[00:43.50] A garden in my hands\n[00:48.00] Midnight bloom, midnight bloom\n[00:52.50] Still learning how to stand",
    credits: {
      lyricist: "Luna Voss",
      composer: "Luna Voss",
      vocalist: "Luna Voss",
      mixEngineer: "Sam Rivera",
      producer: "Theo Hart",
    },
    releaseDate: "2026-06-25",
    daysUntilRelease: 10,
    durationSeconds: 211,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverGradient: ["#3E5C99", "#1B2A4A"],
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
    credits: {
      composer: "NXVUS",
      producer: "NXVUS",
      mixEngineer: "Karl Devine",
    },
    releaseDate: "2026-06-22",
    daysUntilRelease: 7,
    durationSeconds: 195,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverGradient: ["#2A4070", "#0F1A33"],
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
    lrc: "[00:15.00] I hear you in the corners of the room\n[00:20.00] Ghost of something I once knew\n[00:25.00] Chasing echoes, chasing you\n[00:30.00] Into the blue, into the blue\n[00:38.00] You left a season in my chest\n[00:43.00] A winter I can't seem to shed\n[00:48.00] Chasing echoes, chasing you\n[00:53.00] All I've left, all I've left",
    credits: {
      lyricist: "M. Hale",
      composer: "The Veil",
      vocalist: "M. Hale",
      mixEngineer: "Jordan Lee",
      producer: "The Veil",
    },
    releaseDate: "2026-06-28",
    daysUntilRelease: 13,
    durationSeconds: 238,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverGradient: ["#6B5B95", "#2D2150"],
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
    lrc: "[00:14.00] Golden hours slip away\n[00:18.50] Still I hold them close\n[00:23.00] In the places that you stay\n[00:27.50] You're there the most\n[00:35.00] Sunlight through the curtain lace\n[00:39.50] Your laugh inside my bones\n[00:44.00] Golden hours, golden days\n[00:48.50] Never felt alone",
    credits: {
      lyricist: "Aisha Kaine",
      composer: "Aisha Kaine",
      vocalist: "Aisha Kaine",
      mixEngineer: "Nina Brooks",
      producer: "Marcus Bell",
    },
    releaseDate: "2026-06-24",
    daysUntilRelease: 9,
    durationSeconds: 224,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverGradient: ["#E8956B", "#A85A3C"],
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
    lrc: "[00:13.00] City speaks in frequencies\n[00:17.50] I translate them to dreams\n[00:22.00] Neon prayer, neon prayer\n[00:26.50] Nothing's what it seems\n[00:34.00] Dance until the light breaks in\n[00:38.50] Until we're found again\n[00:43.00] Neon prayer, neon prayer\n[00:47.50] Let us begin",
    credits: {
      lyricist: "Valo",
      composer: "Valo",
      vocalist: "Valo",
      mixEngineer: "Ola Pertti",
      producer: "Valo",
    },
    releaseDate: "2026-06-23",
    daysUntilRelease: 8,
    durationSeconds: 202,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    coverGradient: ["#3E7C8C", "#1B3A4A"],
    matchReason: "Trending in your area",
    bpm: 118,
    instruments: ["synthesizer", "drums", "bass", "vocals"],
  },
];
