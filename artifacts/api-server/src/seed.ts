import { sql } from "drizzle-orm";
  import {
    db,
    songsTable,
    artistsTable,
    type InsertArtist,
    type InsertSong,
  } from "@workspace/db";

  /**
   * Reproducible seed for the Pulzz discovery pool.
   *
   * The five demo tracks are original recordings produced for Pulzz (lyrics,
   * vocals, instrumental bed and cover art all generated in-house), so the
   * audio matches the stored lyrics and per-line LRC timing exactly. Audio and
   * artwork are served by this API server from public/media under /api/media.
   *
   * The same catalog powers both the listener demo data
   * (artifacts/pulzz-listener/data/songs.ts) and the artist dashboard.
   *
   * Rows are upserted IN PLACE by primary key (never deleted / reinserted) so the
   * existing reactions and moment marks that reference song_id 1..5 stay valid.
   */

  type SeedArtist = InsertArtist & { id: number };
  type SeedSong = InsertSong & { id: number };

  const artists: SeedArtist[] = [
    {
      id: 1,
      name: "Mara Vox",
      email: "mara.vox@pulzz.demo",
      bio: "Synth-pop artist crafting nocturnal, neon-lit electronic pop.",
      genre: "Synth-pop",
    },
  {
      id: 2,
      name: "The Hollow Coast",
      email: "the.hollow.coast@pulzz.demo",
      bio: "Indie band making anthemic, nostalgia-soaked guitar music.",
      genre: "Indie",
    },
  {
      id: 3,
      name: "Sable",
      email: "sable@pulzz.demo",
      bio: "R&B singer-songwriter known for warm, intimate grooves.",
      genre: "R&B",
    },
  {
      id: 4,
      name: "Kplaces",
      email: "kplaces@pulzz.demo",
      bio: "Lo-fi producer making mellow, reflective beats.",
      genre: "Lo-fi",
    },
  {
      id: 5,
      name: "Aria Lune",
      email: "aria.lune@pulzz.demo",
      bio: "Pop artist writing bright, uplifting anthems.",
      genre: "Pop",
    },
  ];

  const songs: SeedSong[] = [
    {
      id: 1,
      artistId: 1,
      title: "Neon Rain",
      genre: "Synth-pop",
      language: "en",
      releaseDate: "2026-06-24",
      isrc: null,
      audioUrl: "/api/media/song-1.mp3",
      artworkUrl: "/api/media/art-1.png",
      story: "Mara Vox wrote 'Neon Rain' alone in a rain-soaked apartment, turning a breakup into a glittering synth-pop ritual: if the city won't stop crying, you might as well dance in it.",
      lyrics: "City lights are bleeding through the window\nI trace your name in fog on the glass\nNeon rain is falling on the sidewalk\nEvery color says you're never coming back\nBut I dance, I dance in the neon rain\nLet it wash away the echo of your name\nI dance, I dance in the neon rain\nTill the morning turns the midnight blue again",
      lrc: "[00:02.50] City lights are bleeding through the window\n[00:05.59] I trace your name in fog on the glass\n[00:08.58] Neon rain is falling on the sidewalk\n[00:11.57] Every color says you're never coming back\n[00:14.79] But I dance, I dance in the neon rain\n[00:18.51] Let it wash away the echo of your name\n[00:21.74] I dance, I dance in the neon rain\n[00:25.38] Till the morning turns the midnight blue again",
      credits: {"lyricist":"Mara Vox","composer":"Mara Vox","producer":"Pulzz Originals","vocalist":"Mara Vox"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      instruments: ["synths","drum machine","bass","vocals"],
      durationSeconds: 32,
      coverColor: "#7B4DFF",
      tags: ["dreamy","nocturnal","synthwave"],
    },
  {
      id: 2,
      artistId: 2,
      title: "Paper Planes",
      genre: "Indie",
      language: "en",
      releaseDate: "2026-06-22",
      isrc: null,
      audioUrl: "/api/media/song-2.mp3",
      artworkUrl: "/api/media/art-2.png",
      story: "The Hollow Coast made 'Paper Planes' as a love letter to a hometown summer — the kind you spend folding your dreams into something light enough to throw off a rooftop.",
      lyrics: "We were seventeen and made of August\nFolding all our dreams to paper planes\nThrew them off the roof above the city\nWatched them catch the wind and drift away\nOh, we were never meant to stay the same\nWe were paper planes\nChasing every storm just to feel the rain\nWe were paper planes",
      lrc: "[00:02.50] We were seventeen and made of August\n[00:05.54] Folding all our dreams to paper planes\n[00:08.76] Threw them off the roof above the city\n[00:11.47] Watched them catch the wind and drift away\n[00:14.82] Oh, we were never meant to stay the same\n[00:17.86] We were paper planes\n[00:19.91] Chasing every storm just to feel the rain\n[00:23.37] We were paper planes",
      credits: {"lyricist":"The Hollow Coast","composer":"The Hollow Coast","producer":"Pulzz Originals","vocalist":"The Hollow Coast"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      instruments: ["electric guitar","drums","bass","vocals"],
      durationSeconds: 29,
      coverColor: "#FF5C49",
      tags: ["wistful","anthemic","coming-of-age"],
    },
  {
      id: 3,
      artistId: 3,
      title: "Gold Hour",
      genre: "R&B",
      language: "en",
      releaseDate: "2026-06-27",
      isrc: null,
      audioUrl: "/api/media/song-3.mp3",
      artworkUrl: "/api/media/art-3.png",
      story: "Sable captured 'Gold Hour' in a single take at dusk, chasing that warm honey light where time slows down and nobody wants the evening to end.",
      lyrics: "Sunlight pouring slow like honey\nYour hand is warm against my own\nWe don't need a single reason\nTo let the evening carry on\nThis is our gold hour, baby\nNothing else can touch us now\nThis is our gold hour, baby\nStay with me and slow it down",
      lrc: "[00:02.50] Sunlight pouring slow like honey\n[00:05.18] Your hand is warm against my own\n[00:07.80] We don't need a single reason\n[00:09.90] To let the evening carry on\n[00:12.18] This is our gold hour, baby\n[00:14.33] Nothing else can touch us now\n[00:16.49] This is our gold hour, baby\n[00:18.87] Stay with me and slow it down",
      credits: {"lyricist":"Sable","composer":"Sable","producer":"Pulzz Originals","vocalist":"Sable"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      instruments: ["electric piano","bass","drums","vocals"],
      durationSeconds: 24,
      coverColor: "#E0A85C",
      tags: ["warm","romantic","smooth"],
    },
  {
      id: 4,
      artistId: 4,
      title: "Concrete Garden",
      genre: "Lo-fi",
      language: "en",
      releaseDate: "2026-06-29",
      isrc: null,
      audioUrl: "/api/media/song-4.mp3",
      artworkUrl: "/api/media/art-4.png",
      story: "Kplaces built 'Concrete Garden' from late-night loops, a quiet reminder that growth happens slowly, even in the cracks of a grey city.",
      lyrics: "Coffee going cold beside the window\nRain is tapping soft against the pane\nFlowers pushing up through broken pavement\nFinding little ways to bloom again\nIn my concrete garden\nI am learning how to grow\nIn my concrete garden\nTaking it slow, taking it slow",
      lrc: "[00:02.50] Coffee going cold beside the window\n[00:05.20] Rain is tapping soft against the pane\n[00:08.29] Flowers pushing up through broken pavement\n[00:11.47] Finding little ways to bloom again\n[00:13.91] In my concrete garden\n[00:15.87] I am learning how to grow\n[00:17.84] In my concrete garden\n[00:19.87] Taking it slow, taking it slow",
      credits: {"lyricist":"Kplaces","composer":"Kplaces","producer":"Pulzz Originals","vocalist":"Kplaces"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      instruments: ["lofi keys","mellow drums","bass","vocals"],
      durationSeconds: 25,
      coverColor: "#5FA88A",
      tags: ["chill","reflective","lo-fi"],
    },
  {
      id: 5,
      artistId: 5,
      title: "Lighthouse",
      genre: "Pop",
      language: "en",
      releaseDate: "2026-06-25",
      isrc: null,
      audioUrl: "/api/media/song-5.mp3",
      artworkUrl: "/api/media/art-5.png",
      story: "Aria Lune wrote 'Lighthouse' for anyone lost at sea in their own life — a bright, steady pop anthem promising someone is still shining for you.",
      lyrics: "When the night is closing over\nAnd you can't find your way\nI will be your lighthouse\nCutting through the grey\nSo hold on, hold on\nI am shining for you\nHold on, hold on\nI will carry you through",
      lrc: "[00:02.50] When the night is closing over\n[00:04.94] And you can't find your way\n[00:07.14] I will be your lighthouse\n[00:09.19] Cutting through the grey\n[00:11.16] So hold on, hold on\n[00:13.18] I am shining for you\n[00:15.23] Hold on, hold on\n[00:17.02] I will carry you through",
      credits: {"lyricist":"Aria Lune","composer":"Aria Lune","producer":"Pulzz Originals","vocalist":"Aria Lune"},
      license: {"type":"Original","detail":"Original demo track produced for Pulzz; all rights cleared for in-app playback."},
      instruments: ["synth","piano","drums","vocals"],
      durationSeconds: 22,
      coverColor: "#3FA7FF",
      tags: ["uplifting","hopeful","anthem"],
    },
  ];

  async function seed(): Promise<void> {
    for (const { id, ...rest } of artists) {
      await db
        .insert(artistsTable)
        .values({ id, ...rest })
        .onConflictDoUpdate({ target: artistsTable.id, set: rest });
    }

    for (const { id, ...rest } of songs) {
      await db
        .insert(songsTable)
        .values({ id, ...rest })
        .onConflictDoUpdate({ target: songsTable.id, set: rest });
    }

    // Keep the serial sequences ahead of the explicitly-seeded ids so future
    // inserts (e.g. artist song submissions) don't collide with seeded rows.
    await db.execute(
      sql`SELECT setval(pg_get_serial_sequence('artists', 'id'), (SELECT MAX(id) FROM artists))`
    );
    await db.execute(
      sql`SELECT setval(pg_get_serial_sequence('songs', 'id'), (SELECT MAX(id) FROM songs))`
    );

    console.log(`Seeded ${artists.length} artists and ${songs.length} songs.`);
  }

  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
  