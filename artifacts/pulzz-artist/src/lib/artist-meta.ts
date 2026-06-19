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

// --- Submission rules (shown on the welcome page + enforced on the submit form) ---

/** Minimum lead time (in days) between submission and the scheduled release. */
export const MIN_RELEASE_LEAD_DAYS = 10;

export const SUBMISSION_RULES: { title: string; body: string }[] = [
  {
    title: "Original work, your rights",
    body: "The song must be your own original work and you must hold the rights to it.",
  },
  {
    title: "Delivered to your distributor",
    body: "The track must already be delivered to your distributor before you add it to Pulzz.",
  },
  {
    title: "Submit ahead of release",
    body: `Submit at least ${MIN_RELEASE_LEAD_DAYS} days (about a week and a half) before your release date, so listeners have time to discover it first.`,
  },
];

// --- Streaming presence (artist profile) ---

export const STREAMING_PLATFORMS: { key: LinkKey; label: string; metric: string }[] = [
  { key: "spotify", label: "Spotify", metric: "monthly listeners" },
  { key: "appleMusic", label: "Apple Music", metric: "monthly listeners" },
  { key: "youtube", label: "YouTube", metric: "subscribers" },
  { key: "soundcloud", label: "SoundCloud", metric: "followers" },
  { key: "instagram", label: "Instagram", metric: "followers" },
  { key: "tiktok", label: "TikTok", metric: "followers" },
];

/**
 * Deterministic placeholder audience size for an artist on a given platform.
 * Static demo data only — real figures will come from the streaming partners
 * later. Stable across renders/sessions so the numbers don't flicker.
 */
export function placeholderFollowerCount(seed: number, key: string): number {
  let h = ((seed + 1) * 2654435761) >>> 0;
  for (let i = 0; i < key.length; i++) {
    h = ((h ^ key.charCodeAt(i)) * 16777619) >>> 0;
  }
  return 5000 + (h % 95000);
}
