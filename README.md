# What Anime Should I Watch? 🌸

A smart anime recommendation engine powered by a **Sentiment Mapper** — enter up to three movies, TV shows, or books you love, and it will map their themes and vibes to anime recommendations.

## Features

- **Sentiment Mapper**: Input up to 3 movies, TV shows, or books → the app extracts genres and themes → finds matching anime
- **Fuzzy Search**: Type any title and autocomplete suggestions appear, powered by [Fuse.js](https://fusejs.io/)
- **Vibe Profile**: See exactly which themes and genres were detected from your inputs
- **Match Explanations**: Each anime card shows *why* it was recommended (matching genres/themes)
- **Jikan API**: Fetches real anime data (images, scores, synopsis) from [MyAnimeList via Jikan](https://jikan.moe)

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/) for the UI
- [Fuse.js](https://fusejs.io/) for fuzzy-search autocomplete
- [Jikan API v4](https://docs.api.jikan.moe/) (free, no API key required)

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## How It Works

1. You enter 3 movies, TV shows, or books (e.g. *Inception*, *Breaking Bad*, *Dune*)
2. The **Sentiment Mapper** fuzzy-matches your input against a curated database of 60+ titles
3. Each title is associated with MAL genre IDs (Action, Sci-Fi, Psychological, etc.) and descriptive vibes
4. The top 3 genres across all your inputs are combined into a **Vibe Profile**
5. The Jikan API is queried with those genre IDs to find highly-rated, SFW anime
6. Results are displayed with images, scores, synopsis, and match explanations

## Example

| Your Input | Detected Themes | Top Genre |
|---|---|---|
| Inception | Mind-Bending, Dreams, Heist | Sci-Fi, Psychological |
| The Dark Knight | Moral Dilemma, Anti-hero, Crime | Action, Psychological |
| Breaking Bad | Moral Descent, Power Corruption | Drama, Psychological |

→ **Recommended Anime**: Psycho-Pass, Monster, Death Note, Fullmetal Alchemist: Brotherhood…

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
