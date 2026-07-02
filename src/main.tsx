/* eslint-disable react-refresh/only-export-components -- Entry module defines dev-only route helpers and JSX route trees */
import { StrictMode, lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./context/language-context";
import App from "./app";
import "./index.css";
import { LandingPage } from "./pages/landing-page";
import { BuildathonWelcomePage } from "./pages/buildathon-welcome-page";
import { ProjectSubmitPage } from "./pages/project-submit-page";
import { AdminPage } from "./pages/admin-page";
import { NotFoundPage } from "./pages/not-found-page";
import { RouteErrorPage } from "./pages/route-error-page";
import { SPONSOR_MAILTO } from "./constants";
import { ConvexClerkProvider } from "./lib/convex-clerk-provider";

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
  {
    element: (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    ),
    errorElement: (
      <LanguageProvider>
        <RouteErrorPage />
      </LanguageProvider>
    ),
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: mainLayoutRoutes,
      },
    ],
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
  <ConvexClerkProvider>{appTree}</ConvexClerkProvider>,
);
