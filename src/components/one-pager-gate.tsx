import { type FormEvent, type ReactNode, useCallback, useId, useState } from "react";

const STORAGE_KEY = "cursor-hack-onepager-unlocked";

function getConfiguredPassword(): string {
  const raw = import.meta.env.VITE_ONEPAGER_PASSWORD;
  return typeof raw === "string" ? raw.trim() : "";
}

function isUnlockedFromStorage(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistUnlock(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}

type OnePagerGateProps = {
  children: ReactNode;
};

/**
 * When `VITE_ONEPAGER_PASSWORD` is non-empty, requires that password before
 * rendering children. Unlock is stored for the browser tab session only.
 */
export function OnePagerGate({ children }: OnePagerGateProps) {
  const configured = getConfiguredPassword();
  const needsGate = configured.length > 0;

  const [unlocked, setUnlocked] = useState(() => !needsGate || isUnlockedFromStorage());
  const [error, setError] = useState<string | null>(null);
  const labelId = useId();
  const errorId = useId();

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const entered = String(fd.get("password") ?? "").trim();
      if (entered === configured) {
        persistUnlock();
        setError(null);
        setUnlocked(true);
      } else {
        setError("Incorrect password.");
      }
    },
    [configured],
  );

  if (!needsGate || unlocked) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-10 text-fg"
      data-theme="dark"
    >
      <form
        className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-bg-raised p-6 shadow-lg"
        onSubmit={onSubmit}
        aria-labelledby={labelId}
      >
        <h1 id={labelId} className="font-display text-lg font-semibold tracking-tight">
          One-pager access
        </h1>
        <p className="text-sm text-fg-2">Enter the password to view this page.</p>
        <div className="space-y-1.5">
          <label htmlFor={`${labelId}-input`} className="sr-only">
            Password
          </label>
          <input
            id={`${labelId}-input`}
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none ring-accent focus:ring-2"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            required
          />
          {error ? (
            <p id={errorId} className="text-sm text-accent" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dim"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
