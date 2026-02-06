import { createRoot } from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/playfair-display/400.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
