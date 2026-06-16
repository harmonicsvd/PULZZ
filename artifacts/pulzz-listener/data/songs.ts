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

export const DEMO_SONGS: DemoSong[] = [
  {
    id: "1",
    title: "Danny Boy",
    artist: "Ernestine Schumann-Heink",
    genre: "Folk",
    tags: ["timeless", "longing", "ballad"],
    story:
      "A 1917 recording of the beloved Irish ballad, sung by contralto Ernestine Schumann-Heink. Set to the old 'Londonderry Air', the lyric is a parent's farewell to a departing son — a goodbye stretched across the seasons until the singer's own last day.",
    lyrics:
      "Oh Danny boy, the pipes, the pipes are calling\nFrom glen to glen, and down the mountain side\nThe summer's gone, and all the roses falling\n'Tis you, 'tis you must go and I must bide\n\nBut come ye back when summer's in the meadow\nOr when the valley's hushed and white with snow\n'Tis I'll be here in sunshine or in shadow\nOh Danny boy, oh Danny boy, I love you so\n\nBut when ye come, and all the flowers are dying\nIf I am dead, as dead I well may be\nYe'll come and find the place where I am lying\nAnd kneel and say an Ave there for me",
    lrc: "[00:18.00] Oh Danny boy, the pipes, the pipes are calling\n[00:27.00] From glen to glen, and down the mountain side\n[00:36.00] The summer's gone, and all the roses falling\n[00:45.00] 'Tis you, 'tis you must go and I must bide\n[00:56.00] But come ye back when summer's in the meadow\n[01:05.00] Or when the valley's hushed and white with snow\n[01:14.00] 'Tis I'll be here in sunshine or in shadow\n[01:23.00] Oh Danny boy, oh Danny boy, I love you so\n[01:38.00] But when ye come, and all the flowers are dying\n[01:47.00] If I am dead, as dead I well may be\n[01:56.00] Ye'll come and find the place where I am lying\n[02:05.00] And kneel and say an Ave there for me",
    credits: {
      lyricist: "Frederic Weatherly",
      composer: "Traditional (Londonderry Air)",
      vocalist: "Ernestine Schumann-Heink",
    },
    releaseDate: "2026-06-25",
    daysUntilRelease: 10,
    durationSeconds: 214,
    audioUrl:
      "https://archive.org/download/78_danny-boy_ernestine-schumann-heink-fred-e-weatherly_gbia0523653a/Danny%20Boy%20-%20Ernestine%20Schumann-Heink%20-%20Fred%20E.%20Weatherly.mp3",
    artworkUrl:
      "https://archive.org/services/img/78_danny-boy_ernestine-schumann-heink-fred-e-weatherly_gbia0523653a",
    license: {
      type: "Public Domain",
      detail:
        "U.S. sound recording published 1917; in the public domain (published before 1929).",
      source:
        "https://archive.org/details/78_danny-boy_ernestine-schumann-heink-fred-e-weatherly_gbia0523653a",
    },
    coverGradient: ["#3E5C99", "#1B2A4A"],
    matchReason: "A timeless ballad to start your discovery",
    bpm: 68,
    instruments: ["vocals", "orchestra", "strings"],
  },
  {
    id: "2",
    title: "Swing Low, Sweet Chariot",
    artist: "Fisk Jubilee Quartet",
    genre: "Gospel",
    tags: ["spiritual", "harmony", "uplifting"],
    story:
      "A 1909 recording by the Fisk University Jubilee Quartet, whose touring singers carried the African American spiritual tradition to the world. This song of deliverance became one of the most enduring spirituals ever recorded.",
    lyrics:
      "Swing low, sweet chariot\nComing for to carry me home\nSwing low, sweet chariot\nComing for to carry me home\n\nI looked over Jordan, and what did I see\nComing for to carry me home\nA band of angels coming after me\nComing for to carry me home\n\nSwing low, sweet chariot\nComing for to carry me home\nSwing low, sweet chariot\nComing for to carry me home",
    lrc: "[00:08.00] Swing low, sweet chariot\n[00:14.00] Coming for to carry me home\n[00:20.00] Swing low, sweet chariot\n[00:26.00] Coming for to carry me home\n[00:34.00] I looked over Jordan, and what did I see\n[00:40.00] Coming for to carry me home\n[00:46.00] A band of angels coming after me\n[00:52.00] Coming for to carry me home\n[01:00.00] Swing low, sweet chariot\n[01:06.00] Coming for to carry me home\n[01:12.00] Swing low, sweet chariot\n[01:18.00] Coming for to carry me home",
    credits: {
      composer: "Traditional (Wallis Willis)",
      vocalist: "Fisk Jubilee Quartet",
    },
    releaseDate: "2026-06-22",
    daysUntilRelease: 7,
    durationSeconds: 172,
    audioUrl:
      "https://archive.org/download/fisk-university-jubilee-quartet-swing-low-sweet-chariot-victor-16453-a/Fisk%20University%20Jubilee%20Quartet%20-%20Swing%20Low%2C%20Sweet%20Chariot%20-%20Victor%2016453-A.mp3",
    artworkUrl:
      "https://archive.org/services/img/fisk-university-jubilee-quartet-swing-low-sweet-chariot-victor-16453-a",
    license: {
      type: "Public Domain",
      detail:
        "U.S. sound recording published 1909; in the public domain (published before 1929).",
      source:
        "https://archive.org/details/fisk-university-jubilee-quartet-swing-low-sweet-chariot-victor-16453-a",
    },
    coverGradient: ["#2A4070", "#0F1A33"],
    matchReason: "Close-harmony gospel from 1909",
    bpm: 72,
    instruments: ["vocals", "quartet harmony"],
  },
  {
    id: "3",
    title: "After You've Gone",
    artist: "Marion Harris",
    genre: "Jazz",
    tags: ["bluesy", "heartbreak", "vintage"],
    story:
      "Marion Harris, one of the first widely popular white singers of blues and jazz, recorded this 1918 standard about the regret that comes after a lover walks away. It has since been sung by everyone from Bessie Smith to Judy Garland.",
    lyrics:
      "After you've gone, and left me crying\nAfter you've gone, there's no denying\nYou'll feel blue, you'll feel sad\nYou'll miss the dearest pal you've ever had\n\nThere'll come a time, now don't forget it\nThere'll come a time, when you'll regret it\nSome day, when you grow lonely\nYour heart will break like mine and you'll want me only\nAfter you've gone, after you've gone away",
    lrc: "[00:14.00] After you've gone, and left me crying\n[00:21.00] After you've gone, there's no denying\n[00:28.00] You'll feel blue, you'll feel sad\n[00:35.00] You'll miss the dearest pal you've ever had\n[00:44.00] There'll come a time, now don't forget it\n[00:51.00] There'll come a time, when you'll regret it\n[00:58.00] Some day, when you grow lonely\n[01:05.00] Your heart will break like mine and you'll want me only\n[01:14.00] After you've gone, after you've gone away",
    credits: {
      lyricist: "Henry Creamer",
      composer: "Turner Layton",
      vocalist: "Marion Harris",
    },
    releaseDate: "2026-06-28",
    daysUntilRelease: 13,
    durationSeconds: 202,
    audioUrl:
      "https://archive.org/download/after-youve-gone-library-of-congress/After%20you've%20gone%20Library%20of%20Congress.mp3",
    artworkUrl:
      "https://archive.org/services/img/after-youve-gone-library-of-congress",
    license: {
      type: "Public Domain",
      detail:
        "U.S. sound recording published 1918; in the public domain (published before 1929).",
      source: "https://archive.org/details/after-youve-gone-library-of-congress",
    },
    coverGradient: ["#6B5B95", "#2D2150"],
    matchReason: "Early jazz-blues heartbreak",
    bpm: 96,
    instruments: ["vocals", "piano", "horns"],
  },
  {
    id: "4",
    title: "Some of These Days",
    artist: "Sophie Tucker",
    genre: "Jazz",
    tags: ["sassy", "vaudeville", "classic"],
    story:
      "Sophie Tucker, 'the last of the red-hot mamas', made this 1911 number her lifelong signature song. A defiant warning to a lover who's about to leave, it became one of the defining performances of the vaudeville era.",
    lyrics:
      "Some of these days, you'll miss me honey\nSome of these days, you'll feel so lonely\nYou'll miss my hugging, you'll miss my kissing\nYou'll miss me honey when you're away\n\nI feel so lonely, just for you only\nFor you know honey, you've had your way\nAnd when you leave me, you know it'll grieve me\nYou'll miss your little baby, yes some of these days",
    lrc: "[00:16.00] Some of these days, you'll miss me honey\n[00:23.00] Some of these days, you'll feel so lonely\n[00:30.00] You'll miss my hugging, you'll miss my kissing\n[00:37.00] You'll miss me honey when you're away\n[00:46.00] I feel so lonely, just for you only\n[00:53.00] For you know honey, you've had your way\n[01:00.00] And when you leave me, you know it'll grieve me\n[01:07.00] You'll miss your little baby, yes some of these days",
    credits: {
      lyricist: "Shelton Brooks",
      composer: "Shelton Brooks",
      vocalist: "Sophie Tucker",
    },
    releaseDate: "2026-06-24",
    daysUntilRelease: 9,
    durationSeconds: 216,
    audioUrl: "https://archive.org/download/EDIS-SRP-0164-02/EDIS-SRP-0164-02.mp3",
    artworkUrl: "https://archive.org/services/img/EDIS-SRP-0164-02",
    license: {
      type: "Public Domain",
      detail:
        "U.S. sound recording published 1911; in the public domain (published before 1929).",
      source: "https://archive.org/details/EDIS-SRP-0164-02",
    },
    coverGradient: ["#E8956B", "#A85A3C"],
    matchReason: "Red-hot vaudeville jazz",
    bpm: 104,
    instruments: ["vocals", "piano", "brass band"],
  },
  {
    id: "5",
    title: "St. Louis Blues",
    artist: "Bessie Smith",
    genre: "Blues",
    tags: ["soulful", "blues", "legendary"],
    story:
      "Bessie Smith, the 'Empress of the Blues', recorded W.C. Handy's 'St. Louis Blues' in 1925 with Louis Armstrong on cornet. The pairing of two giants produced one of the most important recordings in the history of the blues.",
    lyrics:
      "I hate to see that evening sun go down\nI hate to see that evening sun go down\n'Cause my baby, he done left this town\n\nFeeling tomorrow like I feel today\nFeeling tomorrow like I feel today\nI'll pack my trunk, make my getaway\n\nSaint Louis woman, with her diamond rings\nPulls that man around by her apron strings\n'Twasn't for powder and for store-bought hair\nThe man I love would not have gone nowhere",
    lrc: "[00:12.00] I hate to see that evening sun go down\n[00:20.00] I hate to see that evening sun go down\n[00:28.00] 'Cause my baby, he done left this town\n[00:38.00] Feeling tomorrow like I feel today\n[00:46.00] Feeling tomorrow like I feel today\n[00:54.00] I'll pack my trunk, make my getaway\n[01:04.00] Saint Louis woman, with her diamond rings\n[01:12.00] Pulls that man around by her apron strings\n[01:20.00] 'Twasn't for powder and for store-bought hair\n[01:28.00] The man I love would not have gone nowhere",
    credits: {
      lyricist: "W.C. Handy",
      composer: "W.C. Handy",
      vocalist: "Bessie Smith",
    },
    releaseDate: "2026-06-23",
    daysUntilRelease: 8,
    durationSeconds: 186,
    audioUrl:
      "https://archive.org/download/the-st-louis-blues/The%20St%20Louis%20Blues.mp3",
    artworkUrl: "https://archive.org/services/img/the-st-louis-blues",
    license: {
      type: "Public Domain",
      detail:
        "U.S. sound recording published 1925; in the public domain (published before 1929).",
      source: "https://archive.org/details/the-st-louis-blues",
    },
    coverGradient: ["#3E7C8C", "#1B3A4A"],
    matchReason: "Empress of the Blues, 1925",
    bpm: 84,
    instruments: ["vocals", "cornet", "piano"],
  },
];
