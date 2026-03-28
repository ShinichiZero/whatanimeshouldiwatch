import { useState } from "react";
import Header from "./components/Header.jsx";
import SearchForm from "./components/SearchForm.jsx";
import VibeProfile from "./components/VibeProfile.jsx";
import AnimeCard from "./components/AnimeCard.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { buildVibeProfile } from "./utils/themeMapper.js";
import { fetchAnimeByGenres } from "./services/jikanApi.js";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchedMedia, setMatchedMedia] = useState(null);
  const [vibeProfile, setVibeProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  async function handleSearch(validMatches) {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const profile = buildVibeProfile(validMatches);
      setMatchedMedia(validMatches);
      setVibeProfile(profile);

      const anime = await fetchAnimeByGenres(profile.topGenreIds, 12);
      setRecommendations(anime);
    } catch (err) {
      setError(
        err.message.includes("429")
          ? "The anime database is rate-limited right now. Please wait a moment and try again."
          : `Something went wrong: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setMatchedMedia(null);
    setVibeProfile(null);
    setRecommendations(null);
    setError(null);
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {!recommendations && !loading && (
          <SearchForm onSearch={handleSearch} loading={loading} />
        )}

        {loading && (
          <LoadingSpinner message="Analyzing your vibes and fetching anime…" />
        )}

        {error && (
          <div className="error-box">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button className="retry-btn" onClick={handleReset}>
              Try again
            </button>
          </div>
        )}

        {recommendations && vibeProfile && matchedMedia && (
          <>
            <VibeProfile matchedMedia={matchedMedia} vibeProfile={vibeProfile} />

            <section className="recommendations-section">
              <div className="recommendations-header">
                <h2 className="section-title">
                  <span className="section-icon">🌸</span> Your Anime Recommendations
                </h2>
                <button className="reset-btn" onClick={handleReset}>
                  ← Search Again
                </button>
              </div>

              {recommendations.length === 0 ? (
                <div className="no-results">
                  <p>
                    No anime found for those exact genres. Try different inputs with
                    broader themes!
                  </p>
                  <button className="retry-btn" onClick={handleReset}>
                    Try again
                  </button>
                </div>
              ) : (
                <div className="anime-grid">
                  {recommendations.map((anime) => (
                    <AnimeCard
                      key={anime.mal_id}
                      anime={anime}
                      vibeProfile={vibeProfile}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Powered by{" "}
          <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer">
            Jikan API
          </a>{" "}
          (MyAnimeList data) · Built with ❤️ for anime fans
        </p>
      </footer>
    </div>
  );
}
