import type { ReactNode } from "react";

export interface OnePagerSheetFrameProps {
  sheetClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}

/** Shared one-pager sheet chrome: white page + faint grid texture (prizes baseline). */
export function OnePagerSheetFrame({
  sheetClassName = "",
  contentClassName = "relative",
  children,
}: OnePagerSheetFrameProps) {
  const sheetClass = ["one-pager-sheet bg-bg text-fg", sheetClassName].filter(Boolean).join(" ");

  return (
    <div id="one-pager-sheet" className={sheetClass}>
      <div className="one-pager-grid" aria-hidden />
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
