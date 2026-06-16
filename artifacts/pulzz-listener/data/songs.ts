export interface SongCredits {
    lyricist?: string;
    composer?: string;
    vocalist?: string;
    mixEngineer?: string;
    producer?: string;
  }

  export interface SongLicense {
    type: string;
    detail?: string;
    source?: string;
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
    license?: SongLicense;
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

  // Audio + cover art live on the API server under /api/media. mediaUrl() turns
  // those relative paths into absolute URLs so expo-av / Image work on native.
  import { mediaUrl } from "@/lib/media";
  
  export const DEMO_SONGS: DemoSong[] = [
    {
      id: "1",
      title: "Neon Rain",
      artist: "Mara Vox",
      genre: "Synth-pop",
      tags: ["dreamy","nocturnal","synthwave"],
      story: "Mara Vox wrote 'Neon Rain' alone in a rain-soaked apartment, turning a breakup into a glittering synth-pop ritual: if the city won't stop crying, you might as well dance in it.",
      lyrics: "City lights are bleeding through the window\nI trace your name in fog on the glass\nNeon rain is falling on the sidewalk\nEvery color says you're never coming back\nBut I dance, I dance in the neon rain\nLet it wash away the echo of your name\nI dance, I dance in the neon rain\nTill the morning turns the midnight blue again",
      lrc: "[00:02.50] City lights are bleeding through the window\n[00:05.82] I trace your name in fog on the glass\n[00:08.82] Neon rain is falling on the sidewalk\n[00:12.14] Every color says you're never coming back\n[00:16.13] But I dance, I dance in the neon rain\n[00:19.12] Let it wash away the echo of your name\n[00:22.78] I dance, I dance in the neon rain\n[00:25.44] Till the morning turns the midnight blue again",
      credits: {"lyricist":"Mara Vox","composer":"Mara Vox","producer":"Pulzz Originals","vocalist":"Mara Vox"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      releaseDate: "2026-06-24",
      daysUntilRelease: 8,
      durationSeconds: 32,
      audioUrl: mediaUrl("/api/media/song-1.mp3")!,
      artworkUrl: mediaUrl("/api/media/art-1.png"),
      coverGradient: ["#311e66", "#7B4DFF"],
      matchReason: "Neon-soaked synth-pop to open your night",
      bpm: 104,
      instruments: ["synths","drum machine","bass","vocals"],
    },
  {
      id: "2",
      title: "Paper Planes",
      artist: "The Hollow Coast",
      genre: "Indie",
      tags: ["wistful","anthemic","coming-of-age"],
      story: "The Hollow Coast made 'Paper Planes' as a love letter to a hometown summer — the kind you spend folding your dreams into something light enough to throw off a rooftop.",
      lyrics: "We were seventeen and made of August\nFolding all our dreams to paper planes\nThrew them off the roof above the city\nWatched them catch the wind and drift away\nOh, we were never meant to stay the same\nWe were paper planes\nChasing every storm just to feel the rain\nWe were paper planes",
      lrc: "[00:02.50] We were seventeen and made of August\n[00:06.05] Folding all our dreams to paper planes\n[00:09.60] Threw them off the roof above the city\n[00:13.14] Watched them catch the wind and drift away\n[00:16.69] Oh, we were never meant to stay the same\n[00:20.24] We were paper planes\n[00:22.37] Chasing every storm just to feel the rain\n[00:26.27] We were paper planes",
      credits: {"lyricist":"The Hollow Coast","composer":"The Hollow Coast","producer":"Pulzz Originals","vocalist":"The Hollow Coast"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      releaseDate: "2026-06-22",
      daysUntilRelease: 6,
      durationSeconds: 29,
      audioUrl: mediaUrl("/api/media/song-2.mp3")!,
      artworkUrl: mediaUrl("/api/media/art-2.png"),
      coverGradient: ["#66241d", "#FF5C49"],
      matchReason: "Anthemic indie nostalgia",
      bpm: 122,
      instruments: ["electric guitar","drums","bass","vocals"],
    },
  {
      id: "3",
      title: "Gold Hour",
      artist: "Sable",
      genre: "R&B",
      tags: ["warm","romantic","smooth"],
      story: "Sable captured 'Gold Hour' in a single take at dusk, chasing that warm honey light where time slows down and nobody wants the evening to end.",
      lyrics: "Sunlight pouring slow like honey\nYour hand is warm against my own\nWe don't need a single reason\nTo let the evening carry on\nThis is our gold hour, baby\nNothing else can touch us now\nThis is our gold hour, baby\nStay with me and slow it down",
      lrc: "[00:02.50] Sunlight pouring slow like honey\n[00:05.07] Your hand is warm against my own\n[00:07.64] We don't need a single reason\n[00:10.21] To let the evening carry on\n[00:13.10] This is our gold hour, baby\n[00:15.35] Nothing else can touch us now\n[00:17.60] This is our gold hour, baby\n[00:19.85] Stay with me and slow it down",
      credits: {"lyricist":"Sable","composer":"Sable","producer":"Pulzz Originals","vocalist":"Sable"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      releaseDate: "2026-06-27",
      daysUntilRelease: 11,
      durationSeconds: 24,
      audioUrl: mediaUrl("/api/media/song-3.mp3")!,
      artworkUrl: mediaUrl("/api/media/art-3.png"),
      coverGradient: ["#594324", "#E0A85C"],
      matchReason: "Smooth golden-hour R&B",
      bpm: 90,
      instruments: ["electric piano","bass","drums","vocals"],
    },
  {
      id: "4",
      title: "Concrete Garden",
      artist: "Kplaces",
      genre: "Lo-fi",
      tags: ["chill","reflective","lo-fi"],
      story: "Kplaces built 'Concrete Garden' from late-night loops, a quiet reminder that growth happens slowly, even in the cracks of a grey city.",
      lyrics: "Coffee going cold beside the window\nRain is tapping soft against the pane\nFlowers pushing up through broken pavement\nFinding little ways to bloom again\nIn my concrete garden\nI am learning how to grow\nIn my concrete garden\nTaking it slow, taking it slow",
      lrc: "[00:02.50] Coffee going cold beside the window\n[00:05.24] Rain is tapping soft against the pane\n[00:08.32] Flowers pushing up through broken pavement\n[00:12.08] Finding little ways to bloom again\n[00:15.16] In my concrete garden\n[00:17.21] I am learning how to grow\n[00:19.61] In my concrete garden\n[00:21.66] Taking it slow, taking it slow",
      credits: {"lyricist":"Kplaces","composer":"Kplaces","producer":"Pulzz Originals","vocalist":"Kplaces"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      releaseDate: "2026-06-29",
      daysUntilRelease: 13,
      durationSeconds: 25,
      audioUrl: mediaUrl("/api/media/song-4.mp3")!,
      artworkUrl: mediaUrl("/api/media/art-4.png"),
      coverGradient: ["#264337", "#5FA88A"],
      matchReason: "Chilled lo-fi to slow down to",
      bpm: 78,
      instruments: ["lofi keys","mellow drums","bass","vocals"],
    },
  {
      id: "5",
      title: "Lighthouse",
      artist: "Aria Lune",
      genre: "Pop",
      tags: ["uplifting","hopeful","anthem"],
      story: "Aria Lune wrote 'Lighthouse' for anyone lost at sea in their own life — a bright, steady pop anthem promising someone is still shining for you.",
      lyrics: "When the night is closing over\nAnd you can't find your way\nI will be your lighthouse\nCutting through the grey\nSo hold on, hold on\nI am shining for you\nHold on, hold on\nI will carry you through",
      lrc: "[00:02.50] When the night is closing over\n[00:05.39] And you can't find your way\n[00:07.55] I will be your lighthouse\n[00:09.72] Cutting through the grey\n[00:11.52] So hold on, hold on\n[00:13.33] I am shining for you\n[00:15.49] Hold on, hold on\n[00:16.93] I will carry you through",
      credits: {"lyricist":"Aria Lune","composer":"Aria Lune","producer":"Pulzz Originals","vocalist":"Aria Lune"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      releaseDate: "2026-06-25",
      daysUntilRelease: 9,
      durationSeconds: 22,
      audioUrl: mediaUrl("/api/media/song-5.mp3")!,
      artworkUrl: mediaUrl("/api/media/art-5.png"),
      coverGradient: ["#194266", "#3FA7FF"],
      matchReason: "A bright, hopeful pop anthem",
      bpm: 116,
      instruments: ["synth","piano","drums","vocals"],
    },
  ];
  