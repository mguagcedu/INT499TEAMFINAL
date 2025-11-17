import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const GOOGLE_CLIENT_ID =
  "762177763504-1tkoj7otg2ubbfr6d1enrfo1kfq4inam.apps.googleusercontent.com";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [gsiReady, setGsiReady] = useState(false);

  // Detect Google script
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        setGsiReady(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Initialize one-tap
  useEffect(() => {
    if (!gsiReady) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        const payload = parseJwt(response.credential);
        if (payload) {
          setUser({
            name: payload.name,
            email: payload.email
          });
        }
      }
    });
  }, [gsiReady]);

  const signIn = () => {
    if (gsiReady && window.google && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
