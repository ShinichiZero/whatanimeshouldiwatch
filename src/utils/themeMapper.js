import Fuse from "fuse.js";
import mediaDatabase from "../data/mediaDatabase.js";

// Label maps for display
export const GENRE_LABELS = {
  1: "Action",
  2: "Adventure",
  4: "Comedy",
  5: "Avant Garde",
  7: "Mystery",
  8: "Drama",
  10: "Fantasy",
  12: "Horror",
  14: "Mecha",
  22: "Romance",
  24: "Sci-Fi",
  36: "Slice of Life",
  37: "Supernatural",
  40: "Psychological",
  41: "Suspense",
};

// Fuse.js instance for fuzzy-matching user input against the database
const fuse = new Fuse(mediaDatabase, {
  keys: ["title", "key"],
  threshold: 0.4,
  includeScore: true,
});

/**
 * Find the best matching media entry for a user-supplied title.
 * Returns the matched entry plus a match confidence score (0–1, lower = better in Fuse).
 */
export function findMedia(query) {
  if (!query || query.trim().length < 2) return null;
  const results = fuse.search(query.trim());
  if (results.length === 0) return null;
  return { ...results[0].item, fuseScore: results[0].score };
}

/**
 * Given an array of matched media entries, build a unified "vibe profile":
 *   - Combined list of unique themes
 *   - Genre IDs weighted by how many inputs share them
 *   - Top 3 genres to use for the Jikan query
 */
export function buildVibeProfile(matchedEntries) {
  const genreCount = {};
  const allThemes = new Set();

  for (const entry of matchedEntries) {
    for (const id of entry.genreIds) {
      genreCount[id] = (genreCount[id] || 0) + 1;
    }
    for (const theme of entry.themes) {
      allThemes.add(theme);
    }
  }

  // Sort genres by frequency, then pick top 3
  const sortedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id: Number(id), count, label: GENRE_LABELS[id] ?? `Genre ${id}` }));

  const topGenreIds = sortedGenres.slice(0, 3).map((g) => g.id);

  return {
    themes: [...allThemes],
    genreBreakdown: sortedGenres,
    topGenreIds,
  };
}

/**
 * Explain which themes from the vibe profile a given anime (returned by Jikan) shares.
 * `animeGenres` is the array of genre objects returned by the Jikan API.
 */
export function explainMatch(anime, vibeProfile) {
  const animeGenreIds = new Set((anime.genres || []).map((g) => g.mal_id));
  const matchingGenres = vibeProfile.genreBreakdown
    .filter((g) => animeGenreIds.has(g.id))
    .map((g) => g.label);

  // Overlap between anime themes and vibe themes (simple keyword check in synopsis)
  const synopsis = (anime.synopsis || "").toLowerCase();
  const matchingThemes = vibeProfile.themes.filter((theme) =>
    theme
      .toLowerCase()
      .split(" ")
      .some((word) => word.length > 3 && synopsis.includes(word))
  );

  return { matchingGenres, matchingThemes };
}
