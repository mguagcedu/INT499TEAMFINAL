import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { oauthConfig } from "../oauth-config";
import { useAuth } from "../context/AuthContext";

/**
 * Very small JWT decode helper for the Google credential.
 * This is only for the front-end demo. A real app would
 * verify the signature on a back-end server.
 */
function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload);
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode Google JWT", e);
    return null;
  }
}

/**
 * Renders the official Google Identity Services button.
 * On success, it:
 *  - decodes the ID token to get basic profile
 *  - calls auth.login(...) if available
 *  - navigates to /home
 */
export default function GoogleSignInButton({ variant = "landing" }) {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const auth = useAuth ? useAuth() : {};
  const loginFn = auth?.login || auth?.loginWithGoogle || auth?.handleGoogleLogin;

  useEffect(() => {
    // Ensure Google script is loaded
    if (!window.google || !window.google.accounts || !buttonRef.current) {
      return;
    }

    // Avoid initializing more than once on hot reloads
    if (window.__streamlistGsiInitialized) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 280,
      });
      return;
    }

    window.google.accounts.id.initialize({
      client_id: oauthConfig.clientId,
      callback: (credentialResponse) => {
        const payload = decodeJwt(credentialResponse.credential);
        console.log("Google ID token payload (demo):", payload);

        // If our AuthContext exposes a login-style function, update it.
        if (payload && typeof loginFn === "function") {
          loginFn({
            name: payload.name || payload.given_name || "Google user",
            email: payload.email,
            picture: payload.picture,
            sub: payload.sub,
          });
        }

        // Route the user into the app after sign in.
        navigate("/home");
      },
      cancel_on_tap_outside: true,
      auto_select: false,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 280,
    });

    window.__streamlistGsiInitialized = true;
  }, [loginFn, navigate]);

  return (
    <div
      ref={buttonRef}
      aria-label="Sign in with Google for StreamList"
      style={{ display: "inline-block" }}
    />
  );
}
