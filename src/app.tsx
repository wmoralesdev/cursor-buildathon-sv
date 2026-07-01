import { Outlet, useLocation } from "react-router-dom";

import { SiteNav } from "./components/site-nav";
import { useHashScroll } from "./hooks/use-hash-scroll";
import { useScrollReveal } from "./hooks/use-scroll-reveal";

export default function App() {
  const location = useLocation();
  useScrollReveal();
  useHashScroll();

  return (
    <div className="relative min-h-screen bg-bg">
      {location.pathname !== "/welcome" && location.pathname !== "/builder" ? (
        <div className="grain" aria-hidden="true" />
      ) : null}

      <SiteNav />

      <Outlet />
    </div>
  );
}
