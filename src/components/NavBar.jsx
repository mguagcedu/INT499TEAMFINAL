import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const NavBar = () => {
  const { user, setUser, cartCount } = useApp() || {};
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (setUser) {
      setUser(null);
    }
    // Clears local state and returns to splash landing
    navigate("/");
  };

  const goLogin = () => {
    navigate("/login");
  };

  const handleBrandClick = () => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="top-nav">
      <div className="nav-left">
        <button
          className="brand"
          type="button"
          onClick={handleBrandClick}
          aria-label="Go to StreamList"
        >
          <div className="brand-mark">EZ</div>
          <span className="brand-text">StreamList</span>
        </button>

        <nav className="nav-links">
          <NavLink to="/home" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/movies" className={linkClass}>
            Movies
          </NavLink>
          <NavLink to="/planner" className={linkClass}>
            Planner
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
            {typeof cartCount === "number" && cartCount > 0 && (
              <span className="cart-pill">{cartCount}</span>
            )}
          </NavLink>
        </nav>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="user-menu">
            <button
              type="button"
              className="user-button"
              onClick={handleSignOut}
              title="Click to sign out"
            >
              <span className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
              <span className="user-name">
                {user.name || user.email || "Signed in"}
              </span>
              <span className="user-action">Sign out</span>
            </button>
          </div>
        ) : (
          <button type="button" className="btn small" onClick={goLogin}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
