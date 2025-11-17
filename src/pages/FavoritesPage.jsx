import React from "react";
import { useApp } from "../context/AppContext";

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useApp() || {};

  return (
    <main className="page">
      <header className="page-header">
        <h2>Your favorites</h2>
        <p>
          This page collects all of the movies you starred while browsing TMDB.
          It acts like a personal shortlist during planning.
        </p>
      </header>

      {!favorites || favorites.length === 0 ? (
        <p>
          You do not have any favorites yet. Visit the Movies tab and star a
          few titles to see them here.
        </p>
      ) : (
        <section className="movie-grid">
          {favorites.map((movie) => {
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
                    ? movie.overview.slice(0, 120) +
                      (movie.overview.length > 120 ? "..." : "")
                    : "No description provided by TMDB."}
                </p>
                <button
                  type="button"
                  className="btn small secondary"
                  onClick={() => removeFavorite && removeFavorite(movie.id)}
                >
                  Remove from favorites
                </button>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default FavoritesPage;
