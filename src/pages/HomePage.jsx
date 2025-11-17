import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const HomePage = () => {
  const { favorites, cartItems, cartCount, plannerItems } = useApp() || {};

  const recentFavorites = (favorites || []).slice(0, 4);
  const currentPlan = cartItems && cartItems[0];

  return (
    <main className="page home-page">
      <header className="page-header">
        <h1>Welcome back to StreamList</h1>
        <p>
          This home screen summarizes your current subscription choice,
          favorite titles, and anything you have parked in the simple watch
          planner.
        </p>
      </header>

      <section className="summary-grid">
        <article className="summary-card">
          <h3>Favorites</h3>
          <p className="summary-number">{favorites ? favorites.length : 0}</p>
          <p className="summary-caption">
            Star movies on the Movies tab to collect them here.
          </p>
          <Link to="/favorites" className="summary-link">
            View favorites
          </Link>
        </article>

        <article className="summary-card">
          <h3>Items in cart</h3>
          <p className="summary-number">{cartCount || 0}</p>
          <p className="summary-caption">
            You can only hold one active subscription in the cart at a time.
          </p>
          <Link to="/cart" className="summary-link">
            Go to cart
          </Link>
        </article>

        <article className="summary-card">
          <h3>Planner items</h3>
          <p className="summary-number">{plannerItems ? plannerItems.length : 0}</p>
          <p className="summary-caption">
            Use the Planner tab to quickly capture nights and titles.
          </p>
          <Link to="/planner" className="summary-link">
            Open planner
          </Link>
        </article>
      </section>

      <section className="home-two-column">
        <div className="home-panel">
          <h2>Recently favorited</h2>
          {!recentFavorites.length ? (
            <p>
              You have not favorited anything yet. Visit the{" "}
              <Link to="/movies">Movies</Link> tab and click{" "}
              <strong>Add to favorites</strong> on a few titles.
            </p>
          ) : (
            <ul className="simple-list">
              {recentFavorites.map((m) => (
                <li key={m.id}>
                  <span className="list-primary">
                    {m.title || "Untitled movie"}
                  </span>
                  <span className="list-secondary">
                    {m.release_date
                      ? new Date(m.release_date).getFullYear()
                      : "Year unknown"}
                    {m.vote_average ? ` • Rating ${m.vote_average}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {favorites && favorites.length > 4 && (
            <p className="summary-caption">
              Showing the 4 most recent favorites. View the rest on the{" "}
              <Link to="/favorites">Favorites</Link> page.
            </p>
          )}
        </div>

        <div className="home-panel">
          <h2>Current subscription selection</h2>
          {!currentPlan ? (
            <p>
              You have not selected a plan yet. Visit the{" "}
              <Link to="/shop">Shop</Link> tab to choose a subscription.
            </p>
          ) : (
            <div className="current-plan">
              <h3>{currentPlan.name}</h3>
              <p className="plan-price">
                ${currentPlan.price.toFixed(2)}{" "}
                <span className="plan-price-term">per month</span>
              </p>
              <p className="plan-description">{currentPlan.description}</p>
              <Link to="/cart" className="btn small">
                Review in cart
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
