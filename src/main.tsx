import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./context/language-context";
import App from "./app";
import "./index.css";
import { LandingPage } from "./pages/landing-page";
import { BriefPage } from "./pages/brief-page";
import { EventPage } from "./pages/event-page";
// import { DashboardPage } from "./pages/dashboard-page";
// import { SignInPage } from "./pages/sign-in-page";
// import { SSOCallback } from "./pages/sso-callback";
// import { AdminPage } from "./pages/admin-page";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string
);

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const router = createBrowserRouter([
  {
    element: (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    ),
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/brief", element: <BriefPage /> },
      { path: "/event", element: <EventPage /> },
      // { path: "/dashboard", element: <DashboardPage /> },
      // { path: "/login", element: <SignInPage /> },
      // { path: "/sign-in", element: <Navigate to="/login" replace /> },
      // { path: "/sso-callback", element: <SSOCallback /> },
      // { path: "/admin", element: <AdminPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <RouterProvider router={router} />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>,
);
