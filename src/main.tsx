/* eslint-disable react-refresh/only-export-components -- Entry module defines dev-only route helpers and JSX route trees */
import { StrictMode, lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./context/language-context";
import App from "./app";
import "./index.css";
import { LandingPage } from "./pages/landing-page";
import { PrizesOnePagerPage } from "./pages/prizes-one-pager";
import { MentorOnePagerPage } from "./pages/mentor-one-pager";
import { JudgesOnePagerPage } from "./pages/judges-one-pager";
import { SobrecupoOnePagerPage } from "./pages/sobrecupo-one-pager";
import { JoinedSponsorsOnePagerPage } from "./pages/joined-sponsors-one-pager";
import { BuildathonWelcomePage } from "./pages/buildathon-welcome-page";
import { ProjectSubmitPage } from "./pages/project-submit-page";
import { AdminPage } from "./pages/admin-page";
import { NotFoundPage } from "./pages/not-found-page";
import { SPONSOR_MAILTO } from "./constants";
import { ConvexClerkProvider } from "./lib/convex-clerk-provider";
import { convexClient, isConvexConfigured } from "./lib/convex-client";

const BuilderPage = lazy(() =>
  import("./pages/builder-page").then((m) => ({ default: m.BuilderPage })),
);

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

const onePagerPrizesTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <PrizesOnePagerPage />
    </ThemeProvider>
  </LanguageProvider>
);

const onePagerJoinedSponsorsTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <JoinedSponsorsOnePagerPage />
    </ThemeProvider>
  </LanguageProvider>
);

const onePagerMentorsTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <MentorOnePagerPage />
    </ThemeProvider>
  </LanguageProvider>
);

const onePagerJudgesTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <JudgesOnePagerPage />
    </ThemeProvider>
  </LanguageProvider>
);

const onePagerSobrecupoTheme = (
  <LanguageProvider>
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <SobrecupoOnePagerPage />
    </ThemeProvider>
  </LanguageProvider>
);

const devOnlyRoutes = import.meta.env.DEV
  ? [
      { path: "/onepager-prizes", element: onePagerPrizesTheme },
      { path: "/onepager-sponsors", element: onePagerJoinedSponsorsTheme },
      { path: "/onepager-mentors", element: onePagerMentorsTheme },
      { path: "/onepager-judges", element: onePagerJudgesTheme },
      { path: "/onepager-sobrecupo", element: onePagerSobrecupoTheme },
    ]
  : [];

const mainLayoutRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/welcome", element: <BuildathonWelcomePage /> },
  { path: "/builder", element: <Suspense fallback={null}><BuilderPage /></Suspense> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/submit", element: <ProjectSubmitPage /> },
  ...(import.meta.env.DEV
    ? [{ path: "/brief", element: <BriefToSponsorMail /> }]
    : []),
  { path: "*", element: <NotFoundPage /> },
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

const appTree = (
  <StrictMode>
    <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(
  isConvexConfigured && convexClient ? (
    <ConvexClerkProvider>{appTree}</ConvexClerkProvider>
  ) : (
    appTree
  ),
);
