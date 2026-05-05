import type { Area } from "react-easy-crop";

const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const INITIAL_MAX_EDGE = 2048;
const MIN_EDGE = 900;
const INITIAL_QUALITY = 0.92;
const MIN_QUALITY = 0.62;

function loadImage(imageSrc: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("welcomePhotoCrop.imageLoadFailed"));
    img.decoding = "async";
    img.src = imageSrc;
  });
}

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("welcomePhotoCrop.canvasBlobFailed"));
      },
      "image/jpeg",
      quality,
    );
  });
}

async function jpegBlobWithinLimit(
  sourceCanvas: HTMLCanvasElement,
  maxEdge: number,
): Promise<Blob> {
  let edge = Math.min(maxEdge, sourceCanvas.width, sourceCanvas.height);
  const out = document.createElement("canvas");
  out.width = edge;
  out.height = edge;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("welcomePhotoCrop.no2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, edge, edge);

  let quality = INITIAL_QUALITY;

  while (true) {
    const blob = await canvasToJpegBlob(out, quality);
    if (blob.size <= PHOTO_MAX_BYTES || (quality <= MIN_QUALITY && edge <= MIN_EDGE)) {
      return blob;
    }
    if (quality > MIN_QUALITY + 1e-3) {
      quality = Math.max(MIN_QUALITY, quality - 0.06);
      continue;
    }
    const nextEdge = Math.max(MIN_EDGE, Math.floor(edge * 0.88));
    if (nextEdge >= edge) {
      return blob;
    }
    edge = nextEdge;
    out.width = edge;
    out.height = edge;
    ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, edge, edge);
    quality = INITIAL_QUALITY;
  }
}



export async function getCroppedImageJpegBlob(
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const w = Math.max(1, Math.round(pixelCrop.width));
  const h = Math.max(1, Math.round(pixelCrop.height));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("welcomePhotoCrop.no2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const sx = Math.max(0, Math.round(pixelCrop.x));
  const sy = Math.max(0, Math.round(pixelCrop.y));

  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);

  return jpegBlobWithinLimit(canvas, INITIAL_MAX_EDGE);
}
