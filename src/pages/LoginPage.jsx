import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const GOOGLE_CLIENT_ID =
  "762177763504-1tkoj7otg2ubbfr6d1enrfo1kfq4inam.apps.googleusercontent.com";

const LoginPage = () => {
  const { user, setUser } = useApp() || {};
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const initializedRef = useRef(false);

  // Load Google script and initialize button
  useEffect(() => {
    if (!setUser || initializedRef.current) {
      return;
    }

    const initGoogle = () => {
      if (!window.google || !window.google.accounts || initializedRef.current) {
        return;
      }

      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          try {
            const parts = response.credential.split(".");
            const payload = parts[1] ? JSON.parse(atob(parts[1])) : {};
            const profile = {
              name: payload.name || "Google user",
              email: payload.email || "unknown@example.com"
            };
            setUser(profile);
            try {
              localStorage.setItem("streamlist_user", JSON.stringify(profile));
            } catch {
              // ignore storage issues
            }
            navigate("/home");
          } catch (err) {
            console.error("Error decoding Google credential", err);
            setError("Could not process Google sign in. Returning to landing.");
            setTimeout(() => {
              navigate("/");
            }, 1500);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      const buttonDiv = document.getElementById("gsi-button");
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular"
        });
      }
    };

    // If script already exists, initialize directly
    if (window.google && window.google.accounts) {
      initGoogle();
      return;
    }

    // Otherwise inject the script
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    } else {
      // If element exists but not yet loaded, attach onload
      existing.addEventListener("load", initGoogle);
    }

    return () => {
      // optional cleanup; keep accounts id for other pages
    };
  }, [navigate, setUser]);

  // If already signed in, go home
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleDemoSignIn = () => {
    if (!setUser) {
      navigate("/");
      return;
    }
    const profile = {
      name: "Demo Student",
      email: "student@example.com"
    };
    setUser(profile);
    try {
      localStorage.setItem("streamlist_user", JSON.stringify(profile));
    } catch {
      // ignore
    }
    navigate("/home");
  };

  return (
    <main className="page login-page">
      <header className="page-header">
        <h2>Sign in to StreamList</h2>
        <p>
          Google OAuth keeps your password with Google while this app only
          receives a short lived identity token and your basic profile details.
        </p>
      </header>

      <section className="login-grid">
        <div className="login-panel">
          <h3>Sign in with Google</h3>
          <div id="gsi-button" className="gsi-button-slot" />
          {error && <p className="error-text">{error}</p>}
          <p className="login-note">
            If sign in fails, you will be sent back to the{" "}
            <Link to="/">landing page</Link> where you can retry or use limited
            access.
          </p>
        </div>

        <div className="login-panel">
          <h3>Classroom demo profile</h3>
          <p>
            Use this option if you prefer not to log in with a real Google
            account during a recorded presentation. The same StreamList features
            are enabled, but all data is stored locally on this browser only.
          </p>
          <button className="btn secondary" onClick={handleDemoSignIn}>
            Use demo profile
          </button>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
