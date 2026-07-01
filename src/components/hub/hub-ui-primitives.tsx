import type { ReactNode } from "react";

export function HubCard({
  title,
  tag,
  children,
  className = "",
}: {
  title: string;
  tag?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-border bg-surface p-6 sm:p-8 ${className}`}>
      {tag ? (
        <span className="tag mb-4 inline-block">{tag}</span>
      ) : null}
      <h3 className="font-display mb-5 text-[1.05rem] font-semibold uppercase tracking-[0.05em] text-fg">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function HubField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
        {label}
      </span>
      {children}
    </label>
  );
}

export function HubInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-border-faint bg-bg px-3 py-2.5 font-display text-[0.95rem] text-fg outline-none transition-colors focus:border-accent ${props.className ?? ""}`}
    />
  );
}

export function HubTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-24 w-full resize-y border border-border-faint bg-bg px-3 py-2.5 font-display text-[0.95rem] text-fg outline-none transition-colors focus:border-accent ${props.className ?? ""}`}
    />
  );
}

export function HubButton({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "border border-accent bg-accent text-bg hover:bg-accent/90"
      : "border border-border-faint bg-transparent text-fg hover:border-accent hover:text-accent";
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${props.className ?? ""}`}
    />
  );
}

export function HubError({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="mt-3 font-display text-[0.875rem] text-red-400">{message}</p>;
}
