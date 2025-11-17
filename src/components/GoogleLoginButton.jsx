import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const GOOGLE_CLIENT_ID =
  "762177763504-1tkoj7otg2ubbfr6d1enrfo1kfq4inam.apps.googleusercontent.com";

function GoogleLoginButton() {
  const buttonRef = useRef(null);
  const { signIn } = useAuth();

  useEffect(() => {
    if (!window.google || !window.google.accounts || !buttonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: () => {
        // AuthContext handles user state
      }
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large"
    });
  }, []);

  return (
    <div>
      <div ref={buttonRef} />
      <button className="btn-link" type="button" onClick={signIn}>
        Sign in with Google
      </button>
    </div>
  );
}

export default GoogleLoginButton;
