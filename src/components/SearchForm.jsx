import { useState } from "react";
import mediaDatabase from "../data/mediaDatabase.js";
import Fuse from "fuse.js";

const fuse = new Fuse(mediaDatabase, {
  keys: ["title"],
  threshold: 0.4,
  includeScore: true,
});

function InputField({ index, value, onChange, match }) {
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);

  function handleChange(e) {
    const val = e.target.value;
    onChange(val);
    if (val.trim().length >= 2) {
      const results = fuse.search(val.trim()).slice(0, 5);
      setSuggestions(results.map((r) => r.item));
    } else {
      setSuggestions([]);
    }
  }

  function handleSelect(title) {
    onChange(title);
    setSuggestions([]);
  }

  const typeIcons = { movie: "🎬", show: "📺", book: "📚" };

  return (
    <div className="input-wrapper">
      <label className="input-label">
        <span className="input-number">{index + 1}</span>
        Movie, TV show, or book
      </label>
      <div className="autocomplete-container">
        <input
          className={`media-input ${match ? "input-matched" : ""}`}
          type="text"
          value={value}
          placeholder={`e.g. ${["Inception", "Breaking Bad", "Dune"][index]}`}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          autoComplete="off"
        />
        {match && (
          <span className="input-match-badge" title={`Matched: ${match.title}`}>
            ✓ {match.title}
          </span>
        )}
        {focused && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item) => (
              <li
                key={item.key}
                className="suggestion-item"
                onMouseDown={() => handleSelect(item.title)}
              >
                <span className="suggestion-icon">{typeIcons[item.type] ?? "🎭"}</span>
                <span className="suggestion-title">{item.title}</span>
                <span className="suggestion-year">{item.year}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function SearchForm({ onSearch, loading }) {
  const [inputs, setInputs] = useState(["", "", ""]);
  const [matches, setMatches] = useState([null, null, null]);

  function updateInput(index, value) {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    // Try to find a match
    const results = fuse.search(value.trim());
    const newMatches = [...matches];
    newMatches[index] = results.length > 0 && value.trim().length >= 2 ? results[0].item : null;
    setMatches(newMatches);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validMatches = matches.filter(Boolean);
    if (validMatches.length === 0) return;
    onSearch(validMatches, inputs);
  }

  const validCount = matches.filter(Boolean).length;
  const canSearch = validCount >= 1;

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-intro">
        <h2 className="form-title">Your Sentiment Mapper</h2>
        <p className="form-description">
          Enter up to three movies, TV shows, or books you love. Our Sentiment Mapper will
          extract the themes and vibes, then find anime that match your taste.
        </p>
      </div>

      <div className="inputs-grid">
        {inputs.map((val, i) => (
          <InputField
            key={i}
            index={i}
            value={val}
            onChange={(v) => updateInput(i, v)}
            match={matches[i]}
          />
        ))}
      </div>

      {validCount > 0 && (
        <p className="match-hint">
          {validCount} of 3 matched — {3 - validCount > 0 ? `add ${3 - validCount} more for better results, or` : ""} ready to search!
        </p>
      )}

      <button
        type="submit"
        className="search-btn"
        disabled={!canSearch || loading}
      >
        {loading ? (
          <>
            <span className="btn-spinner" /> Finding your anime...
          </>
        ) : (
          <>✨ Find My Anime</>
        )}
      </button>
    </form>
  );
}
