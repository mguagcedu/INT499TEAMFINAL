import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useApp() || {};

  const handleLimitedAccess = () => {
    navigate("/movies");
  };

  const handleViewDemo = () => {
    navigate("/shop");
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  return (
    <main className="page landing-page">
      <section className="hero">
        <div className="hero-text">
          <h2>StreamList for EZTechMovie</h2>
          <p>
            This Progressive Web App (PWA) helps busy families track what they
            watch, plan future movie nights, and manage streaming budgets in
            one place.
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={handleViewDemo}>
              View shop demo
            </button>
            <button className="btn secondary" onClick={handleLimitedAccess}>
              Try limited access
            </button>
            <button className="btn accent" onClick={handleSignInClick}>
              Sign in with Google
            </button>
          </div>
          {user && (
            <p className="hero-signed-in">
              You are already signed in. Go to your{" "}
              <Link to="/home">home dashboard</Link>.
            </p>
          )}
        </div>

        <div className="hero-summary">
          <h3>What Week 5 adds</h3>
          <ul>
            <li>
              <strong>Secure sign in:</strong> Google OAuth for authentication
              so the app never sees your password.
            </li>
            <li>
              <strong>Scoped access:</strong> Only basic profile and email are
              requested, and sign out clears local state on this device.
            </li>
            <li>
              <strong>PWA features:</strong> Installable icon, offline shell,
              and cached pages for core flows such as the movie planner and
              cart.
            </li>
            <li>
              <strong>Data handling:</strong> The Movie Database (TMDB) is used
              for read only movie data and nothing is written back to TMDB.
            </li>
            <li>
              <strong>Payment flow demo:</strong> The credit card screen shows
              how PCI friendly tokenization would look without storing card
              numbers in the app.
            </li>
          </ul>
        </div>
      </section>

      <section className="hero-details">
        <h3>User paths</h3>
        <div className="columns">
          <article>
            <h4>1. Demo without sign in</h4>
            <p>
              Instructors can jump straight into the shop demo to see how
              subscriptions, cart handling, and responsive layouts behave.
            </p>
          </article>
          <article>
            <h4>2. Limited access</h4>
            <p>
              Students can search TMDB movies and explore the planner without an
              account. Some actions, such as saving favorites across devices,
              stay locked to signed in users.
            </p>
          </article>
          <article>
            <h4>3. Full experience</h4>
            <p>
              Google sign in unlocks persistent favorites, planner entries, and
              subscription choices tied to your profile on this browser.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
