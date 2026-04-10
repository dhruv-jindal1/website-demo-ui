import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { generateCodeVerifier, generateCodeChallenge } from "../../utils/pkce";
import Card from "../../components/common/Card";
import "./ImportCalendarPage.css";

const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;
const REDIRECT_URI = import.meta.env.VITE_AZURE_REDIRECT_URI;
const SCOPES = "openid profile https://graph.microsoft.com/Calendars.Read";

function parseDurationToSeconds(str) {
  let seconds = 0;
  const hrMatch = str.match(/([\d.]+)\s*hr/);
  const minMatch = str.match(/([\d.]+)\s*min/);
  if (hrMatch) seconds += parseFloat(hrMatch[1]) * 3600;
  if (minMatch) seconds += parseFloat(minMatch[1]) * 60;
  return Math.round(seconds);
}

export default function ImportCalendarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTask } = useTasks();

  const [isOutlookConnected, setIsOutlookConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState(null);

  // Check if we just returned from OAuth callback
  useEffect(() => {
    if (location.state?.outlookConnected) {
      setIsOutlookConnected(true);
    }
    if (location.state?.outlookError) {
      setError(location.state.outlookError);
    }
  }, [location.state]);

  // Also check if we already have a token from a previous session
  useEffect(() => {
    const token = sessionStorage.getItem("outlook_token");
    if (token) setIsOutlookConnected(true);
  }, []);

  const handleConnectOutlook = async () => {
    try {
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      sessionStorage.setItem("pkce_verifier", verifier);

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        response_mode: "query",
        code_challenge: challenge,
        code_challenge_method: "S256",
      });

      window.location.href = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?${params}`;
    } catch (err) {
      setError("Failed to start Outlook connection");
    }
  };

  const handleFetchEvents = async () => {
    if (!isOutlookConnected) return;
    const token = sessionStorage.getItem("outlook_token");
    if (!token) {
      setError("No access token found. Please reconnect.");
      setIsOutlookConnected(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const res = await fetch(
        `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${now}&endDateTime=${in30Days}&$top=50&$orderby=start/dateTime`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const text = await res.text();
      console.log("Graph API status:", res.status, "body:", text);
      const data = text ? JSON.parse(text) : {};

      if (data.error) {
        setError(data.error.message);
        return;
      }

      const mapped = (data.value || []).map((event) => {
        const startDt = new Date(event.start.dateTime + "Z");
        const endDt = new Date(event.end.dateTime + "Z");
        const durationMin = Math.round((endDt - startDt) / 60000);
        const hours = Math.floor(durationMin / 60);
        const mins = durationMin % 60;

        let durationStr = "";
        if (hours > 0) durationStr += `${hours} hr`;
        if (mins > 0) durationStr += `${hours > 0 ? " " : ""}${mins} min`;
        if (!durationStr) durationStr = "0 min";

        return {
          id: event.id,
          title: event.subject,
          date: startDt.toISOString().split("T")[0],
          time: startDt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          duration: durationStr,
          category: "General",
          tags: [],
        };
      });

      setEvents(mapped);
      setHasFetched(true);
    } catch (err) {
      setError("Failed to fetch calendar events");
    } finally {
      setLoading(false);
    }
  };

  const toggleEventSelection = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  const handleImportSelected = () => {
    if (selectedEvents.length === 0) return;

    const toImport = events.filter((event) =>
      selectedEvents.includes(event.id),
    );

    toImport.forEach((event) => {
      addTask({
        title: event.title,
        date: event.date,
        duration: parseDurationToSeconds(event.duration),
        category: event.category || "General",
        tags: event.tags || [],
        project: "Outlook Import",
        description: `${event.time} · ${event.duration}`,
      });
    });

    setSelectedEvents([]);
    navigate("/calendar");
  };

  return (
    <div className="import-calendar-page">
      <div className="import-calendar-page__header">
        <div>
          <p className="import-calendar-page__eyebrow">Calendar integration</p>
          <h1 className="import-calendar-page__title">Import from Outlook</h1>
          <p className="import-calendar-page__subtitle">
            Connect your Outlook calendar, fetch events, and import the ones you
            want into ChronoTrack.
          </p>
        </div>

        <button
          className="import-calendar-btn import-calendar-btn--ghost"
          onClick={() => navigate("/calendar")}
        >
          Back to Calendar
        </button>
      </div>

      {error && (
        <div className="import-calendar-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="import-calendar-layout">
        <Card>
          <div className="import-calendar-panel">
            <div className="import-calendar-step">
              <div className="import-calendar-step__badge">1</div>
              <div className="import-calendar-step__content">
                <h3>Connect to Outlook</h3>
                <p>Sign in with your Microsoft account to access your calendar.</p>
                <button
                  className="import-calendar-btn"
                  onClick={handleConnectOutlook}
                  disabled={isOutlookConnected}
                >
                  {isOutlookConnected ? "Connected" : "Connect to Outlook"}
                </button>
              </div>
            </div>

            <div className="import-calendar-step">
              <div className="import-calendar-step__badge">2</div>
              <div className="import-calendar-step__content">
                <h3>Fetch Events</h3>
                <p>
                  Show events from your Outlook account so you can review them.
                </p>
                <button
                  className="import-calendar-btn import-calendar-btn--secondary"
                  onClick={handleFetchEvents}
                  disabled={!isOutlookConnected || loading}
                >
                  {loading ? "Fetching..." : "Fetch Events"}
                </button>
              </div>
            </div>

            <div className="import-calendar-step">
              <div className="import-calendar-step__badge">3</div>
              <div className="import-calendar-step__content">
                <h3>Select and Import</h3>
                <p>
                  Choose the events you want to bring into your tracked
                  activity.
                </p>

                {events.length === 0 ? (
                  <div className="import-calendar-empty">
                    <p>{hasFetched ? "No upcoming events found in your Outlook calendar." : "No events loaded yet."}</p>
                  </div>
                ) : (
                  <div className="import-calendar-event-list">
                    {events.map((event) => (
                      <label
                        key={event.id}
                        className="import-calendar-event-card"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => toggleEventSelection(event.id)}
                        />

                        <div className="import-calendar-event-card__info">
                          <strong>{event.title}</strong>
                          <span>{event.date}</span>
                          <span>
                            {event.time} • {event.duration}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  className="import-calendar-btn"
                  onClick={handleImportSelected}
                  disabled={selectedEvents.length === 0}
                >
                  Import Selected Events
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="import-calendar-sidecard">
            <h3>How it works</h3>
            <ul>
              <li>Connect your Outlook account securely</li>
              <li>Fetch your upcoming calendar events</li>
              <li>Select only the meetings or events you want</li>
              <li>Import them into ChronoTrack for activity tracking</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
