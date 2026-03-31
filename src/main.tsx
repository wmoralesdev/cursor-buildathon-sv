import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./context/language-context";
import App from "./app";
import "./index.css";
import { LandingPage } from "./pages/landing-page";

const router = createBrowserRouter([
  {
    element: (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    ),
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/brief", element: <Navigate to={{ pathname: "/", hash: "tiers" }} replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
