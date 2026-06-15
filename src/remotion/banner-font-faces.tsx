import { bannerFontFaceCss } from "./banner-fonts";

/** Injects Cursor Gothic @font-face rules for banner compositions only. */
export function BannerFontFaces() {
  return <style dangerouslySetInnerHTML={{ __html: bannerFontFaceCss() }} />;
}
