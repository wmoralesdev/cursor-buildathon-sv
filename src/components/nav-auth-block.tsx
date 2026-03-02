import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useTranslation } from "../context/language-context";

type NavAuthBlockVariant = "minimal" | "full";

interface NavAuthBlockProps {
  variant?: NavAuthBlockVariant;
  onLinkClick?: () => void;
}

export function NavAuthBlock({ variant = "minimal", onLinkClick }: NavAuthBlockProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isMinimal = variant === "minimal";

  const loadingClass = isMinimal
    ? "h-9 w-9 animate-pulse rounded-full bg-white/10"
    : "h-9 w-20 animate-pulse rounded-lg bg-white/10";

  const loginClass = isMinimal
    ? "rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-fg-3 transition-all duration-200 hover:border-accent/40 hover:text-accent"
    : "rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-[#050505] transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,44,0.3)] hover:brightness-110";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    onLinkClick?.();
    await signOut({ redirectUrl: "/" });
    navigate("/");
  }

  if (!isLoaded) {
    return <div className={loadingClass} />;
  }

  if (!isSignedIn) {
    return (
      <Link to="/login" onClick={onLinkClick} className={loginClass}>
        {t("nav.login")}
      </Link>
    );
  }

  const avatarUrl = user?.imageUrl;
  const displayName = user?.firstName ?? user?.username ?? "User";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
        className="rounded-full border border-white/10 p-0.5 text-fg-3 transition-all duration-200 hover:border-accent/40 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-fg-5 font-display text-sm font-semibold text-fg">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-lg border border-border bg-bg-raised py-1 shadow-xl"
          role="menu"
        >
          <Link
            to="/dashboard"
            onClick={() => {
              setOpen(false);
              onLinkClick?.();
            }}
            role="menuitem"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-fg-2 transition-colors hover:bg-surface hover:text-accent"
          >
            <LayoutDashboard size={16} className="shrink-0 text-fg-4" />
            {t("nav.dashboard")}
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            role="menuitem"
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-fg-2 transition-colors hover:bg-surface hover:text-accent"
          >
            <LogOut size={16} className="shrink-0 text-fg-4" />
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
