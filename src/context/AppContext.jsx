import React, { createContext, useContext, useEffect, useState } from "react";

// Central app context so pages can share user, favorites, and cart
const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

const STORAGE_KEYS = {
  user: "streamlist_user",
  favorites: "streamlist_favorites",
  cart: "streamlist_cart"
};

export const AppProvider = ({ children }) => {
  // Basic auth user profile
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.user);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Favorite movies from TMDB search
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.favorites);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Cart holds a single subscription plan for this assignment
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.cart);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Simple planner items for earlier weeks (kept so older pages do not break)
  const [plannerItems, setPlannerItems] = useState([]);

  // Optional theme flag for accessibility tweaks
  const [theme, setTheme] = useState("dark");

  // Persist to localStorage when things change
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    } catch {
      // If storage is blocked we still let the app run
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  // Favorites helpers
  const isFavorite = (id) => favorites.some((m) => m.id === id);

  const addFavorite = (movie) => {
    if (!movie || !movie.id) return;
    setFavorites((current) => {
      if (current.some((m) => m.id === movie.id)) {
        return current;
      }
      return [...current, movie];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((current) => current.filter((m) => m.id !== id));
  };

  const toggleFavorite = (movie) => {
    if (!movie || !movie.id) return;
    setFavorites((current) => {
      if (current.some((m) => m.id === movie.id)) {
        return current.filter((m) => m.id !== movie.id);
      }
      return [...current, movie];
    });
  };

  // Cart helpers
  // For this project we enforce a single active subscription in the cart
  const addSubscriptionToCart = (plan) => {
    if (!plan || !plan.id) return;
    setCartItems([plan]);
  };

  const removeFromCart = (id) => {
    setCartItems((current) => current.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const value = {
    // auth
    user,
    setUser,
    // favorites
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    // cart
    cartItems,
    addSubscriptionToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    // planner and theme kept for earlier weeks
    plannerItems,
    setPlannerItems,
    theme,
    setTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
