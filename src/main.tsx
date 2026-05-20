/* eslint-disable react-refresh/only-export-components -- Entry module defines dev-only route helpers and JSX route trees */
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./context/language-context";
import App from "./app";
import "./index.css";
import { OnePagerGate } from "./components/one-pager-gate";
import { LandingPage } from "./pages/landing-page";
import { OnePagerPage } from "./pages/one-pager";
import { OnePagerBoxfulPage } from "./pages/one-pager-boxful";
import { OnePagerNiuPage } from "./pages/one-pager-niu";
import { BuildathonWelcomePage } from "./pages/buildathon-welcome-page";
import { SPONSOR_MAILTO } from "./constants";

let sponsorBriefRedirectIssued = false;

/** Dev-only mailto redirect route element */
function BriefToSponsorMail() {
  useEffect(() => {
    if (sponsorBriefRedirectIssued) return;
    sponsorBriefRedirectIssued = true;
    window.location.replace(SPONSOR_MAILTO);
  }, []);
  return null;
}

const onePagerTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <OnePagerGate>
        <OnePagerPage />
      </OnePagerGate>
    </ThemeProvider>
  </LanguageProvider>
);

const onePagerNiuTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <OnePagerGate>
        <OnePagerNiuPage />
      </OnePagerGate>
    </ThemeProvider>
  </LanguageProvider>
);

const onePagerBoxfulTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <OnePagerGate>
        <OnePagerBoxfulPage />
      </OnePagerGate>
    </ThemeProvider>
  </LanguageProvider>
);

const devOnlyRoutes = import.meta.env.DEV
  ? [
      { path: "/onepager", element: onePagerTheme },
      { path: "/onepager-niu", element: onePagerNiuTheme },
      { path: "/onepager-boxful", element: onePagerBoxfulTheme },
    ]
  : [];

const mainLayoutRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/welcome", element: <BuildathonWelcomePage /> },
  ...(import.meta.env.DEV
    ? [{ path: "/brief", element: <BriefToSponsorMail /> }]
    : []),
  ...(import.meta.env.PROD ? [{ path: "*", element: <Navigate to="/" replace /> }] : []),
];

const router = createBrowserRouter([
  ...devOnlyRoutes,
  {
    element: (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    ),
    children: mainLayoutRoutes,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
