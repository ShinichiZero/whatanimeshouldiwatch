const BASE_URL = "https://api.jikan.moe/v4";

/**
 * Small helper to respect Jikan's rate limit (3 req/s).
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch anime recommendations from Jikan based on an array of MAL genre IDs.
 * Returns up to `limit` anime sorted by score, filtered to SFW content.
 */
export async function fetchAnimeByGenres(genreIds, limit = 12) {
  if (!genreIds || genreIds.length === 0) return [];

  const params = new URLSearchParams({
    genres: genreIds.join(","),
    order_by: "score",
    sort: "desc",
    min_score: "7",
    sfw: "true",
    limit: String(limit),
  });

  const url = `${BASE_URL}/anime?${params.toString()}`;

  const response = await fetch(url);

  if (response.status === 429) {
    // Rate limited – wait and retry once
    await delay(1200);
    const retry = await fetch(url);
    if (!retry.ok) throw new Error(`Jikan API error: ${retry.status}`);
    const data = await retry.json();
    return data.data ?? [];
  }

  if (!response.ok) {
    throw new Error(`Jikan API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data ?? [];
}

/**
 * Fetch a single anime by its MAL ID (used for deep-links and display details).
 */
export async function fetchAnimeById(malId) {
  const response = await fetch(`${BASE_URL}/anime/${malId}`);
  if (!response.ok) throw new Error(`Jikan API error: ${response.status}`);
  const data = await response.json();
  return data.data;
}
