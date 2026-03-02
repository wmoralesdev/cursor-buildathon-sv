import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavAuthBlock } from "./nav-auth-block";
import { LUMA_URL } from "../constants";

export function SiteNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const admin = useQuery(api.admin.isAdmin);

  return (
    <nav className="relative z-20 flex items-center justify-between max-w-7xl mx-auto w-full py-8 section-padding">
      <div className="flex items-center">
        <Link to="/">
          <img
            src={resolvedTheme === "light" ? "/lockup-light.png" : "/lockup-dark.png"}
            alt="Cursor"
            className="h-6 w-auto object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {admin && (
          <Link
            to="/admin"
            className="font-mono text-[0.6rem] tracking-[0.15em] text-accent hover:text-accent-dim uppercase transition-colors border border-accent/30 hover:border-accent/60 px-2.5 py-1"
          >
            // jury
          </Link>
        )}
        <NavAuthBlock variant="minimal" />
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full border border-white/10 p-2 text-fg-3 transition-all duration-200 hover:border-accent/40 hover:text-accent"
        >
          {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <a
          href={LUMA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-phosphor text-xs hidden sm:inline-block px-7 py-2.5"
        >
          Registrate →
        </a>
      </div>
    </nav>
  );
}
