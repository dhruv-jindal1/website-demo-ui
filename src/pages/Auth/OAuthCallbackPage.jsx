import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;
const REDIRECT_URI = import.meta.env.VITE_AZURE_REDIRECT_URI;
const SCOPES = "openid profile https://graph.microsoft.com/Calendars.Read";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchanged = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      navigate("/calendar/import", { state: { outlookError: searchParams.get("error_description") || error } });
      return;
    }

    if (!code || exchanged.current) return;
    exchanged.current = true;

    const verifier = sessionStorage.getItem("pkce_verifier");
    if (!verifier) {
      navigate("/calendar/import", { state: { outlookError: "PKCE verifier missing. Please try again." } });
      return;
    }

    console.log("Exchanging code for token...");
    console.log("Verifier:", verifier);
    console.log("Code:", code.slice(0, 20) + "...");

    fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        scope: SCOPES,
        code_verifier: verifier,
      }),
    })
      .then((res) => {
        console.log("Token response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Token response data:", data);
        sessionStorage.removeItem("pkce_verifier");
        if (data.access_token) {
          sessionStorage.setItem("outlook_token", data.access_token);
          console.log("Token saved, length:", data.access_token.length);
          navigate("/calendar/import", { state: { outlookConnected: true } });
        } else {
          console.error("No access_token in response:", data);
          navigate("/calendar/import", { state: { outlookError: data.error_description || "Authentication failed" } });
        }
      })
      .catch((err) => {
        console.error("Token exchange error:", err);
        navigate("/calendar/import", { state: { outlookError: "Connection failed. Please try again." } });
      });
  }, [searchParams, navigate]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--color-text-primary)" }}>
      <p>Connecting to Outlook...</p>
    </div>
  );
}
