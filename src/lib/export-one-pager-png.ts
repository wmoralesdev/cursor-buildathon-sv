import { domToBlob, waitUntilLoad } from "modern-screenshot";

const SHEET_ID = "one-pager-sheet";
const CAPTURE_CLASS = "one-pager-export-capture";

export interface ExportOnePagerSheetPngArgs {
  /** Output pixel ratio (matches the toolbar preview scale: 1, 2, or 3). */
  scale: number;
  /** Download filename, including the `.png` extension. */
  filename: string;
}

/** Wait two frames so capture-class dimensions and zoom reset apply before measuring. */
async function flushLayout(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/**
 * Pin the sheet at the viewport origin during capture so ancestor flex/scroll/zoom
 * cannot skew the cloned layout inside modern-screenshot.
 */
function pinSheetForCapture(sheet: HTMLElement): () => void {
  const prev = {
    position: sheet.style.position,
    left: sheet.style.left,
    top: sheet.style.top,
    margin: sheet.style.margin,
    zIndex: sheet.style.zIndex,
  };

  sheet.style.position = "fixed";
  sheet.style.left = "0";
  sheet.style.top = "0";
  sheet.style.margin = "0";
  sheet.style.zIndex = "-1";

  return () => {
    sheet.style.position = prev.position;
    sheet.style.left = prev.left;
    sheet.style.top = prev.top;
    sheet.style.margin = prev.margin;
    sheet.style.zIndex = prev.zIndex;
  };
}

/**
 * Rasterize the visible one-pager sheet (`#one-pager-sheet`) to a lossless PNG
 * and trigger a download. Captures only the sheet — no toolbar or page chrome —
 * at the sheet's canonical dimensions multiplied by `scale`.
 */
export async function exportOnePagerSheetPng({
  scale,
  filename,
}: ExportOnePagerSheetPngArgs): Promise<void> {
  const sheet = document.getElementById(SHEET_ID);
  if (!(sheet instanceof HTMLElement)) {
    throw new Error(`Export failed: #${SHEET_ID} not found`);
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  // Best-effort: let sheet images settle, but never reject on a single broken asset.
  await waitUntilLoad(sheet, {
    timeout: 8000,
    onError: () => {},
    onWarn: () => {},
  });

  const root = document.documentElement;
  root.classList.add(CAPTURE_CLASS);
  const unpinSheet = pinSheetForCapture(sheet);

  try {
    await flushLayout();

    const rect = sheet.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    const blob = await domToBlob(sheet, {
      type: "image/png",
      scale,
      width,
      height,
      backgroundColor: "#ffffff",
    });

    triggerDownload(blob, filename);
  } finally {
    unpinSheet();
    root.classList.remove(CAPTURE_CLASS);
  }
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
