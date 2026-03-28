import { GENRE_LABELS } from "../utils/themeMapper.js";

const typeIcons = { movie: "🎬", show: "📺", book: "📚" };
const moodColors = {
  dark: "#c0392b",
  intense: "#e67e22",
  philosophical: "#8e44ad",
  unsettling: "#16a085",
  melancholic: "#2980b9",
  uplifting: "#27ae60",
  heartwarming: "#e91e8c",
  fun: "#f39c12",
  epic: "#d35400",
};

export default function VibeProfile({ matchedMedia, vibeProfile }) {
  if (!matchedMedia || matchedMedia.length === 0) return null;

  return (
    <section className="vibe-profile">
      <h2 className="section-title">
        <span className="section-icon">🎭</span> Your Vibe Profile
      </h2>
      <p className="section-subtitle">
        Here's what we detected from your choices — this drives your anime recommendations.
      </p>

      {/* Per-input theme breakdown */}
      <div className="media-cards-row">
        {matchedMedia.map((entry) => (
          <div key={entry.key} className="media-source-card">
            <div className="media-source-header">
              <span className="media-type-icon">{typeIcons[entry.type] ?? "🎭"}</span>
              <div>
                <div className="media-source-title">{entry.title}</div>
                <div className="media-source-year">{entry.year}</div>
              </div>
              {entry.mood && (
                <span
                  className="mood-badge"
                  style={{ background: moodColors[entry.mood] ?? "#555" }}
                >
                  {entry.mood}
                </span>
              )}
            </div>
            <div className="media-themes">
              {entry.themes.map((theme) => (
                <span key={theme} className="theme-tag">
                  {theme}
                </span>
              ))}
            </div>
            <div className="media-genres">
              {entry.genreIds.map((id) => (
                <span key={id} className="genre-tag">
                  {GENRE_LABELS[id] ?? `Genre ${id}`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Combined vibe summary */}
      <div className="combined-vibe">
        <h3 className="combined-vibe-title">Combined Signal</h3>
        <div className="genre-weights">
          {vibeProfile.genreBreakdown.map((g) => (
            <div key={g.id} className="genre-weight-row">
              <span className="genre-weight-label">{g.label}</span>
              <div className="genre-weight-bar-wrap">
                <div
                  className="genre-weight-bar"
                  style={{
                    width: `${(g.count / (matchedMedia.length || 1)) * 100}%`,
                  }}
                />
              </div>
              <span className="genre-weight-count">
                {g.count}/{matchedMedia.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
