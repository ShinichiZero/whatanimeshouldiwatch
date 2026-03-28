import { explainMatch } from "../utils/themeMapper.js";

export default function AnimeCard({ anime, vibeProfile }) {
  const { matchingGenres, matchingThemes } = explainMatch(anime, vibeProfile);
  const malUrl = `https://myanimelist.net/anime/${anime.mal_id}`;
  const score = anime.score ? anime.score.toFixed(1) : "N/A";
  const episodes = anime.episodes ? `${anime.episodes} eps` : anime.status === "Currently Airing" ? "Airing" : "Movie";
  const imageUrl = anime.images?.jpg?.image_url;

  return (
    <article className="anime-card">
      <a href={malUrl} target="_blank" rel="noopener noreferrer" className="anime-card-link">
        <div className="anime-image-wrap">
          {imageUrl ? (
            <img
              className="anime-image"
              src={imageUrl}
              alt={anime.title}
              loading="lazy"
            />
          ) : (
            <div className="anime-image-placeholder">🎌</div>
          )}
          <div className="anime-score-badge">
            <span className="star-icon">★</span> {score}
          </div>
        </div>
      </a>

      <div className="anime-info">
        <a href={malUrl} target="_blank" rel="noopener noreferrer" className="anime-title-link">
          <h3 className="anime-title">{anime.title}</h3>
        </a>
        {anime.title_english && anime.title_english !== anime.title && (
          <p className="anime-title-en">{anime.title_english}</p>
        )}

        <div className="anime-meta">
          <span className="meta-pill">{episodes}</span>
          {anime.year && <span className="meta-pill">{anime.year}</span>}
          {anime.rating && (
            <span className="meta-pill">{anime.rating.replace(" - ", " ")}</span>
          )}
        </div>

        {anime.synopsis && (
          <p className="anime-synopsis">
            {anime.synopsis.length > 180
              ? anime.synopsis.slice(0, 180).trimEnd() + "…"
              : anime.synopsis}
          </p>
        )}

        {/* Why it matches */}
        {(matchingGenres.length > 0 || matchingThemes.length > 0) && (
          <div className="match-reasons">
            <span className="match-label">Why it matches:</span>
            <div className="match-tags">
              {matchingGenres.map((g) => (
                <span key={g} className="match-tag match-tag-genre">
                  {g}
                </span>
              ))}
              {matchingThemes.map((t) => (
                <span key={t} className="match-tag match-tag-theme">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <a
          href={malUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mal-link"
        >
          View on MyAnimeList →
        </a>
      </div>
    </article>
  );
}
