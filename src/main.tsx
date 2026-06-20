import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "@fontsource/inter/400.css";
import "@fontsource/playfair-display/400.css";
import App from "./App.tsx";
import "./index.css";

// Initialize Sentry for production observability
// TODO: Replace with your actual Sentry DSN
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: import.meta.env.PROD,
});

createRoot(document.getElementById("root")!).render(<App />);
