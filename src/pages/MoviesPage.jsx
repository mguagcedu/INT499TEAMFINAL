import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

// Pull these from your earlier setup
const TMDB_API_KEY = "8c4123c5aa15296823fbcc28c219147c";

const MoviesPage = () => {
  const { favorites, isFavorite, toggleFavorite } = useApp() || {};
  const [query, setQuery] = useState("Avengers");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error

  // Simple search helper for TMDB
  const fetchMovies = async (searchText) => {
    if (!searchText) {
      setMovies([]);
      return;
    }
    setStatus("loading");
    try {
      const encoded = encodeURIComponent(searchText.trim());
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encoded}&include_adult=false&page=1`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Request failed");
      }
      const data = await res.json();
      setMovies(Array.isArray(data.results) ? data.results : []);
      setStatus("idle");
    } catch (err) {
      console.error("Error fetching TMDB movies", err);
      setStatus("error");
    }
  };

  // Initial demo results
  useEffect(() => {
    fetchMovies(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMovies(query);
  };

  const handleToggleFavorite = (movie) => {
    if (!toggleFavorite) return;
    toggleFavorite({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      poster_path: movie.poster_path,
      overview: movie.overview
    });
  };

  return (
    <main className="page">
      <header className="page-header">
        <h2>Browse movies</h2>
        <p>
          Search TMDB and mark titles as favorites. Everything you star here
          appears on the Favorites page for quick access during planning.
        </p>
      </header>

      <form className="movies-search" onSubmit={handleSubmit}>
        <div className="field">
          <span>Search by title</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a movie name and press Enter"
          />
          <p className="search-hint">
            Example searches: Loki, Encanto, The Dark Knight, Barbie.
          </p>
        </div>
      </form>

      {status === "loading" && <p>Loading results from TMDB...</p>}
      {status === "error" && (
        <p>
          Could not reach TMDB. Please check your connection and try again in a
          moment.
        </p>
      )}

      <section className="movie-grid">
        {movies.map((movie) => {
          const fav = isFavorite ? isFavorite(movie.id) : false;
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : null;

          return (
            <article key={movie.id} className="movie-card">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="movie-poster"
                  loading="lazy"
                />
              ) : (
                <div className="movie-poster placeholder">No poster</div>
              )}

              <h3>{movie.title}</h3>
              <p className="movie-meta">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "Year unknown"}{" "}
                • Rating {movie.vote_average || "NR"}
              </p>
              <p className="movie-overview">
                {movie.overview
                  ? movie.overview.slice(0, 120) + (movie.overview.length > 120 ? "..." : "")
                  : "No description provided by TMDB."}
              </p>

              <button
                type="button"
                className="btn small secondary"
                onClick={() => handleToggleFavorite(movie)}
              >
                {fav ? "Remove from favorites" : "Add to favorites"}
              </button>
            </article>
          );
        })}
      </section>

      {movies.length === 0 && status === "idle" && (
        <p>No results yet. Try searching for a different title.</p>
      )}

      {favorites && favorites.length > 0 && (
        <p style={{ marginTop: 18, fontSize: 13, color: "#9ca3af" }}>
          You currently have {favorites.length} favorite
          {favorites.length === 1 ? "" : "s"} saved. Check them out on the
          Favorites tab.
        </p>
      )}
    </main>
  );
};

export default MoviesPage;
