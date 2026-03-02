import { useAuth, useSignIn } from "@clerk/clerk-react";
import { Link, Navigate } from "react-router-dom";

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function SignInPage() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const isLoaded = isAuthLoaded && isSignInLoaded;

  if (isLoaded && isSignedIn) {
    return <Navigate to="/" replace />;
  }

  async function signInWith(provider: "oauth_github" | "oauth_google") {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center section-padding bg-bg">
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none bg-grid mask-radial-center" />

      {/* Orange glow */}
      <div className="absolute pointer-events-none glow-sign-in" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.15em] text-fg-3 hover:text-fg no-underline uppercase mb-10 transition-colors duration-200"
        >
          <span className="text-accent">←</span>
          Cursor Hackathon GT
        </Link>

        {/* Card */}
        <div className="border border-border bg-surface px-9 py-10">
          {/* Header */}
          <span className="tag mb-6 inline-block">// acceso</span>

          <h1 className="font-bold uppercase leading-none mb-2 font-display text-[2rem] text-fg tracking-[-0.02em]">
            INICIA
            <br />
            <span className="text-accent">SESIÓN</span>
          </h1>

          <p className="font-display text-[0.8rem] text-fg-4 leading-[1.6] mb-9">
            Conecta tu cuenta para acceder al panel de participante.
          </p>

          <div className="h-rule mb-8" />

          {/* Auth buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => signInWith("oauth_github")}
              disabled={!isLoaded}
              className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-[#24292f] text-white font-display font-semibold text-[0.82rem] tracking-[0.08em] uppercase transition-[background,opacity] duration-200 cursor-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#2f363d] disabled:hover:bg-[#24292f]"
            >
              <GitHubIcon />
              Continuar con GitHub
            </button>

            <button
              onClick={() => signInWith("oauth_google")}
              disabled={!isLoaded}
              className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-transparent border border-border text-fg-2 font-display font-medium text-[0.82rem] tracking-[0.08em] uppercase transition-[border-color,color,opacity] duration-200 cursor-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-fg-5 hover:text-fg disabled:hover:border-border disabled:hover:text-fg-2"
            >
              <GoogleIcon />
              Continuar con Google
            </button>
          </div>

          {/* Footer note */}
          <p className="font-mono text-[0.58rem] tracking-widest text-fg-6 uppercase text-center mt-7 leading-[1.8]">
            Al continuar aceptas los términos del evento.
            <br />
            No se requiere contraseña.
          </p>
        </div>
      </div>
    </main>
  );
}
