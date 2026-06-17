export type LinkKey =
  | "spotify"
  | "appleMusic"
  | "youtube"
  | "instagram"
  | "tiktok"
  | "soundcloud"
  | "website";

export const GENRES = [
  "Pop", "Hip-Hop", "R&B", "Electronic", "Indie", "Alternative",
  "Jazz", "Classical", "Rock", "Folk", "Synth-pop", "Soul",
];

export const DISTRIBUTORS = [
  "DistroKid",
  "TuneCore",
  "CD Baby",
  "Amuse",
  "Ditto Music",
  "UnitedMasters",
  "AWAL",
  "Symphonic",
  "Believe",
  "Other",
];

export const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "singer", label: "Singer" },
  { value: "lyricist", label: "Lyricist" },
  { value: "composer", label: "Composer" },
  { value: "producer", label: "Producer" },
  { value: "instrumentalist", label: "Instrumentalist" },
  { value: "mixEngineer", label: "Mix Engineer" },
  { value: "masteringEngineer", label: "Mastering Engineer" },
];

export const LINK_FIELDS: { key: LinkKey; label: string; placeholder: string }[] = [
  { key: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/artist/…" },
  { key: "appleMusic", label: "Apple Music", placeholder: "https://music.apple.com/artist/…" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@…" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@…" },
  { key: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/…" },
  { key: "website", label: "Website", placeholder: "https://…" },
];

export const CREDIT_FIELDS: { key: string; label: string }[] = [
  { key: "lyricist", label: "Lyricist" },
  { key: "composer", label: "Composer" },
  { key: "vocalist", label: "Vocalist" },
  { key: "mixEngineer", label: "Mix Engineer" },
  { key: "masteringEngineer", label: "Mastering Engineer" },
  { key: "producer", label: "Producer" },
];
