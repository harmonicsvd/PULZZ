import { Router, type IRouter } from "express";
import {
  GetMusixmatchAnalysisQueryParams,
  GetMusixmatchAnalysisResponse,
  GetMusixmatchSubtitleQueryParams,
  GetMusixmatchSubtitleResponse,
  ListMusixmatchGenresResponse,
  SearchMusixmatchTracksQueryParams,
  SearchMusixmatchTracksResponse,
} from "@workspace/api-zod";
import {
  getAnalysis,
  getGenres,
  getSubtitle,
  searchTracks,
} from "../lib/musixmatch";

const router: IRouter = Router();

router.get("/musixmatch/genres", async (_req, res): Promise<void> => {
  const genres = await getGenres();
  res.json(ListMusixmatchGenresResponse.parse(genres));
});

router.get("/musixmatch/search-tracks", async (req, res): Promise<void> => {
  const query = SearchMusixmatchTracksQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const tracks = await searchTracks(query.data.q, query.data.pageSize ?? 10);
  res.json(SearchMusixmatchTracksResponse.parse(tracks));
});

router.get("/musixmatch/subtitle", async (req, res): Promise<void> => {
  const query = GetMusixmatchSubtitleQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const subtitle = await getSubtitle(query.data.trackId);
  res.json(GetMusixmatchSubtitleResponse.parse(subtitle));
});

router.get("/musixmatch/track-analysis", async (req, res): Promise<void> => {
  const query = GetMusixmatchAnalysisQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const analysis = await getAnalysis(query.data.trackId);
  res.json(GetMusixmatchAnalysisResponse.parse(analysis));
});

export default router;
