import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeLyrics, detectLanguage } from "./musixmatch";

/**
 * Unit tests for the lyric analysis helper itself. analyzeLyrics() reuses the
 * Musixmatch track endpoints, so we mock global fetch (and provide an API key)
 * to drive the real searchTracks/getAnalysis/getSubtitle parsing code without
 * any network. These lock in that mood/themes come from the matched track's
 * analysis; that language prefers the subtitle language and otherwise falls
 * back to script-based detection; and that an empty search result yields empty
 * mood/themes with only the fallback language.
 *
 * detectLanguage() is tested directly for a handful of scripts plus the
 * empty-string -> null case.
 */

type MxmBody = Record<string, unknown>;

function mxmResponse(body: MxmBody, statusCode = 200) {
  return {
    status: 200,
    json: async () => ({
      message: { header: { status_code: statusCode }, body },
    }),
  } as unknown as Response;
}

interface RouteBodies {
  search?: MxmBody;
  analysis?: MxmBody;
  subtitle?: MxmBody;
}

function trackSearchBody(trackId: number) {
  return {
    track_list: [{ track: { track_id: trackId, track_name: "Matched" } }],
  };
}

function analysisBody(moods: string[], themes: string[]) {
  return {
    analysis: {
      moods: { mood_list: moods.map((m) => ({ mood: m })) },
      themes: { main_themes: themes.map((t) => ({ theme: t })) },
    },
  };
}

function subtitleBody(language: string | null) {
  return {
    subtitle: {
      subtitle_body: "[00:01.00]line",
      subtitle_language: language,
    },
  };
}

/**
 * Installs a fetch mock that routes by Musixmatch method name. Any route left
 * undefined returns an empty body (mirrors a not-found / empty response).
 */
function mockFetch(routes: RouteBodies) {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("track.search")) {
      return mxmResponse(routes.search ?? { track_list: [] });
    }
    if (url.includes("track.lyrics.analysis.get")) {
      return mxmResponse(routes.analysis ?? {});
    }
    if (url.includes("track.subtitle.get")) {
      return mxmResponse(routes.subtitle ?? {});
    }
    return mxmResponse({});
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv("MUSIXMATCH_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("analyzeLyrics", () => {
  it("returns mood/themes from the matched track's analysis", async () => {
    mockFetch({
      search: trackSearchBody(42),
      analysis: analysisBody(["melancholic", "hopeful"], ["loss", "homecoming"]),
      subtitle: subtitleBody("en"),
    });

    const result = await analyzeLyrics("Danny Boy", "Oh Danny boy");

    expect(result.mood).toEqual(["melancholic", "hopeful"]);
    expect(result.themes).toEqual(["loss", "homecoming"]);
    expect(result.language).toBe("en");
  });

  it("prefers the subtitle language over script detection", async () => {
    mockFetch({
      search: trackSearchBody(7),
      analysis: analysisBody(["calm"], ["nature"]),
      // Lyrics are plainly English, but the subtitle reports Spanish.
      subtitle: subtitleBody("es"),
    });

    const result = await analyzeLyrics("Some Song", "These lyrics are English");

    expect(result.language).toBe("es");
  });

  it("falls back to script detection when the subtitle has no language", async () => {
    mockFetch({
      search: trackSearchBody(9),
      analysis: analysisBody(["bright"], ["joy"]),
      subtitle: subtitleBody(null),
    });

    const result = await analyzeLyrics("Some Song", "Plain english words here");

    expect(result.mood).toEqual(["bright"]);
    expect(result.themes).toEqual(["joy"]);
    expect(result.language).toBe("en");
  });

  it("returns empty mood/themes with only the fallback language when search finds nothing", async () => {
    mockFetch({ search: { track_list: [] } });

    const result = await analyzeLyrics("Unknown", "Es un día de sol");

    expect(result.mood).toEqual([]);
    expect(result.themes).toEqual([]);
    expect(result.language).toBe("es");
    // No analysis/subtitle calls should be made without a matched track.
  });

  it("returns a null fallback language when the lyrics have no detectable script", async () => {
    mockFetch({ search: { track_list: [] } });

    const result = await analyzeLyrics("Instrumental", "12345 !!! ---");

    expect(result.mood).toEqual([]);
    expect(result.themes).toEqual([]);
    expect(result.language).toBeNull();
  });
});

describe("detectLanguage", () => {
  it("returns null for an empty or whitespace-only string", () => {
    expect(detectLanguage("")).toBeNull();
    expect(detectLanguage("   \n  ")).toBeNull();
  });

  it("detects plain Latin text as English", () => {
    expect(detectLanguage("hello there my old friend")).toBe("en");
  });

  it("detects Spanish via accented characters", () => {
    expect(detectLanguage("corazón y canción")).toBe("es");
  });

  it("detects French via accented characters", () => {
    expect(detectLanguage("où est la fenêtre")).toBe("fr");
  });

  it("detects German via umlauts/eszett", () => {
    // Use ä/ß which are German-only; ü/ö also appear in the French set, so
    // they would match French first given the detector's ordering.
    expect(detectLanguage("weiß mädchen")).toBe("de");
  });

  it("detects Japanese kana", () => {
    expect(detectLanguage("こんにちは")).toBe("ja");
  });

  it("detects Korean hangul", () => {
    expect(detectLanguage("안녕하세요")).toBe("ko");
  });

  it("detects Chinese han characters", () => {
    expect(detectLanguage("你好世界")).toBe("zh");
  });

  it("detects Russian cyrillic", () => {
    expect(detectLanguage("привет мир")).toBe("ru");
  });

  it("detects Arabic script", () => {
    expect(detectLanguage("مرحبا بالعالم")).toBe("ar");
  });

  it("returns null when there is no recognizable script", () => {
    expect(detectLanguage("12345 !!! ---")).toBeNull();
  });
});
