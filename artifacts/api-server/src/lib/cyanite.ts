import dns from "node:dns/promises";
import net from "node:net";
import type { CyaniteAnalysis } from "@workspace/db";
import { logger } from "./logger";

const ENDPOINT = "https://api.cyanite.ai/graphql";
const REQUEST_TIMEOUT_MS = 30_000;
const AUDIO_TIMEOUT_MS = 60_000;

export type CyaniteStatus =
  | "unconfigured"
  | "processing"
  | "finished"
  | "failed"
  | "not_found"
  | "error";

const GENRE_KEYS = [
  "ambient",
  "blues",
  "classical",
  "electronicDance",
  "folkCountry",
  "funkSoul",
  "jazz",
  "latin",
  "metal",
  "pop",
  "rapHipHop",
  "reggae",
  "rnb",
  "rock",
  "singerSongwriter",
] as const;

const MOOD_KEYS = [
  "aggressive",
  "calm",
  "chilled",
  "dark",
  "energetic",
  "epic",
  "happy",
  "romantic",
  "sad",
  "scary",
  "sexy",
  "ethereal",
  "uplifting",
] as const;

function apiKey(): string | null {
  const key = process.env.CYANITE_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : null;
}

export function isConfigured(): boolean {
  return apiKey() !== null;
}

async function gql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const key = apiKey();
  if (!key) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Cyanite GraphQL request failed");
      return null;
    }
    const json = (await res.json().catch(() => null)) as {
      data?: T;
      errors?: unknown;
    } | null;
    if (!json || json.errors) {
      logger.warn({ errors: json?.errors }, "Cyanite GraphQL returned errors");
      return json?.data ?? null;
    }
    return json.data ?? null;
  } catch (err) {
    logger.error({ err }, "Cyanite GraphQL request errored");
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function distribution(
  raw: unknown,
  keys: readonly string[]
): Record<string, number> {
  const obj = (raw as Record<string, unknown>) ?? {};
  const out: Record<string, number> = {};
  for (const k of keys) {
    const v = num(obj[k]);
    if (v !== null) out[k] = v;
  }
  return out;
}

function tags(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((t): t is string => typeof t === "string") : [];
}

function normalize(result: Record<string, unknown>): CyaniteAnalysis {
  const bpmAdjusted = num(result.bpmRangeAdjusted);
  const bpmPred = num(
    (result.bpmPrediction as Record<string, unknown> | undefined)?.value
  );
  const bpmRaw = bpmAdjusted ?? bpmPred;
  // Cyanite returns 0 when it can't infer a tempo (e.g. very noisy/old audio).
  const bpm = bpmRaw !== null && bpmRaw > 0 ? Math.round(bpmRaw) : null;
  const keyPred = (result.keyPrediction as Record<string, unknown> | undefined)
    ?.value;

  return {
    genreTags: tags(result.genreTags),
    moodTags: tags(result.moodTags),
    bpm,
    musicalKey: typeof keyPred === "string" ? keyPred : null,
    energyLevel:
      typeof result.energyLevel === "string" ? result.energyLevel : null,
    energyDynamics:
      typeof result.energyDynamics === "string" ? result.energyDynamics : null,
    valence: num(result.valence),
    arousal: num(result.arousal),
    caption:
      typeof result.transformerCaption === "string"
        ? result.transformerCaption
        : null,
    era: typeof result.musicalEraTag === "string" ? result.musicalEraTag : null,
    genre: distribution(result.genre, GENRE_KEYS),
    mood: distribution(result.mood, MOOD_KEYS),
    analyzedAt: new Date().toISOString(),
  };
}

function isPrivateIp(raw: string): boolean {
  let ip = raw;
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  if (net.isIPv4(ip)) {
    const p = ip.split(".").map(Number);
    if (p[0] === 10 || p[0] === 127 || p[0] === 0) return true;
    if (p[0] === 169 && p[1] === 254) return true; // link-local / cloud metadata
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
    if (p[0] === 192 && p[1] === 168) return true;
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true; // CGNAT
    if (p[0] >= 224) return true; // multicast / reserved
    return false;
  }
  if (net.isIPv6(ip)) {
    const low = ip.toLowerCase();
    return (
      low === "::1" ||
      low === "::" ||
      low.startsWith("fc") ||
      low.startsWith("fd") ||
      low.startsWith("fe80")
    );
  }
  return true; // not a literal IP we can vet → treat as unsafe
}

async function assertPublicHost(hostname: string): Promise<void> {
  const records = await dns.lookup(hostname, { all: true });
  if (records.length === 0) throw new Error("DNS resolution failed");
  for (const r of records) {
    if (isPrivateIp(r.address)) {
      throw new Error(`blocked non-public address for ${hostname}`);
    }
  }
}

/**
 * Fetches user-supplied audio with SSRF protection: only http(s), and every
 * hop (including redirects, which archive.org uses) must resolve to a public
 * IP — blocking loopback, link-local (cloud metadata), and private ranges.
 */
async function fetchAudioSafely(
  rawUrl: string,
  signal: AbortSignal
): Promise<Response> {
  let current = rawUrl;
  for (let hop = 0; hop < 5; hop++) {
    const u = new URL(current);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new Error(`unsupported protocol: ${u.protocol}`);
    }
    await assertPublicHost(u.hostname);
    const res = await fetch(current, { signal, redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error("redirect without location");
      current = new URL(loc, current).toString();
      continue;
    }
    return res;
  }
  throw new Error("too many redirects");
}

/**
 * Uploads a hosted audio file to Cyanite and creates a library track, which
 * auto-enqueues analysis. Returns the Cyanite library-track id to persist so we
 * can later read results (via the webhook sweep or a direct fetch).
 */
export async function requestAnalysis(
  audioUrl: string,
  opts: { title: string; externalId: string }
): Promise<{ status: CyaniteStatus; libraryTrackId: string | null }> {
  if (!isConfigured()) return { status: "unconfigured", libraryTrackId: null };
  if (!audioUrl || audioUrl.trim().length === 0) {
    return { status: "error", libraryTrackId: null };
  }

  // 1. Request an upload slot (S3 presigned PUT, signed for audio/mpeg).
  const upload = await gql<{
    fileUploadRequest: { id: string; uploadUrl: string };
  }>(`mutation { fileUploadRequest { id uploadUrl } }`);
  const slot = upload?.fileUploadRequest;
  if (!slot?.id || !slot?.uploadUrl) {
    return { status: "error", libraryTrackId: null };
  }

  // 2. Stream the audio bytes to the upload slot.
  const audioController = new AbortController();
  const audioTimeout = setTimeout(
    () => audioController.abort(),
    AUDIO_TIMEOUT_MS
  );
  try {
    const audioRes = await fetchAudioSafely(audioUrl, audioController.signal);
    if (!audioRes.ok) {
      logger.warn(
        { status: audioRes.status, audioUrl },
        "Cyanite: failed to fetch source audio"
      );
      return { status: "error", libraryTrackId: null };
    }
    const bytes = Buffer.from(await audioRes.arrayBuffer());
    const put = await fetch(slot.uploadUrl, {
      method: "PUT",
      signal: audioController.signal,
      headers: { "Content-Type": "audio/mpeg" },
      body: bytes,
    });
    if (!put.ok) {
      logger.warn({ status: put.status }, "Cyanite: audio upload PUT failed");
      return { status: "error", libraryTrackId: null };
    }
  } catch (err) {
    logger.error({ err }, "Cyanite: audio upload errored");
    return { status: "error", libraryTrackId: null };
  } finally {
    clearTimeout(audioTimeout);
  }

  // 3. Create the library track (auto-enqueues analysis).
  const created = await gql<{
    libraryTrackCreate:
      | {
          __typename: "LibraryTrackCreateSuccess";
          createdLibraryTrack: { id: string };
        }
      | { __typename: "LibraryTrackCreateError"; code: string; message: string };
  }>(
    `mutation ($input: LibraryTrackCreateInput!) {
      libraryTrackCreate(input: $input) {
        __typename
        ... on LibraryTrackCreateSuccess { createdLibraryTrack { id } }
        ... on LibraryTrackCreateError { code message }
      }
    }`,
    { input: { uploadId: slot.id, title: opts.title, externalId: opts.externalId } }
  );

  const out = created?.libraryTrackCreate;
  if (out?.__typename === "LibraryTrackCreateSuccess") {
    return { status: "processing", libraryTrackId: out.createdLibraryTrack.id };
  }
  if (out?.__typename === "LibraryTrackCreateError") {
    logger.warn(
      { code: out.code, message: out.message },
      "Cyanite: libraryTrackCreate error"
    );
  }
  return { status: "error", libraryTrackId: null };
}

/**
 * Reads the current analysis for a Cyanite library track. Only returns an
 * `analysis` payload once the analysis has reached the Finished state.
 */
export async function fetchAnalysis(
  libraryTrackId: string
): Promise<{ status: CyaniteStatus; analysis: CyaniteAnalysis | null }> {
  if (!isConfigured()) return { status: "unconfigured", analysis: null };

  const data = await gql<{
    libraryTrack: {
      __typename: string;
      audioAnalysisV6?: {
        __typename: string;
        result?: Record<string, unknown>;
      };
    } | null;
  }>(
    `query ($id: ID!) {
      libraryTrack(id: $id) {
        __typename
        ... on LibraryTrack {
          audioAnalysisV6 {
            __typename
            ... on AudioAnalysisV6Finished {
            result {
              genreTags
              moodTags
              bpmPrediction { value confidence }
              bpmRangeAdjusted
              keyPrediction { value confidence }
              valence
              arousal
              energyLevel
              energyDynamics
              transformerCaption
              musicalEraTag
              genre { ambient blues classical electronicDance folkCountry funkSoul jazz latin metal pop rapHipHop reggae rnb rock singerSongwriter }
              mood { aggressive calm chilled dark energetic epic happy romantic sad scary sexy ethereal uplifting }
            }
          }
          }
        }
      }
    }`,
    { id: libraryTrackId }
  );

  const track = data?.libraryTrack;
  if (!track) return { status: "not_found", analysis: null };

  const analysis = track.audioAnalysisV6;
  switch (analysis?.__typename) {
    case "AudioAnalysisV6Finished":
      return {
        status: "finished",
        analysis: analysis.result ? normalize(analysis.result) : null,
      };
    case "AudioAnalysisV6Failed":
    case "AudioAnalysisV6NotAuthorized":
      return { status: "failed", analysis: null };
    case "AudioAnalysisV6NotStarted":
    case "AudioAnalysisV6Enqueued":
    case "AudioAnalysisV6Processing":
      return { status: "processing", analysis: null };
    default:
      return { status: "error", analysis: null };
  }
}
