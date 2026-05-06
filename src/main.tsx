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
import { OnePagerCashPage } from "./pages/one-pager-cash";
import { BuildathonWelcomePage } from "./pages/buildathon-welcome-page";
import { SPONSOR_MAILTO } from "./constants";

let sponsorBriefRedirectIssued = false;

function BriefToSponsorMail() {
  useEffect(() => {
    if (sponsorBriefRedirectIssued) return;
    sponsorBriefRedirectIssued = true;
    window.location.replace(SPONSOR_MAILTO);
  }, []);
  return null;
}

const onePagerTheme = (
  <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
    <OnePagerGate>
      <OnePagerPage />
    </OnePagerGate>
  </ThemeProvider>
);

const onePagerCashTheme = (
  <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
    <OnePagerGate>
      <OnePagerCashPage />
    </OnePagerGate>
  </ThemeProvider>
);

const devOnlyRoutes = import.meta.env.DEV
  ? [
      { path: "/onepager", element: onePagerTheme },
      { path: "/onepager-cash", element: onePagerCashTheme },
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
